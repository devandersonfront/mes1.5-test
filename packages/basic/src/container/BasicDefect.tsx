import React, {useEffect, useState} from 'react'
import {columnlist, excelDownload, ExcelTable, Header as PageHeader, RequestMethod} from 'shared'
import {IExcelHeaderType} from 'shared/src/@types/type'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "../../../shared/src/reducer/menuSelectState";
import ButtonGroup from 'shared/src/components/ButtonGroup';

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}


const BasicDefect = ({page, keyword, option}: IProps) => {

  const [processBasicRow, setProcessBasicRow] = useState<any[]>([]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist['pause']);

  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);


  const [defectBasicRow, setDefectBasicRow] = useState<any[]>([]);
  const [defectColumn, setDefectColumn] = useState<Array<IExcelHeaderType>>(columnlist['defectReason']);
  const [selectRow, setSelectRow] = useState<any>(0);

  const [processId, setProcessId] = useState<number>(0);

  const [state, setState] = useState<boolean>(false);

  const [selectList, setSelectList] = useState<Set<any>>(new Set());

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(()=>{
    if(processBasicRow.length > 0){
      LoadDefectList(processBasicRow[selectRow].process_id);
    }
  },[selectRow])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"품질 기준정보",sub:router.pathname}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const cleanUpBasicData = (res:any) => {
    let tmpRow = [];
    tmpRow = res.data.info_list.map((column: any,index:number) => {
      let menuData: object = {};

      menuData = {
        index:index+1,
        width: column.width,
        // id:Math.random()*100
        // id: info.ppr_id,
        // name: info.reason,
      }
      let random_id = Math.random()*1000;
      return {
        id: random_id,
        ...column,
        ...menuData
      }
    })
    setDefectBasicRow([...tmpRow]);
  }
  const LoadDefectList = async (value:string) => {
    const res = await RequestMethod("get", `defectReasonList`,{
      path: {
        page:1,
        renderItem:51,
        process_id:value
      }
    })

    if(res){
      let tmpColumn = columnlist[`defectReason`];
      tmpColumn = tmpColumn.map((value:any,index:number) => {
        return {...value, key:value.key, name:value.name, width:value.width}
      })
      setDefectColumn(tmpColumn);
      // tmpColumn.push({key:})
      let tmpRow = [];
      tmpRow = res.info_list.map((column: any,index:number) => {
        let menuData: object = {};

        menuData = {
          index:index+1,
          width: column.width,
          // id:Math.random()*100
          // id: info.ppr_id,
          // name: info.reason,
        }
        let random_id = Math.random()*1000;
        return {
          id: random_id,
          ...column,
          ...menuData
        }
      })
      setDefectBasicRow([...tmpRow]);
      Notiflix.Loading.remove(300);
    }else{
      Notiflix.Loading.remove(300);
    }

    setSelectList(new Set())
  }

  const LoadBasic = async () => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', `processList`,{
      path: {
        page: 1,
        renderItem: 51,
      }
    })
    if(res){
      if(res.info_list.length > 0){
        setProcessId(res.info_list[selectRow].process_id)
      }
      let tmpColumn = columnlist[`pause`];
      let tmpRow = []
      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object = {};

        res.menus.map((menu: any) => {
          if(menu.colName === column.key){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: 1560
            }
          }
        })

        return {
          ...column,
          ...menuData
        }
      })
      tmpRow = res.info_list
      if(res.info_list.length > 0){
        LoadDefectList(res.info_list[selectRow].process_id);
      }else{
        Notiflix.Loading.remove(300);
      }
      setProcessColumn(tmpColumn);
      setProcessBasicRow([...tmpRow.map((row: any, index) => {
        return {
          ...row, onClicked: index === 0 ? true : false
        }
      })])
    }
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    defectBasicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(defectColumn, defectBasicRow, `공정별 불량유형 등록`, '공정별 불량유형 등록', tmpSelectList)
  }

  const convertDataToMap = () => {
    const map = new Map()
    defectBasicRow.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return defectBasicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.pdr_id){
        haveIdRows.push(row)
      }
    })

    return haveIdRows
  }

  const DeleteBasic = async () => {

    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const haveIdRows = classfyNormalAndHave(selectedRows)
    let deletable = true

    if(haveIdRows.length > 0){

      deletable = await RequestMethod('delete','defectDelete', haveIdRows)

    }

    if(deletable){
      selectedRows.forEach((row)=>{ map.delete(row.id)})
      Notiflix.Report.success('삭제되었습니다.','','확인');
      setDefectBasicRow(Array.from(map.values()))
      setSelectList(new Set())
    }
  }
  
  const validateSaveRequestBody = () => {
    const filtered = defectBasicRow.filter(value => value.reason !== "" && value.reason !== undefined)
    const reasons = filtered.map(defectReason => defectReason.reason)
    if(filtered.length === 0) {
      Notiflix.Report.warning("저장할 데이터가 없습니다", "", "확인");
    }else if(reasons.length != new Set(reasons).size){
      Notiflix.Report.warning("불량 유형은 중복될 수 없습니다.","","확인");
    }
    return filtered
  }
  
  const buttonEvents = async(index:number) => {
    switch (index) {
      case 0 :
        setExcelUploadOpen(true)
        return
      case 1 :
        downloadExcel();
        return
      case 2 :
        let dataRow:any = {};

        columnlist[`defectReason`].map((key:any,index:number)=>{
          if(key.key === "index"){
            dataRow[key.key] = defectBasicRow.length+1;
            dataRow.id = Math.random()*100;
          }else{
            dataRow[key.key] = "";
          }
        })

        if(processId !== 0){
          defectBasicRow.push({...dataRow})
          setDefectBasicRow([...defectBasicRow])
        }else{
          Notiflix.Report.warning("선택된 공정이 없습니다.","","확인");
        }
        // defectBasicRow.push({...dataRow})
        // setDefectBasicRow([...defectBasicRow])
        return
      case 3 :
        // let validation = true;
        Notiflix.Loading.circle();
        let saveDefectBasicRow:any[] = [];
        validateSaveRequestBody()
          .map((value,i)=>{
            saveDefectBasicRow.push({...value, process_id:processBasicRow[selectRow].process_id, seq:i+1});
          })
        if(defectBasicRow.length > 0 ){
          RequestMethod("post", `defectSave`, saveDefectBasicRow
        ).then(()=>{
            Notiflix.Loading.remove(300);
            Notiflix.Report.success("저장되었습니다.","","확인");
            LoadDefectList(processBasicRow[selectRow].process_id);

          })
        }
        return

      case 4 :

        if(selectList.size === 0){
          return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
          async()=>{
            const idList = [];
            // const spliceArray:number[] = [];

            defectBasicRow.map((v,i)=> {
              if(selectList.has(v.id)){
                // spliceArray.push(i);
                idList.push(v)
              }
            })

            const tmpDefectBasicRow = [...defectBasicRow];
            // spliceArray.reverse();
            // spliceArray.map((value, index)=>{
            //   tmpDefectBasicRow.splice(value, 1);
            // })

            const res = await RequestMethod("delete", `defectDelete`, idList );

            if(res){
              Notiflix.Report.success("삭제되었습니다.","","확인", () => {
                sortObject(tmpDefectBasicRow);
                LoadDefectList(processBasicRow[selectRow].process_id);
              });
            }
          },
          ()=>{
              const idList = [];
            defectBasicRow.map((v,i)=> {
              if(selectList.has(v.id)){
                // spliceArray.push(i);
                idList.push(v)
              }
            })
          }
        );
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
          () => DeleteBasic()
        )
    }


  const sortObject = (object:any) => {
    const  compare_qty = (a:any, b:any) => {
      // a should come before b in the sorted order
      if(a.lengthIndex < b.lengthIndex){
        return -1;
        // a should come after b in the sorted order
      }else if(a.lengthIndex > b.lengthIndex){
        return 1;
        // a and b are the same
      }else{
        return 0;
      }
    }

    object.sort(compare_qty)
    let sortData = object.map((v:object, index:number)=>{
      return {...v, index:index+1, lengthIndex:index+1}
    });
    setDefectBasicRow([...sortData]);

  }

  useEffect(()=>{

    LoadBasic();
  },[])

  useEffect(()=>{
    if(state){
      sortObject(defectBasicRow);
      setState(false);
    }
  },[defectBasicRow])


  return (
    <div>
      <PageHeader title={"공정별 불량유형 등록"} />
      <ExcelTable
        editable
        headerList={[
          ...processColumn
        ]}
        row={processBasicRow}
        setRow={setProcessBasicRow}
        onRowClick={(clicked) => {const e = processBasicRow.indexOf(clicked)
          const clickedList = processBasicRow.map((data, index) => {
            if (e === index) {
              return { ...data, onClicked: true }
            } else {
              return { ...data, onClicked: false }
            }
          })
          setProcessBasicRow(clickedList)
          setSelectRow(e)
        }}
        width={1576}
        height={300}
      />
      <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                        <span style={{color:"white", fontSize:22, fontWeight:"bold"}}>
                            {processBasicRow[selectRow] && processBasicRow[selectRow].name}
                        </span>
        <ButtonGroup buttons={[ "", "", "행 추가", "저장하기", "삭제"]} buttonsOnclick={buttonEvents}/>
      </div>
      <ExcelTable
        editable
        selectable
        headerList={[
          SelectColumn,
          ...defectColumn
        ]}
        row={defectBasicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          e.map(v => {
            if(v.isChange) {
              tmp.add(v.id)
              v.isChange = false
            }
          })
          setSelectList(tmp)
          setState(true)
          setDefectBasicRow(e)
        }}
        height={440}
        // setSelectList={changeSetSelectList}
        //@ts-ignore
        setSelectList={setSelectList}
        selectList={selectList}
      />
    </div>
  );
}


export {BasicDefect};

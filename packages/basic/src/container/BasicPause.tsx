import React, {useEffect, useState} from 'react'
import {columnlist, excelDownload, ExcelTable, Header as PageHeader, RequestMethod,} from 'shared'
import {IExcelHeaderType} from 'shared/src/common/@types/type'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import ButtonGroup from '../../../main/component/ButtonGroup'
import {useDispatch} from "react-redux";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicPause = ({page, keyword, option}: IProps) => {

  const [processBasicRow, setProcessBasicRow] = useState<any[]>([]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`pause`]);

  const [processId, setProcessId] = useState<number>(0);

  const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
  const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`pauseReason`]);
  const [selectRow, setSelectRow] = useState<any>(0);

  const [state, setState] = useState<boolean>(false);

  const [selectList, setSelectList] = useState<Set<any>>(new Set());

  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);

  const router = useRouter()
  const dispatch = useDispatch()
  useEffect(()=>{
    if(processBasicRow.length > 0){
      LoadPauseList(processBasicRow[selectRow].process_id);
    }
  },[selectRow])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"공정 관리",sub:router.pathname}))
    return (() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const cleanUpBasicData = (res:any) => {
    let tmpRow = [];
    tmpRow = res.info_list.map((column: any,index:number) => {
      let menuData: object = {};

      menuData = {
        index:index+1,
        width: column.width,
      }
      let random_id = Math.random()*1000;
      return {
        id: random_id,
        ...column,
        ...menuData
      }
    })
    setPauseBasicRow([...tmpRow]);
  }

  const LoadPauseList = async (value:string) => {
    // const res =
    await RequestMethod("get", `pauseReasonList`, {
      path: {
        page: 1,
        renderItem: 51,
        process_id: value
      }
    })
        .then((res) => {

          let tmpColumn = columnlist[`pauseReason`];
          tmpColumn = tmpColumn.map((value: any, index: number) => {
            return {...value, key: value.key, name: value.name, width: value.width}
          })
          setPauseColumn(tmpColumn);

          let tmpRow = [];
          tmpRow = res.info_list.map((column: any, index: number) => {
            let menuData: object = {};

            menuData = {
              index: index + 1,
              width: column.width,
            }
            let random_id = Math.random() * 1000;
            return {
              id: random_id,
              ...column,
              ...menuData
            }
          })
          Notiflix.Loading.remove(300);
          setPauseBasicRow([...tmpRow]);

        })

        setSelectList(new Set())
  }

  const LoadBasic = async () => {
    Notiflix.Loading.circle();
    // const res = await
    RequestMethod('get', `processList`,{
      path: {
        page: 1,
        renderItem:51,
      }
    }).then((res) => {
            let tmpColumn = columnlist[`pause`];
            if(res.info_list.length > 0){
              setProcessId(res.info_list[selectRow].process_id);
            }
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
              LoadPauseList(res.info_list[selectRow].process_id);
            }else{
              Notiflix.Loading.remove(300);
            }
            setProcessColumn(tmpColumn);
            setProcessBasicRow([...tmpRow.map((row: any,index) => {
              return {
                ...row, onClicked: index === 0 ? true : false
              }
            })])
            Notiflix.Loading.remove(300);

        })
        .catch((err) => {
          Notiflix.Report.failure('불러올 수 없습니다.', err, '확인', () => {
            router.back()
          })
        })
  }
  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    pauseBasicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })

    excelDownload(pauseColumn, pauseBasicRow, `일시정지 유형 등록`, '일시정지 유형 등록', tmpSelectList)
  }



  const convertDataToMap = () => {
    const map = new Map()
    pauseBasicRow.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return pauseBasicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.ppr_id){
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

      deletable = await RequestMethod('delete','pauseDelete', haveIdRows)
    }

    if(deletable){
      selectedRows.forEach((row)=>{ map.delete(row.id)})
      Notiflix.Report.success('삭제되었습니다.','','확인');
      setPauseBasicRow(Array.from(map.values()))
      setSelectList(new Set())
    }
  }

  const validateSaveRequestBody = () => {
    const filtered = pauseBasicRow.filter(value => value.reason !== "" && value.reason !== undefined)
    const reasons = filtered.map(pauseReason => pauseReason.reason)
    if(filtered.length === 0) {
      Notiflix.Report.warning("저장할 데이터가 없습니다", "", "확인");
    }else if(reasons.length != new Set(reasons).size){
      Notiflix.Report.warning("일시정지 유형은 중복될 수 없습니다.","","확인");
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

        columnlist[`pauseReason`].map((key:any,index:number)=>{
          if(key.key === "index"){
            dataRow[key.key] = pauseBasicRow.length+1;
            dataRow.id = Math.random()*100;
            // dataRow.id = index+1;
          }else{
            dataRow[key.key] = "";
          }
        })

        if(processId !== 0){
          pauseBasicRow.push({...dataRow})
          setPauseBasicRow([...pauseBasicRow])
        }else{
          Notiflix.Report.warning("선택된 공정이 없습니다.","","확인");
        }
        return

      case 3 :
        Notiflix.Loading.circle();
        let savePauseBasicRow:any[] = [];
        validateSaveRequestBody()
          .map((value,index)=>{
            savePauseBasicRow.push({...value, process_id:processBasicRow[selectRow].process_id, seq:index+1});
        })
        if(pauseBasicRow.length > 0 ) {
          RequestMethod("post", `pauseSave`, savePauseBasicRow
          ).then(() => {
            Notiflix.Report.success("저장되었습니다.", "", "확인", () => {
              LoadPauseList(processBasicRow[selectRow].process_id);
            });
          }).catch((e) => {
            Notiflix.Loading.remove(300);
            Notiflix.Report.warning("관리자에게 문의하세요.", "", "확인");
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
          () => DeleteBasic()
          // async()=>{
          //   const idList = [];
          //   const spliceArray:number[] = [];

          //   pauseBasicRow.map((v)=> {
          //     if(selectList.has(v.id)){
          //       idList.push(v)
          //     }
          //   })

          //   const tmpPauseBasicRow = [...pauseBasicRow];
          //   spliceArray.reverse();
          //   spliceArray.map((value, index)=>{
          //     tmpPauseBasicRow.splice(value, 1);
          //   })

          //   const res = await RequestMethod("delete", `pauseDelete`, idList );

          //   if(res){
          //     Notiflix.Report.success("삭제되었습니다.",""," 확인", () => {
          //       sortObject(tmpPauseBasicRow);
          //       LoadPauseList(processBasicRow[selectRow].process_id);
          //     });
          //   }else{
          //     Notiflix.Report.success("에러가 발생했습니다.",""," 확인");
          //   }
          // },
          // ()=>{}
        )
    }
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
    setPauseBasicRow([...sortData]);

  }

  useEffect(()=>{
    LoadBasic();
  },[])

  useEffect(()=>{
    if(processBasicRow.length > 0){
      LoadPauseList(processBasicRow[selectRow].process_id)
    }
  }, [selectRow])

  useEffect(()=>{
    if(state){
      sortObject(pauseBasicRow);
      setState(false);
    }
  },[pauseBasicRow])

  return (
    <div>
      <PageHeader title={"공정 일시정지 유형 등록"} />
      <div style={{marginTop:15}}>
        <ExcelTable
          editable
          headerList={[
            ...processColumn
          ]}
          row={processBasicRow}
          setRow={setProcessBasicRow}
          setSelectRow={(e) => {
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
          height={280}
        />
        <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                        <span style={{color:"white", fontSize:22, fontWeight:"bold"}}>
                            {processBasicRow[selectRow] && processBasicRow[selectRow].name}
                        </span>
          <ButtonGroup buttons={['', '', "행 추가", "저장하기", "삭제"]} buttonsOnclick={buttonEvents}/>
        </div>
        <ExcelTable
          editable
          headerList={[
            SelectColumn,
            ...pauseColumn
          ]}
          row={pauseBasicRow}
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
            setPauseBasicRow(e)
          }}
          height={440}
          // setSelectList={changeSetSelectList}
          //@ts-ignore
          setSelectList={setSelectList}
          selectList={selectList}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export {BasicPause};

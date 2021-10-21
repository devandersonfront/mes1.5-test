import React, {useEffect, useState} from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
  columnlist,
  MAX_VALUE,
  DropDownEditor,
  TextEditor,
  excelDownload,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType, IItemMenuType
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import TreeViewTable from '../../../main/component/TreeView/TreeView'
import {IMenu} from '../../../main/common/@types/type'
import {AUTHORITY_LIST} from '../../../main/common/configset'
import {AxiosResponse} from 'axios'
import styled from 'styled-components'
import ButtonGroup from '../../../main/component/ButtonGroup'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '권한 관리'

const BasicDefect = ({page, keyword, option}: IProps) => {

  const [processBasicRow, setProcessBasicRow] = useState<any[]>([]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`pause`] );

  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);


  const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
  const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`defectReason`]);
  const [selectRow, setSelectRow] = useState<any>(0);

  const [processId, setProcessId] = useState<number>(0);

  const [state, setState] = useState<boolean>(false);

  const [selectList, setSelectList] = useState<Set<any>>(new Set());

  const router = useRouter()

  useEffect(()=>{
    if(processBasicRow.length > 0){
      LoadPauseList(processBasicRow[selectRow].process_id);
    }
  },[selectRow])

  const cleanUpBasicData = (res:any) => {
    let tmpRow = [];
    tmpRow = res.data.results.info_list.map((column: any,index:number) => {
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
    setPauseBasicRow([...tmpRow]);
  }
  const LoadPauseList = async (value:string) => {
    const res = await RequestMethod("get", `defectReasonList`,{
      path: {
        page:1,
        renderItem:51,
        process_id:value
      }
    })

    if(res && res.status === 200){
      let tmpColumn = columnlist[`defectReason`];
      tmpColumn = tmpColumn.map((value:any,index:number) => {
        return {...value, key:value.key, name:value.name, width:value.width}
      })
      setPauseColumn(tmpColumn);
      // tmpColumn.push({key:})
      let tmpRow = [];
      tmpRow = res.results.info_list.map((column: any,index:number) => {
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
      setPauseBasicRow([...tmpRow]);
      Notiflix.Loading.remove(300);
    }else{
      Notiflix.Loading.remove(300);
    }
  }

  const LoadBasic = async () => {
    Notiflix.Loading.standard();
    const res = await RequestMethod('get', `processList`,{
      path: {
        page: 1,
        renderItem: 51,
      }
    })
    if(res && res.status === 200){
      if(res.results.info_list.length > 0){
        setProcessId(res.results.info_list[selectRow].process_id)
      }
      let tmpColumn = columnlist[`pause`];
      let tmpRow = []
      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object = {};

        res.results.menus.map((menu: any) => {
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
      tmpRow = res.results.info_list
      if(res.results.info_list.length > 0){
        LoadPauseList(res.results.info_list[selectRow].process_id);
      }else{
        Notiflix.Loading.remove(300);
      }
      setProcessColumn(tmpColumn);
      setProcessBasicRow([...tmpRow.map((row: any) => {
        return {
          ...row,
        }
      })])
    }else if (res.state === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    pauseBasicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(pauseColumn, pauseBasicRow, `공정별 불량유형 등록`, '공정별 불량유형 등록', tmpSelectList)
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
            dataRow[key.key] = pauseBasicRow.length+1;
            dataRow.id = Math.random()*100;
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
        // pauseBasicRow.push({...dataRow})
        // setPauseBasicRow([...pauseBasicRow])
        return
      case 3 :
        // let validation = true;
        Notiflix.Loading.standard();
        let savePauseBasicRow:any[] = [];
        pauseBasicRow.map((value)=>{
          if(value.reason === "" || value.reason === undefined){
            // validation = false;
          }else{
            savePauseBasicRow.push(value);
          }
        })
        if(pauseBasicRow.length > 0 ){
          RequestMethod("post", `defectSave`, {
            process_id:processBasicRow[selectRow].process_id,
            reasons:savePauseBasicRow
          }).then(()=>{
            Notiflix.Loading.remove(300);
            Notiflix.Report.success("저장되었습니다.","","확인");
            LoadBasic();
          })
        }else{
          Notiflix.Loading.remove(300);
          Notiflix.Report.warning("저장할 데이터가 없습니다", "", "확인");
        }
        return

      case 4 :
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          async()=>{
            const idList:number[] = [];
            const spliceArray:number[] = [];

            pauseBasicRow.map((v,i)=> {
              if(selectList.has(v.id)){
                spliceArray.push(i);
                idList.push(v.pdr_id)
              }
            })

            const tmpPauseBasicRow = [...pauseBasicRow];
            spliceArray.reverse();
            spliceArray.map((value, index)=>{
              tmpPauseBasicRow.splice(value, 1);
            })

            const res = await RequestMethod("delete", `defectDelete`, {reasons:idList.filter(v => v) } );

            if(res && res.status === 200){
              Notiflix.Report.success("삭제되었습니다.","","확인");
              sortObject(tmpPauseBasicRow);
              // LoadPauseList(processBasicRow[selectRow].process_id);
            }
          },
          ()=>{}
        );


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
    if(state){
      sortObject(pauseBasicRow);
      setState(false);
    }
  },[pauseBasicRow])
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
        setSelectRow={setSelectRow}
        width={1576}
        height={300}
      />
      <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                        <span style={{color:"white", fontSize:22, fontWeight:"bold"}}>
                            {processBasicRow[selectRow] && processBasicRow[selectRow].name}
                        </span>
        <ButtonGroup buttons={[ "엑셀로 등록", "엑셀로 받기", "행 추가", "저장하기", "삭제"]} buttonsOnclick={buttonEvents}/>
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
            if(v.isChange) tmp.add(v.id)
          })
          setSelectList(tmp)
          setState(true)
          setPauseBasicRow(e)
        }}
        width={1570}
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

import React, {useEffect, useState} from 'react'
import { columnlist, excelDownload, ExcelTable, Header as PageHeader, PaginationComponent, RequestMethod } from 'shared'
import {IExcelHeaderType} from 'shared/src/@types/type'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "../../../shared/src/reducer/menuSelectState";
import ButtonGroup from 'shared/src/components/ButtonGroup';
import { setExcelTableHeight } from 'shared/src/common/Util'
import { sum } from 'lodash'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}


const BasicDefect = ({}: IProps) => {

  const [processBasicRow, setProcessBasicRow] = useState<any[]>([]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist['defect']);
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
  const [defectBasicRow, setDefectBasicRow] = useState<any[]>([]);
  const [defectColumn, setDefectColumn] = useState<any>(columnlist['defectReason']());
  const [selectRow, setSelectRow] = useState<any>(0);
  const [processId, setProcessId] = useState<number>(0);
  const [selectIds, setSelectIds] = useState<Set<any>>(new Set());
  const [pageInfo, setPageInfo] = useState<{total: number, page: number}>({
    total: 1,
    page: 1
  })

  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(()=>{
    LoadBasic(pageInfo.page);
  },[pageInfo.page])

  useEffect(()=>{
    if(processBasicRow.length > 0 && selectRow > -1){
      LoadDefectList(processId);
    }
  },[processId])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"품질 기준정보",sub:router.pathname}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const setMenu = (menus: any[]) => (
    columnlist.defect.map(col => {
      const newMenus = menus.filter(menu => menu.colName === col.key).map(menu => ({
        id: menu.mi_id,
        name: menu.title,
        width: 400 }))
      return {...col, ...newMenus[0]}
    })
  )

  const LoadBasic = async (page: number = 1) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', `processList`,{
      path: {
        page: page,
        renderItem:18,
      }
    })

    if(res) {
      if (res.totalPages > 0 && res.totalPages < res.page) {
        LoadBasic();
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages,
        });
        if(res.info_list.length - 1 < selectRow)
        {
          setSelectRow(0)
        }
        setProcessId(res.info_list[selectRow]?.process_id ?? res.info_list[0].process_id)
        setProcessColumn(setMenu(res.menus));
        setProcessBasicRow([ ...res.info_list])
      }
    }
    setSelectIds(new Set)
    Notiflix.Loading.remove();
  }

  const LoadDefectList = async (processId:number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod("get", `defectReasonList`,{
      path: {
        page:1,
        renderItem:51,
        process_id : processId
      }
    })

    if(res){
      setDefectColumn(columnlist[`defectReason`]);
      setDefectBasicRow(res.info_list?.map((info: any, index: number) => {
        let random_id = Math.random() * 1000;
        return {
          ...info,
          id: random_id,
          seq: index + 1
        }
      }));

    }
    setSelectIds(new Set())
    Notiflix.Loading.remove();
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    defectBasicRow.map(row => {
      tmpSelectList.push(selectIds.has(row.id))
    })
    excelDownload(defectColumn, defectBasicRow, `공정별 불량유형 등록`, '공정별 불량유형 등록', tmpSelectList)
  }

  const DeleteBasic = async () => {
    const rowsToDelete = defectBasicRow.filter((row)=> selectIds.has(row.id))
    const rowsToRemain = defectBasicRow.filter((row)=> !selectIds.has(row.id)).map((row, idx) => ({...row, seq: idx + 1}))
    const rowsToRequest = rowsToDelete.filter((row) => row.ppr_id)

    try{
      if(rowsToRequest.length > 0){
        await RequestMethod('delete','pauseDelete', rowsToRequest)
      }
      Notiflix.Report.success('삭제되었습니다.','','확인');
      setDefectBasicRow(rowsToRemain)
      setSelectIds(new Set())
    } catch (e) {

    }
  }

  const validateSaveRequestBody = () => {
    const defectReasons = defectBasicRow.map(defect => {
      if(!!!defect.reason){
        throw('저장할 데이터가 없습니다')
      } else {
        return {
          ...defect, process_id: processId
        }
      }
    } )
    const reasonNames = defectReasons.map(defectReason => defectReason.reason)
    if(reasonNames.length != new Set(reasonNames).size){
      throw("불량 유형은 중복될 수 없습니다.");
    }
    return defectReasons
  }

  const addRow = () => {
    let newDefectReasons:any = {};
    columnlist['defectReason']().map((dr:any,index:number)=>{
      if(dr.key === "seq"){
        newDefectReasons[dr.key] = defectBasicRow.length+1;
        newDefectReasons.id = Math.random()*100;
      }else{
        newDefectReasons[dr.key] = "";
      }
    })
    try{
      if(processId !== 0){
        defectBasicRow.push(newDefectReasons)
        if(defectBasicRow.length > 50) throw('불량 유형은 최대 50개까지 등록가능합니다.')
        setDefectBasicRow([...defectBasicRow])
      } else{
        throw("선택된 공정이 없습니다.")
      }
    } catch(e)
    {
      Notiflix.Report.warning("경고",e,"확인");
    }
  }

  const saveDefectReasons = async () => {
    try{
      const saveDefectBasicRow = validateSaveRequestBody()
      if(saveDefectBasicRow.length > 0 ) {
        Notiflix.Loading.circle();
        await RequestMethod("post", `defectSave`, saveDefectBasicRow
        ).then(() => {
          Notiflix.Report.success("저장되었습니다.", "", "확인", () => {
            LoadDefectList(processId);
          });
        })}
    }catch (e) {
      Notiflix.Report.warning("경고", e, "확인");
    }
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
        addRow()
        return
      case 3 :
        saveDefectReasons()
        return

      case 4 :
        if (selectIds.size === 0) {
          return Notiflix.Report.warning(
            '경고',
            '선택된 정보가 없습니다.',
            '확인',
          );
        }

        Notiflix.Confirm.show("경고", "삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)", "확인", "취소",
          () => DeleteBasic()
        )
    }
  }

  return (
    <div>
      <PageHeader title={"공정별 불량유형 등록"} />
      <div style={{display:'flex', justifyContent:'space-between', width:1300}}>
        <div>
          <ExcelTable
            editable
            headerList={[
              ...processColumn
            ]}
            row={processBasicRow}
            setRow={setProcessBasicRow}
            onRowClick={(clicked) => {
              const e = processBasicRow.indexOf(clicked)
              setSelectRow(e)
              setProcessId(clicked.process_id)
            }}
            width={400}
            height={setExcelTableHeight(processBasicRow.length)}

          />
          <PaginationComponent
            currentPage={pageInfo.page}
            totalPage={pageInfo.total}
            setPage={(page) => {
              setPageInfo({...pageInfo,page:page})
            }}
          />
        </div>
        <div>
          <div style={{display:"flex", justifyContent:"space-between", margin:"0 0 15px 0"}}>
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
              ...columnlist.defectReason(defectBasicRow, setDefectBasicRow)
              ]}
            row={defectBasicRow}
            setRow={(data, index) => {
              setDefectBasicRow(data)
            }}
            height={440}
            //@ts-ignore
            setSelectList={setSelectIds}
            selectList={selectIds}
            width={820}
          />
        </div>
      </div>
    </div>
  );
}


export {BasicDefect};

import React, {useEffect, useState} from 'react'
import {
  columnlist,
  excelDownload,
  ExcelTable,
  Header as PageHeader,
  PaginationComponent,
  RequestMethod
} from 'shared'
import {IExcelHeaderType} from 'shared/src/@types/type'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import ButtonGroup from 'shared/src/components/ButtonGroup';
import { sum } from 'lodash'
import { setExcelTableHeight } from 'shared/src/common/Util'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicPause = ({}: IProps) => {
  const [processBasicRow, setProcessBasicRow] = useState<any[]>([]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`pause`]);
  const [pauseColumn, setPauseColumn] = useState<any>(columnlist[`pauseReason`]());
  const [processId, setProcessId] = useState<number>(0);
  const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
  const [selectRow, setSelectRow] = useState<any>(0);
  const [selectIds, setSelectIds] = useState<ReadonlySet<number>>(new Set());
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
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
      LoadPauseList(processId);
    }
  },[processId])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"공정 관리",sub:router.pathname}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const setMenu = (menus: any[]) => (
    columnlist.pause.map(col => {
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

  const LoadPauseList = async (processId:number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod("get", `pauseReasonList`, {
      path: {
        page: 1,
        renderItem: 51,
        process_id: processId
      }
    })

    if(res) {
      setPauseColumn(columnlist[`pauseReason`]);
      setPauseBasicRow(res.info_list?.map((info: any, index: number) => {
        let random_id = Math.random() * 1000;
        return {
          ...info,
          id: random_id,
          seq: index + 1
        }
      }));

    }
    setSelectIds(new Set())
    Notiflix.Loading.remove(300);
  }


  const downloadExcel = () => {
    let tmpselectIds: boolean[] = []
    pauseBasicRow.map(row => {
      tmpselectIds.push(selectIds.has(row.id))
    })

    excelDownload(pauseColumn, pauseBasicRow, `일시정지 유형 등록`, '일시정지 유형 등록', tmpselectIds)
  }

  const DeleteBasic = async () => {
    const rowsToDelete = pauseBasicRow.filter((row)=> selectIds.has(row.id))
    const rowsToRemain = pauseBasicRow.filter((row)=> !selectIds.has(row.id)).map((row, idx) => ({...row, seq: idx + 1}))
    const rowsToRequest = rowsToDelete.filter((row) => row.ppr_id)

    try{
      if(rowsToRequest.length > 0){
        await RequestMethod('delete','pauseDelete', rowsToRequest)
      }
      Notiflix.Report.success('삭제되었습니다.','','확인');
      setPauseBasicRow(rowsToRemain)
      setSelectIds(new Set())
    } catch (e) {

    }
  }

  const validateSaveRequestBody = () => {
    const pauseReasons = pauseBasicRow.map(pause => {
      if(!!!pause.reason){
        throw('저장할 데이터가 없습니다')
      } else {
        return {
          ...pause, process_id: processId
        }
      }
    } )
    const reasonNames = pauseReasons.map(pauseReason => pauseReason.reason)
    if(reasonNames.length != new Set(reasonNames).size){
      throw("일시정지 유형은 중복될 수 없습니다.");
    }
    return pauseReasons
  }

  const addRow = () => {
    let newPauseReason:any = {};
    columnlist[`pauseReason`]().map((pr:any,index:number)=>{
      if(pr.key === "seq"){
        newPauseReason[pr.key] = pauseBasicRow.length+1;
        newPauseReason.id = Math.random()*100;
      }else{
        newPauseReason[pr.key] = "";
      }
    })
    try{
      if(processId !== 0){
        pauseBasicRow.push(newPauseReason)
        if(pauseBasicRow.length > 50) throw('일시정지 유형은 최대 50개까지 등록가능합니다.')
        setPauseBasicRow([...pauseBasicRow])
      } else{
       throw("선택된 공정이 없습니다.")
      }
    } catch(e)
    {
      Notiflix.Report.warning("경고",e,"확인");
    }
  }

  const savePauseReasons = async () => {
    try{
      const savePauseBasicRow = validateSaveRequestBody()
      if(savePauseBasicRow.length > 0 ) {
      Notiflix.Loading.circle();
        await RequestMethod("post", `pauseSave`, savePauseBasicRow
        ).then(() => {
          Notiflix.Report.success("저장되었습니다.", "", "확인", () => {
            LoadPauseList(processId);
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
        savePauseReasons()
        return
      case 4 :
        if(selectIds.size === 0){
          return Notiflix.Report.warning(
        '경고',
        '선택된 정보가 없습니다.',
        '확인',
        );
        }
        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
          () => DeleteBasic()
        )
    }
  }

  return (
    <div>
      <PageHeader title={"공정 일시정지 유형 등록"} />
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
            <ButtonGroup buttons={['', '', "행 추가", "저장하기", "삭제"]} buttonsOnclick={buttonEvents}/>
          </div>
          <ExcelTable
            editable
            selectable
            headerList={[
              SelectColumn,
              ...columnlist.pauseReason(pauseBasicRow, setPauseBasicRow)
            ]}
            row={pauseBasicRow}
            setRow={(data, index) => {
              setPauseBasicRow(data)
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

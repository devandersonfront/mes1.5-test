import React, {useState} from 'react'
import {
  BarcodeModal,
  columnlist,
  excelDownload,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {NextPageContext} from 'next'
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util';
import { alertMsg } from 'shared/src/common/AlertMsg'

export interface IProps {
  children?: any
}

const initRow = () => (
  {sequence: 1, id: new Date().getTime(), type: '완제품', type_id: 2, product_type: '생산품'}
)
const ProductBatchRegister = (props: IProps) => {
  const [rows, setRows] = useState<Array<any>>([initRow()])
  const [columns, setColumns] = useState<Array<IExcelHeaderType>>( columnlist["productBatchRegister"])
  const [selectedList, setSelectedList] = useState<Set<number>>(new Set())

  const validate = (row) => {
    if(!!!row.code) throw('CODE는 필수입니다.')
    if(!!!row.process_id) throw('생산 공정은 필수입니다.')
  }

  const onSave = async () => {
    try {
      // const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => {
      //   validate(row)
      //   return {
      //     ...row,
      //     customer: row?.customerArray?.customer_id ? row.customerArray : null,
      //     customer_id: undefined,
      //     model: row?.modelArray?.cm_id ? row.modelArray : null,
      //     molds:row?.molds?.map((mold)=>{
      //       return { setting:mold.setting , mold : {...mold.mold } , sequence : mold.sequence }
      //     }).filter((mold) => mold.mold.mold_id) ?? [],
      //     tools:[
      //       ...row?.tools?.map((tool) => {
      //         return {...tool,
      //           tool:{tool_id:tool.tool.tool_id, code: tool.tool.code, name: tool.tool.name, customer:tool.tool.customerData, additional:tool.tool.additional},
      //           setting:tool.setting}
      //       }).filter((tool) => tool.tool.tool_id) ?? [],
      //     ],
      //     machines:[
      //       ...row?.machines?.map((machine)=>{
      //         return {
      //           sequence : machine.sequence,
      //           setting: machine.setting,
      //           // machine:{...machine.machine, type:machine.machine.type_id, weldingType:machine.machine.weldingType_id}
      //           machine : {
      //             ...machine.machine,
      //             type : machine.machine.type_id,
      //             weldingType : machine.machine.weldingType_id,
      //           }
      //         }
      //       }).filter((machine) => machine.machine.machine_id)?? []
      //     ],
      //     work_standard_image:row.work_standard_image?.uuid,
      //     type: row.type_id,
      //     additional: addedColumn.map((col, colIdx)=> ({
      //           mi_id: col.id,
      //           title: col.name,
      //           value: row[col.key] ?? "",
      //           unit: col.unit,
      //           ai_id: row.additional[colIdx]?.ai_id ?? undefined,
      //           version:row.additional[colIdx]?.version ?? undefined
      //         }))
      //   }
      // })
      Notiflix.Loading.circle();
      // const res = await RequestMethod('post', `productSave`,postBody)
      // if(res){
      //   Notiflix.Report.success('저장되었습니다.','','확인', () => reload());
      // }
      Notiflix.Loading.remove()
    } catch(errMsg) {
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const onDelete = () => {
    const notDeleted = rows.filter(row => !selectedList.has(row.id)).map((row, rowIdx) => ({...row,  sequence: rows.length - rowIdx}))
    setRows(notDeleted)
    selectedList.clear()
    setSelectedList(selectedList)
  }

  const syncWithFirstRow = (self, firstRow, sequence) => {
    return {
      ...firstRow,
      isChange: false,
      sequence,
      code: !!firstRow.code ? firstRow.code + '-' + sequence : undefined,
      name: !!firstRow.name ? firstRow.name + '-' + sequence : undefined,
      product_type: self.product_type,
      type: self.type,
      type_id: self.type_id,
      unit: self.unit,
      unit_id: self.unit_id,
      bom: self.bom,
      process_id: self.process_id,
      process: self.process,
      molds: self.molds,
      machines: self.machines,
    }
  }

  const onAddRow = () => {
    rows.splice(1,0,syncWithFirstRow({type: '반제품', type_id: 0, id: new Date().getTime(), product_type: '생산품' }, rows[0], rows.length))
    const newRows = rows.map((row, rowIdx) => {
      return {
        ...row,
        sequence: rows.length - rowIdx
    }})
    setRows(newRows)
  }

  const onClickButton = (btnIdx: number) => {
    try{
      switch(btnIdx){
        case 0:
          onAddRow()
          break;
        case 1 :
          onSave()
          break;
        case 2:
            if(selectedList.size === 0) throw(alertMsg.noSelectedData)
            if(selectedList.has(rows[0].id)) throw(alertMsg.noFirstDelete)
            Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
                ()=> onDelete()
                ,()=>{}
            )
          break;
      }
    }catch(errMsg){
      Notiflix.Report.warning(
        '경고',
        errMsg,
        '확인',
      );
    }
  }

  const checkDuplicateCode = (rows) => {
    const codes = rows.map(row => row.code)
    const codesSet = new Set(codes)
    if(codes.length !== codesSet.size){
      Notiflix.Report.warning(
        '경고',
        alertMsg.duplicateCode,
        '확인'
      );
      return true
    }
    return false
  }

  return (
      <div>
        <PageHeader
          title={'제품 BOM 일괄 등록'}
          buttons={['행추가', '저장하기', '삭제']}
          buttonsOnclick={onClickButton}
          pageHelper={"각 제품의 바로 밑의 제품은 기본적으로 BOM으로 추가됩니다."}
        />
        <ExcelTable
            headerList={[SelectColumn, ...columns]}
            row={rows}
            setRow={(newRows, newRowsIdx) => {
              if(checkDuplicateCode(newRows)) return
              const _newRows = newRows.map((newRow, newRowIdx) => {
                const sequence = newRows.length - newRowIdx
                if(newRowsIdx === 0 && newRowIdx !== 0){
                  return syncWithFirstRow(newRow, newRows[0], sequence)
                } else {
                  return {
                    ...newRow,
                    isChange: false,
                    sequence
                  }
                }
              })
              setRows(_newRows)
            }}
            selectList={selectedList}
            // //@ts-ignore
            setSelectList={ (selectedIds) => {
              setSelectedList(selectedIds as any)
            }}
            width={1576}
            height={setExcelTableHeight(rows.length)}
        />
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

export {ProductBatchRegister};

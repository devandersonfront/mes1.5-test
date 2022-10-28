import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Modal from 'react-modal'
import { POINT_COLOR } from '../../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../../public/images/ic_x.png'
import { ExcelTable } from '../../Excel/ExcelTable'
import { searchModalList } from '../../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../../public/images/btn_search.png'
import { RequestMethod } from '../../../common/RequestFunctions'
import { SearchInit } from './SearchModalInit'
import Notiflix from 'notiflix'
import { SearchModalResult, SearchResultSort } from '../../../Functions/SearchResultSort'
import { SearchIcon } from "../../../styles/styledComponents";
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import moment from 'moment'
import { IExcelHeaderType } from '../../../@types/type'
//@ts-ignore
import ModalSearch_icon from '../../../../public/images/list_search_icon.png'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const setMapWithSaved = (type: string, map: Map<number, any>, row: any) => {
  switch(type){
    case 'allProduct':
    case 'outsourceProduct':
    case 'product':
      row.product?.product_id ? map.set(row.product.product_id, row) : map.set(undefined, row )
      break
    case 'machine':
      row.machine_id ? map.set(row.machine_id, row) : map.set(undefined, row )
      break
    case 'mold':
      row.mold_id ? map.set(row.mold_id, row) : map.set(undefined, row )
      break
    case 'tool':
      row.tool_id ? map.set(row.tool_id, row) : map.set(undefined, row )
      break
    case 'outsourcingOrder':
      row.ose_id ? map.set(row.ose_id, row) : map.set(undefined, row )
      break
    case 'rawMaterial':
      row.raw_material?.rm_id ? map.set(row.raw_material?.rm_id, row) : map.set(undefined, row )
      break
    case 'subMaterial':
      row.sub_material?.sm_id ? map.set(row.sub_material?.sm_id, row) : map.set(undefined, row)
      break
    case 'order' :
      row.contract?.contract_id ? map.set(row.contract?.contract_id,row) : map.set(undefined, row )
      break
    default: break
  }
}

const getSyncKey = (searchType: string, type: string, key: string | number, row: any) => {
  if(typeof key === 'string') {
    switch (type) {
      case 'orderRegister':
        return row.product?.product_id
      case 'deliveryRegister':
        return searchType === 'product' ? row.product?.product_id : row.contract?.contract_id
      case 'subMaterialImport':
        return row.sub_material?.sm_id
      case 'rawMaterialImport':
        return row.raw_material?.rm_id
      default:
        return key
    }
  } else {
    return key
  }
}

const syncWithSaved = (type:string, mapValue: any) => {
  switch (type) {
    case 'orderRegister':
      return {
      date: mapValue.date,
      deadline: mapValue.deadline,
      amount: mapValue.amount,
      customerArray: mapValue.customerArray,
      customer_id: mapValue.customer_id,
      modelArray: mapValue.modelArray,
      cm_id: mapValue.cm_id
    }
    case 'productMachine':
    case 'productMold':
    case 'productTool':
      return {
      setting: mapValue.setting ?? 0,
    }
    case 'outsourcingImport':
      return {
        import_date: mapValue.import_date,
        warehousing: mapValue.warehousing,
        lot_number: mapValue.lot_number,
        worker: mapValue.worker,
        user: mapValue.user
      }
    case 'subMaterialImport':
      return {
        date: mapValue.date,
        warehousing: mapValue.warehousing,
        lot_number: mapValue.lot_number,
        customerArray: mapValue.customerArray,
        customer_id: mapValue.customer_id,
      }
    case 'rawMaterialImport':
      return {
        date: mapValue.date,
        amount: mapValue.amount,
        lot_number: mapValue.lot_number,
        customerArray: mapValue.customerArray,
        customer_id: mapValue.customer_id,
      }
    case 'deliveryRegister' :
      return {
        date : mapValue.date,
        amount: mapValue.amount,
        lots: mapValue.lots,
        customerArray: mapValue.customerArray,
        customer_id: mapValue.customer_id,
        modelArray: mapValue.modelArray,
        cm_id: mapValue.cm_id
      }
    default: return {}
  }
}

const getModalTextKey = (type: string) => {
  switch (type) {
    case 'outsourceProduct':
    case 'product':
      return 'code'
    case 'outsourcingOrder':
      return 'identification'
    case 'rawMaterial':
      return 'code'
    case 'subMaterial':
      return 'code'
    case 'order':
      return 'contract_id'
    default:
      return 'name'
  }
}

const emptyRow = (type: string) => {
  let emptyRow = {isFirst:true}
  switch(type){
    case 'productMachine':
    case 'productMold':
    case 'productTool':
      emptyRow['seq'] = 1
    default: emptyRow = {...emptyRow, ...defaultRow(type)}
  }
  return emptyRow
}


const defaultRow = (type:string) => {
  switch(type){
    case 'orderRegister':
      return {
        date: moment().format('YYYY-MM-DD'),
        deadline: moment().format('YYYY-MM-DD')
      }
    case 'deliveryRegister':
      return {
        date: moment().format('YYYY-MM-DD'),
      }
    case 'productMachine':
    case 'productMold':
    case 'productTool':
      return {
        setting: 0
      }
      break
    case 'outsourcingImport':
      return {
        import_date: moment().format('YYYY-MM-DD'),
      }
    case 'subMaterialImport':
    case 'rawMaterialImport':
      return {
        date: moment().format('YYYY-MM-DD'),
      }
    default: break
  }
  return emptyRow
}

const getMapKey = (type:string) => {
  switch(type){
    case 'outsourceProduct':
    case 'product': return 'product_id'
    case 'machine': return 'machine_id'
    case 'mold': return 'mold_id'
    case 'tool': return 'tool_id'
    case 'outsourcingOrder' : return 'ose_id'
    case 'rawMaterial' : return 'rm_id'
    case 'subMaterial' : return 'sm_id'
    case 'order' : return 'contract_id'
    default: return ''
  }
}

const getIndexKey = (type:string) => {
  switch(type){
    case 'mold': return 'sequence'
    default: return 'seq'
  }
}

const getModule = (searchType: string) => ({
      key: getMapKey(searchType),
      textKey: getModalTextKey(searchType),
      indexKey: getIndexKey(searchType),
      getSyncKey,
      setMapWithSaved,
      syncWithSaved,
      defaultRow,
      emptyRow,

    })

const MultiSelectModal = ({ column, row, onRowChange }: IProps) => {
  const [searchList, setSearchList] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [searchModalInit, setSearchModalInit] = useState<any>()
  const [searchModalColumn, setSearchModalColumn] = useState<Array<IExcelHeaderType>>()
  const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
    page: 1,
    total: 1
  })
  const [ basicRowMap, setBasicRowMap ] = useState<Map<number, any>>(new Map())
  const [ initMap, setInitMap ] = useState<Map<number, any>>(new Map())

  const module = getModule(column.searchType)

  useEffect(() => {
      const initMap = new Map()
      column.basicRow?.map(row => module.setMapWithSaved(column.searchType, initMap, row))
      setInitMap(initMap)
      const basicRowMap = new Map(initMap)
      basicRowMap.delete(undefined)
      setBasicRowMap(new Map(basicRowMap))
  }, [column.basicRow])

  useEffect(() => {
    setSearchModalInit(SearchInit[column.searchType])
    setSearchModalColumn(
      [...searchModalList[`${SearchInit[column.searchType].excelColumnType}Search`].map((col, index) => {
        if (index === 0) return ({
          ...col, colSpan(args) {
            if (args.row?.isFirst) {
              return searchModalList[`${SearchInit[column.searchType].excelColumnType}Search`].length
            } else {
              return undefined
            }
          }
        })
        else return ({ ...col })
      })])
  }, [column.searchType])

  useEffect(() => {
    if (isOpen) {
      if (searchModalInit.excelColumnType === "product") setOptionIndex(2)
      LoadBasic(pageInfo.page);
    }
  }, [isOpen, searchModalInit, pageInfo.page])

  const markSelectedRows = (rows: any[]) => {
    return rows.map(row => {
      if (basicRowMap.has(row[module.key])) {
        const newRows = {
          ...row,
          border: true
        }
        return newRows
      } else {
        return row
      }
    })
  }


  const LoadBasic = async (page: number = 1) => {
    Notiflix.Loading.circle();
    const getParams = () => {
      const defaultParams = keyword ? {
        keyword,
        opt: optionIndex
      } : {}
      switch (column.searchType) {
        case 'outsourceProduct': defaultParams['outsourcing'] = 2
          break
        case 'allProduct': defaultParams['outsourcing'] = 0
          break
        default:
      }
      return defaultParams
    }

    const getPath = (row: any) => {
      const defaultPathVar =  { page, renderItem: 22,}
      switch (column.searchType) {
        default:
      }
      return defaultPathVar
    }
    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`, {
      path: getPath(row),
      params: getParams()
    })

    if (res) {
      setPageInfo({ page: res.page, total: res.totalPages })

      const newSearchList = SearchResultSort(res.info_list, searchModalInit.excelColumnType)
      const borderedRows = markSelectedRows(newSearchList)
      setSearchList(page === 1 ? borderedRows : prev => [...prev, ...borderedRows])
    }

    Notiflix.Loading.remove();
  }

  const getContents = () => {
    return <>
        <div style={{ paddingLeft: 8, opacity: row[column.key] || row[module.key] ? 1 : .3, width: row.isFirst ? column.modalType ?  'calc(100% - 30px)' : 'calc(100% - 38px)' : '100%', textAlign:'left', backgroundColor: column.modalType && row.border ? '#19B9DF80' : undefined}}>
          {
            row[module.key] ? row[column.searchType] ? row[column.searchType][module.textKey] ?? '-' : row[module.textKey] ?? '-'
              : searchModalInit?.placeholder ?? column?.placeholder
          }
      </div>
      {
        row.isFirst && addSearchButton()
      }
    </>
  }

  const addSearchButton = () => (<SearchIcon  className={'unprintable'} modalType={column.modalType}><img style={{width: "30px", height:"30px"}} src={ModalSearch_icon} /></SearchIcon>)

  const ContentHeader = () => {
    return <div id={'content-header'} style={{
      margin: '24px 16px 12px 16px',
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div id={'content-title'} style={{ display: 'flex' }}>
        <p style={{
          color: 'black',
          fontSize: 22,
          fontWeight: 'bold',
          margin: 0,
        }}>{searchModalInit?.title}</p>
      </div>
      <div  className={'unprintable'} id={'content-close-button'} style={{ display: 'flex' , cursor: 'pointer', marginLeft: 4}} onClick={() => {
        onClose()
      }}>
        <img style={{ width: 20, height: 20 }} src={IcX} />
      </div>
    </div>
  }

  const SearchBox = () => {
    const getDefaultSearchOptionIndex = (index: number) => {
      if (column.searchType === 'product' && index === 0) {
        return 2
      } else if (column.searchType === 'product' && index === 2) {
        return 0
      } else {
        return index
      }
    }
    const switchSearchOption = (option: number) => {
      return column.key === 'customer_id' && option === 3 ? 7 : option
    }

    return <div style={{
      height: 32, margin: '16px 0 16px 16px',
      display: 'flex',
    }}>
      <div style={{
        width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
        borderRight: 'none',
      }}>
        <select key={searchModalInit?.searchFilter[0]}
          defaultValue={searchModalInit?.searchFilter[getDefaultSearchOptionIndex(0)]}
          onChange={(e) => {
            const option = switchSearchOption(Number(e.target.value))
            setOptionIndex(option)
          }}
          style={{
            color: 'black',
            backgroundColor: '#00000000',
            border: 0,
            height: 32,
            width: 120,
            fontSize: 15,
            fontWeight: 'bold'
          }}>
          {
            searchModalInit?.searchFilter.map((filter, i) => (filter !== "" && <option key={i.toString()} value={getDefaultSearchOptionIndex(i)}>{filter}</option>))
          }
        </select>
      </div>
      <input
        value={keyword ?? ""}
        type={"text"}
        placeholder="검색어를 입력해주세요."
        onChange={(e) => {
          setKeyword(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            LoadBasic(1);
          }
        }}
        style={{
          width: 1592,
          height: "32px",
          paddingLeft: "10px",
          border: "0.5px solid #B3B3B3",
          backgroundColor: 'rgba(0,0,0,0)'
        }}
      />
      <div
        className={'unprintable'}
        style={{ background: "#19B9DF", width: "32px", height: "32px", display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer' }}
        onClick={() => {
          LoadBasic(1);
        }}>
        <img src={Search_icon} style={{ width: "16px", height: "16px" }} />
      </div>
    </div>
  }

  const onConfirm = () => {
    let newBasicRow = basicRowMap.size > 0 ? Array.from(basicRowMap.values()) : []
    newBasicRow = newBasicRow.length === 0
      ? [module.emptyRow(column.type)]
      : newBasicRow.map((row, rowIdx) => {
        let defaultRes = {...row, id:row[module.key], isFirst: rowIdx === 0, [module.indexKey]: rowIdx + 1, border:false }
        const syncKey = module.getSyncKey(column.searchType, column.type, row[module.key], row)
        if(initMap.has(syncKey)){
          defaultRes = {...defaultRes, ...syncWithSaved(column.type, initMap.get(syncKey))}
        } else if(initMap.has(undefined)) {
          defaultRes = {...defaultRes, ...defaultRow(column.type), ...syncWithSaved(column.type, initMap.get(undefined))}
        } else {
          defaultRes = {...defaultRes, ...defaultRow(column.type)}
        }
        return {...defaultRes, isChange:false}
      })
    column.setBasicRow(newBasicRow)
  }

  const setAllSelected = (rows: any) => {
    setSearchList(rows.map(row => {
      if(!basicRowMap.has(row[module.key])){
        setBasicRowMap(prev => new Map(prev).set(row[module.key], SearchModalResult(row, searchModalInit.excelColumnType, column.staticCalendar)))
      }
      return {...row, border:true}
    }))
  }

  const setAllDeselected = (rows: any) => {
    setSearchList(rows.map(row => ({...row, border:false})))
    setBasicRowMap(new Map())
  }
  const onClose = () => {
    setPageInfo({ page: 1, total: 1 })
    setIsOpen(false)
    setKeyword('')
    setBasicRowMap(new Map(initMap))
  }


  return (
    <>
      <SearchModalWrapper >
        <div style={{display:'flex', justifyContent:'space-between', width:'100%', height: '100%'}} onClick={() => row.isFirst && setIsOpen(true)}>
          {getContents()}
        </div>
        <Modal isOpen={isOpen} style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            padding: 0,

          },
          overlay: {
            background: 'rgba(0,0,0,.6)',
            zIndex: 5,
          }
        }}>
          <div style={{
            width: 1776,
            height: 816,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div id={'content-root'}>
              {
                ContentHeader()
              }
              {
                SearchBox()
              }
              <div style={{ marginBottom: "10px" }}>
                <button style={{marginLeft: 20}} onClick={() => setAllSelected(searchList)}
                >모두 선택</button>
                <button style={{marginLeft: 10, marginRight: 15}} onClick={() => setAllDeselected(searchList)}>모두 취소</button>
                출력 개수: {searchList.length}
              </div>

              <ExcelTable
                headerList={ searchModalColumn && [...searchModalColumn]}
                row={searchList ?? []}
                width={1744}
                rowHeight={32}
                height={600}
                onRowClick={(clicked) => {
                  const clickedIdx = searchList.indexOf(clicked)
                  const tmpSearchList = searchList.slice()
                  const borderInverted = !tmpSearchList[clickedIdx].border
                  tmpSearchList[clickedIdx].border = borderInverted

                  setBasicRowMap(prev => {
                    if(borderInverted) {
                      prev.set(clicked[module.key],  SearchModalResult(tmpSearchList[clickedIdx], searchModalInit.excelColumnType, column.staticCalendar))
                    } else {
                      prev.delete(clicked[module.key])
                    }
                    return prev
                  })
                  setSearchList([...tmpSearchList])
                }}
                type={'searchModal'}
                scrollEnd={(isBottom) => {
                  if (isBottom) {
                    if (pageInfo.total > pageInfo.page) {
                      setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
                    }
                  }
                }}
              />
            </div>
            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', }}>
              <FooterButton
                onClick={onClose}
                style={{ backgroundColor: '#E7E9EB' }}
              >
                <p style={{ color: '#717C90' }}>취소</p>
              </FooterButton>
              <FooterButton
                onClick={() => {
                  onConfirm()
                  onClose()}}
                style={{ backgroundColor: POINT_COLOR }}
              >
                <p style={{ color: '#0D0D0D' }}>등록하기</p>
              </FooterButton>
            </div>
          </div>
        </Modal>
      </SearchModalWrapper>
    </>
  )

}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
  height:40px;
  align-items:center;
`

const FooterButton = styled.div`
  width: 50%; 
  height: 40px;
  display: flex; 
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`
export { MultiSelectModal }

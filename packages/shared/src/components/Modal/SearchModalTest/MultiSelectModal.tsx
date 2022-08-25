import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from '../../../common/@types/type'
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

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

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
  const [basicRowMap, setBasicRowMap] = useState<Map<number, any>>(new Map())
  const [allDeselected, setAllDeselected] = useState<boolean>(false)
  // const [currentSelectedRows, setCurrentSelectedRows] = useState([]);

  useEffect(() => {
    const newMap = new Map()
    column.basicRow?.map(row => row?.product?.product_id && newMap.set(row.product.product_id, row))
    setBasicRowMap(newMap)
  }, [column.basicRow])

  useEffect(() => {
    setSearchModalInit(SearchInit[column.type])
    setSearchModalColumn(
      [...searchModalList[`${SearchInit[column.type].excelColumnType}Search`].map((col, index) => {
        if (index === 0) return ({
          ...col, colSpan(args) {
            if (args.row?.isFirst) {
              return searchModalList[`${SearchInit[column.type].excelColumnType}Search`].length
            } else {
              return undefined
            }
          }
        })
        else return ({ ...col })
      })])
  }, [column.type])

  useEffect(() => {
    if (isOpen) {
      if (searchModalInit.excelColumnType === "product") setOptionIndex(2)
      LoadBasic(pageInfo.page);
    }
  }, [isOpen, searchModalInit, pageInfo.page])

  const markSelectedRows = (rows: any[]) => (
    rows.map(row => {
      if (basicRowMap.has(row.product_id) && !allDeselected) {
        const newRows = {
          ...row,
          id: basicRowMap.get(row.product_id).id ?? row.id,
          date: basicRowMap.get(row.product_id).date,
          deadline: basicRowMap.get(row.product_id).deadline,
          amount: basicRowMap.get(row.product_id).amount,
          border: true
        }
        return newRows
      } else {
        return row
      }
    })
  )


  const LoadBasic = async (page: number = 1) => {
    // alert("hi")
    Notiflix.Loading.circle();
    const getParams = () => {
      switch (column.type) {
        default:
          return keyword ? {
            keyword,
            opt: optionIndex
          } : {}
      }
    }

    const getPath = (row: any) => {
      switch (column.type) {
        default:
          return {
            page,
            renderItem: 22,
          }
      }
    }

    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`, {
      path: getPath(row),
      params: getParams()
    })

    if (res) {
      const idAddedRows = res.info_list.map(info => ({
        ...info,
        id: Math.random() * 1000,
        date: moment().format('YYYY-MM-DD'),
        deadline: moment().format('YYYY-MM-DD')
      }))

      setPageInfo({ page: res.page, total: res.totalPages })
      const newSearchList = SearchResultSort(idAddedRows, searchModalInit.excelColumnType)
      const borderedRows = markSelectedRows(newSearchList)

      const new_border_rows = borderedRows.map((row) => {
        if (column.currentSelectedRows.includes(row.code)) {
          return {
            ...row,
            border: true
          }
        } else {
          return {
            ...row
          }
        }
      })

      setSearchList(page === 1 ? new_border_rows : prev => [...prev, ...new_border_rows])
    }

    Notiflix.Loading.remove();
  }

  const getContents = () => {
    return <>
      <div style={{ paddingLeft: 8, opacity: row[column.key] ? 1 : .3, width: row.isFirst ? 'calc(100% - 38px)' : '100%' }}>
        {
          row[column.key] ? typeof row[column.key] === "string" ? row[column.key] : row[column.key].name
            : searchModalInit?.placeholder ?? column?.placeholder
        }
      </div>
      {
        row.isFirst && addSearchButton()
      }
    </>
  }

  const addSearchButton = () => (<SearchIcon><img style={{ width: "20px", height: "20px" }} src={IcSearchButton} /></SearchIcon>)

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
      <div id={'content-close-button'} style={{ display: 'flex', cursor: 'pointer', marginLeft: 4 }} onClick={() => {
        onClose()
      }}>
        <img style={{ width: 20, height: 20 }} src={IcX} />
      </div>
    </div>
  }

  const SearchBox = () => {
    const getDefaultSearchOptionIndex = (index: number) => {
      if (column.type === 'product' && index === 0) {
        return 2
      } else if (column.type === 'product' && index === 2) {
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
        style={{ background: "#19B9DF", width: "32px", height: "32px", display: "flex", justifyContent: "center", alignItems: "center", cursor: 'pointer' }}
        onClick={() => {
          LoadBasic(1);
        }}>
        <img src={Search_icon} style={{ width: "16px", height: "16px" }} />
      </div>
    </div>
  }

  const onConfirm = () => {
    const tmpBasicRowMap = new Map(basicRowMap)
    let newBasicRow = searchList.map(row => {
      if (tmpBasicRowMap.has(row.product_id)) {
        tmpBasicRowMap.delete(row.product_id)
      }
      return row
    }).filter(row => row.border).map(row => (
      {
        ...SearchModalResult(row, searchModalInit.excelColumnType, column.staticCalendar),
      }))
    tmpBasicRowMap.size > 0 && !allDeselected && newBasicRow.push(...Array.from(tmpBasicRowMap.values()))
    newBasicRow = newBasicRow.length === 0
      ? [{
        date: moment().format('YYYY-MM-DD'),
        deadline: moment().format('YYYY-MM-DD'),
        isFirst: true
      }]
      : newBasicRow.map((row, rowIdx) => ({ ...row, isFirst: rowIdx === 0 }))

    column.setBasicRow(newBasicRow)
    setBasicRowMap(new Map())
  }

  const setAllBorder = (rows: any[], border: boolean) => {
    return rows.map(row => ({ ...row, border }))
  }

  const onClose = () => {
    setPageInfo({ page: 1, total: 1 })
    setIsOpen(false)
    setKeyword('')
    setAllDeselected(false)
  }

  const modalOpen = () => {

    // 1122

    const new_temp_list = searchList.map((row) => {
      if (column.currentSelectedRows.includes(row.code)) {
        return {
          ...row,
          border: true
        }
      } else {
        return {
          ...row,
          // border:false
        }
      }
    })
    setIsOpen(true)
    setSearchList([...new_temp_list]);
  }

  return (
    <>
      <SearchModalWrapper >
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }} onClick={() => row.isFirst && modalOpen()}>
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
                <button style={{ marginLeft: 20 }} onClick={() => setSearchList(setAllBorder(searchList, true))}>모두 선택</button>
                <button style={{ marginLeft: 10, marginRight: 15 }} onClick={() => {
                  setSearchList(setAllBorder(searchList, false))
                  setAllDeselected(true)
                  column.setCurrentSelectedRows([]);
                }}>모두 취소</button>
                출력 개수: {searchList.length} 선택 개수: {column.currentSelectedRows.length}
              </div>

              <ExcelTable
                headerList={searchModalColumn && [...searchModalColumn]}
                row={searchList ?? []}
                width={1744}
                rowHeight={32}
                height={600}
                onRowClick={(clicked) => {

                  // 1122
                  // currentSelectedRows
                  // setCurrentSelectedRows.push  


                  const clickedIdx = searchList.indexOf(clicked)
                  const tmpSearchList = searchList.slice()
                  tmpSearchList[clickedIdx].border = !tmpSearchList[clickedIdx].border
                  console.log("tempSearchList : ", tmpSearchList);

                  const selected_code = tmpSearchList[clickedIdx].code;
                  column.setCurrentSelectedRows((prev) => [...prev, selected_code]);

                  const new_temp_list = tmpSearchList.map((row) => {
                    if (column.currentSelectedRows.includes(row.code)) {
                      return {
                        ...row,
                        border: true
                      }
                    } else {
                      return {
                        ...row,
                        // border:false
                      }
                    }
                  })


                  setSearchList([...new_temp_list])

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
                  onClose()
                }}
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

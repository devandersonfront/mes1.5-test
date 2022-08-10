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
import { MoldRegisterModal } from '../MoldRegisterModal'
import Notiflix from 'notiflix'
import { SearchModalResult, SearchResultSort } from '../../../Functions/SearchResultSort'
import { Select } from '@material-ui/core'
import { TransferCodeToValue } from '../../../common/TransferFunction'
import { SearchIcon } from "../../../styles/styledComponents";
import { changeSearchModalNumber } from "../../../reducer/searchModalState";
import { NoSelectContainer } from "../../Formatter/NoSelectFomatter";
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import { RootState } from "../../../reducer";
import { useDispatch, useSelector } from "react-redux";
import { add_product_ids_for_selected_rows, remove_product_ids_for_selected_rows, add_product_ids_for_removed_rows, remove_product_ids_for_removed_rows, cancel_product_ids_for_modal, cancel_for_product_ids_for_modal, update_is_change, add_all_selected_product_ids_for_search_list } from "../../../reducer/product_ids_for_selected_rows_state";
import moment from 'moment'

// import { useDispatch, useSelector } from 'react-redux'


interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const search_result_array_for_register = []
// let new_array_for_update = []



const OrderInfoReigesterModalButton = ({ column, row, onRowChange }: IProps) => {
  // console.log("column.basicRow : ", column.basicRow);
  const dispatch = useDispatch()
  const [totalSearchList, setTotalSearchList] = useState<any[]>([])
  const [searchList, setSearchList] = useState<any[]>([])

  const [selectRow, setSelectRow] = useState<number>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')

  // console.log("basicSearchRows: ", basicSearchRows);
  // console.log(totalSearchList, 'totalSearchList123');

  const [tab, setTab] = useState<number>(0)
  const [searchModalInit, setSearchModalInit] = useState<any>()
  const [searchModalColumn, setSearchModalColumn] = useState<Array<IExcelHeaderType>>()
  const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
    page: 1,
    total: 1
  })

  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [selectedRows, setSelectedRows] = useState([]);

  const [new_array_for_update, set_new_array_for_update] = useState([])

  // const [basicRow, setBasicRow] = useState<Array<any>>([
  //   // {
  //   //   name: "",
  //   //   id: "",
  //   // },
  // ]);

  // console.log("basicRow : ", basicRow);

  const selector = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state)
  const product_ids_for_selected_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_selected_rows)
  const product_ids_for_removed_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_removed_rows)
  // product_ids_for_current_basic_row
  const product_ids_for_current_basic_row = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_current_basic_row)
  const is_change_for_modal = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.is_change_for_modal)


  useEffect(() => {

    if (column.type === "bom") {
      // setSearchList([{}])
      switch (tab) {
        case 0: {
          setSearchModalInit(SearchInit.rawmaterial)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
            [...searchModalList[`${SearchInit.rawmaterial.excelColumnType}Search`].map((column, index) => {
              if (index === 0) return ({
                ...column, colSpan(args) {
                  if (args.row?.first) {
                    return searchModalList[`${SearchInit.rawmaterial.excelColumnType}Search`].length
                  } else {
                    return undefined
                  }
                }
              })
              else return ({ ...column })
            })])
          break;
        }
        case 1: {
          setSearchModalInit(SearchInit.submaterial)
          // setSearchModalColumn(searchModalList[`${searchModalInit.excelColumnType}Search`])
          setSearchModalColumn(
            [...searchModalList[`${SearchInit.submaterial.excelColumnType}Search`].map((column, index) => {
              if (index === 0) return ({
                ...column, colSpan(args) {
                  if (args.row?.first) {
                    return searchModalList[`${SearchInit.submaterial.excelColumnType}Search`].length
                  } else {
                    return undefined
                  }
                }
              })
              else return ({ ...column })
            })])
          break;
        }
        case 24: {
          setSearchModalInit(SearchInit.product)
          setSearchModalColumn(
            [...searchModalList[`${SearchInit.product.excelColumnType}Search`].map((column, index) => {
              if (index === 0) return ({
                ...column, colSpan(args) {
                  if (args.row?.first) {
                    return searchModalList[`${SearchInit.product.excelColumnType}Search`].length
                  } else {
                    return undefined
                  }
                }
              })
              else return ({ ...column })
            })])
          break;
        }
      }
      if (tab === null) {
        setSearchModalInit(SearchInit[column.type])
        setSearchModalColumn(
          [...searchModalList[`${SearchInit[column.type].excelColumnType}Search`].map((column, index) => {
            if (index === 0) return ({
              ...column, colSpan(args) {
                if (args.row?.first) {
                  return searchModalList[`${SearchInit[column.type].excelColumnType}Search`].length
                } else {
                  return undefined
                }
              }
            })
            else return ({ ...column })
          })])
      }
    } else {
      setSearchModalInit(SearchInit[column.type])
      setSearchModalColumn(
        [...searchModalList[`${SearchInit[column.type].excelColumnType}Search`].map((col, index) => {
          if (index === 0) return ({
            ...col, colSpan(args) {
              if (args.row?.first) {
                return searchModalList[`${SearchInit[column.type].excelColumnType}Search`].length
              } else {
                return undefined
              }
            }
          })
          else return ({ ...col })
        })])
    }

  }, [column.type, tab])

  useEffect(() => {
    if (isOpen) {
      if (searchModalInit.excelColumnType === "product") setOptionIndex(2)
      LoadBasic(pageInfo.page);
    } else {
      setPageInfo({ page: 1, total: 1 })
    }
  }, [isOpen, searchModalInit, pageInfo.page, is_change_for_modal])

  // 1122 최초 페이지 로딩
  const LoadBasic = async (page: number) => {
    Notiflix.Loading.circle();

    // console.log("column,type : ", column.type);

    const selectType = () => {
      switch (column.type) {
        case "searchToolModal":
          return {}
        default:
          return {
            keyword: keyword,
            opt: optionIndex,
          }
      }
    }

    const searchToolInProduct = (row: any) => {
      switch (column.type) {

        default:
          return {
            page: page || page !== 0 ? page : 1,
            renderItem: 20,
          }
      }
    }

    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`, {
      path: searchToolInProduct(row)
      ,
      params: selectType()
    })

    let custom_info_list;

    if (res) {
      custom_info_list = res.info_list.map((row) => {
        const random_id = Math.random() * 1000;

        return {
          ...row,
          id: `orderinfo_${random_id}`
        }
      })

      if (res.page !== 1) {

        if (selector.product_ids_for_selected_rows.length == 0) {
          // setTotalSearchList([...column.basicRow])
        }

        let tmp: Set<any> = selectList
        let selected_product_ids = [];

        const new_rows = custom_info_list.map((row, index) => {

          if (selector.product_ids_for_selected_rows.includes(row.code) || selected_product_ids.includes(row.code)) {
            tmp.add(row.id)
            return {
              ...row,
              border: true
            }
          } else {
            return {
              ...row,
              border: false
            }
          }
        })

        setSearchList(prev => [...prev, ...SearchResultSort(!column.noSelect ? [{ noneSelected: true }, ...new_rows] : new_rows, searchModalInit.excelColumnType)])
        setPageInfo({ page: res.page, total: res.totalPages });
        Notiflix.Loading.remove()
      } else {

        console.log("hi", [...column.basicRow])

        let tmp: Set<any> = selectList
        let selected_product_ids = [];

        // if (selector.product_ids_for_selected_rows.length == 0) {
        setTotalSearchList([...column.basicRow])
        // }

        selected_product_ids = [...column.basicRow].map((row) => {
          if (!selector.product_ids_for_removed_rows.includes(row.code))
            return row.code
        })

        console.log("selected_product_ids ::::::::: ", selected_product_ids);
        console.log("custom_info_list : ", custom_info_list);

        const new_rows = custom_info_list.map((row, index) => {

          if (selector.product_ids_for_selected_rows.includes(row.code) || selected_product_ids.includes(row.code)) {
            tmp.add(row.id)
            return {
              ...row,
              border: true
            }
          } else {
            return {
              ...row,
              border: false
            }
          }
        })

        console.log("res !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! ", res);
        setPageInfo({ page: res.page, total: res.totalPages })
        setSearchList([...SearchResultSort(!column.noSelect ? [{ id: null, noneSelected: false }, ...new_rows] : new_rows, searchModalInit.excelColumnType)])
        Notiflix.Loading.remove()

      }
    } else {
      console.log("hi");
    }


  }

  const getContents = () => {
    if (row[`${column.key}`]) {
      if (typeof row[`${column.key}`] === "string") {
        return row[column.key];
      } else {
        return row[column.key].name;
      }
    } else {
      if (searchModalInit && searchModalInit.placeholder) {
        return searchModalInit.placeholder
      } else {
        return column.placeholder
      }
    }
  }

  // setIsOpen 이 아니라 직접 호출로 바꿔 보자 , 생각해보아야할것 알고리즘 vs 렌더링 시점
  const addSearchButton = () => {

    if (row.isFirst) {
      return <SearchIcon onClick={() => {
        // alert("hi 11")
        // 2244
        console.log("column.basicRow : ", column.basicRow);

        column.basicRow.map((row) => {
          console.log("row.code !! ", row.code);

          dispatch(
            add_product_ids_for_selected_rows(row.code)
          )
        })
        setIsOpen(true)

      }} modalType={column.modalType}>
        <img style={{width: "20px", height:"20px"}} src={IcSearchButton} />

      </SearchIcon>

    } else {
      return <div></div>
    }

  }

  const ContentHeader = () => {
    return <div id={'content-header'} style={{
      marginTop: 24,
      marginLeft: 16,
      marginRight: 16,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'space-between'
    }}>
      <div id={'content-title'} style={{ display: 'flex' }}>
        <p style={{
          color: 'black',
          fontSize: `22`,
          fontWeight: 'bold',
          margin: 0,
        }}>{searchModalInit && searchModalInit.title}</p>
        {
          column.type === 'bom' && <div style={{ marginLeft: 20 }}>
            <Select value={tab ?? 0} onChange={(e) => {
              setTab(Number(e.target.value))
              setOptionIndex(0)
              setKeyword('')
            }}>
              <option key={'0'} value={0}>원자재</option>
              <option key={'1'} value={1}>부자재</option>
              <option key={'2'} value={2}>제품</option>
            </Select>
          </div>
        }
      </div>
      <div id={'content-close-button'} style={{ display: 'flex' }}>
        {
          column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {
            LoadBasic(1)
          }} />
        }

        <div style={{ cursor: 'pointer', marginLeft: 4 }} onClick={() => {
          setIsOpen(false)
        }}>
          <img style={{ width: 20, height: 20 }} src={IcX} />
        </div>

      </div>
    </div>
  }

  const switchSearchOption = (option: number) => {
    if (column.key === 'customer_id') {
      switch (option) {
        case 3:
          return 7
        default:
          return option
      }
    }
    return option
  }

  const getDefaultSearchOptionIndex = (index: number) => {
    if (column.type === 'product' && index === 0) {
      return 2
    } else if (column.type === 'product' && index === 2) {
      return 0
    } else {
      return index
    }
  }

  const SearchBox = () => {

    return <div style={{
      width: '100%', height: 32, margin: '16px 0 16px 16px',
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
            // setPageInfo({ total: 1, page: 1 });
            // SearchBasic('', Number(e.target.value))
          }}
          style={{
            color: 'black',
            backgroundColor: '#00000000',
            border: 0,
            height: 32,
            width: 120,
            fontSize: 15,
            fontWeight: 'bold'
          }}
        >

          {
            searchModalInit && searchModalInit.searchFilter.map((v, i) => {
              if (v !== "") {
                return (<option key={i.toString()} value={getDefaultSearchOptionIndex(i)}>{v}</option>)
              }
            })
          }
        </select>
      </div>


      <input
        value={keyword ?? ""}
        type={"text"}
        placeholder="검색어를 입력해주세요."
        onChange={(e) => {
          setKeyword(e.target.value)
          // setPageInfo({total:1, page:1});
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
        }}
      >
        <img src={Search_icon} style={{ width: "16px", height: "16px" }} />
      </div>
    </div>
  }



  // step2
  const confirmFunction = () => {
    // alert("hi !!!!!!!!!!!!!!!!!!!!!")

    setIsOpen(false)
    const selectNameFunction = (type: string) => {
      return row.name;
    }

    console.log("totalSearchList : ", totalSearchList);

    const selected_rows_array = totalSearchList;

    let array_for_update = selected_rows_array.map((rowdata) => {
      console.log("rowdata : ", rowdata);

      const random_id = Math.random() * 1000;
      const expires = new Date()

      return (
        {
          ...row,
          id: "orderinfo_" + random_id,
          ...SearchModalResult(rowdata, searchModalInit.excelColumnType, column.staticCalendar),
          manager: SearchModalResult(rowdata, searchModalInit.excelColumnType).manager,
          name: selectNameFunction(column.type),
          tab: tab,
          // type_name: undefined,
          version: rowdata.version,
          isChange: false,
          //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
          returnType: column.key,
          product_id: rowdata.code,
          // product_code : rowdata.code,
          date: moment(new Date()).startOf("day").format('YYYY-MM-DD'),
          deadline: moment(new Date()).startOf("day").format('YYYY-MM-DD'),
          goal: rowdata?.goal,
          process: {
            process_id: rowdata.process_id,
            // name: rowdata.process.name,
            additional: rowdata.additional,

          },
          molds: rowdata.molds,
          machines: rowdata.machines,
          standard_uph: rowdata.standard_uph,
          work_standard_image: rowdata.work_standard_image,
          amount: rowdata.amount,
        }

      )
    })

    array_for_update = array_for_update.filter((row) => {
      if (!product_ids_for_removed_rows.includes(row.code) && row.id) {
        return row
      }
    })

    console.log("array_for_update :::::::::::::::::::: ", array_for_update);
    console.log("array_for_update :::::::::::::::::::: ", array_for_update.length);



    // if (array_for_update.length === 0) {
    //   // return
    //   // column.setBasicRow({
    //   //   date: moment().format('YYYY-MM-DD'),
    //   //   deadline: moment().format('YYYY-MM-DD'),
    //   //   isFirst: true
    //   // })
    //   onRowChange([])
    // } else {
    // }
    onRowChange(array_for_update)


  }

  // 2244
  const allSelect = () => {

    let tmp: Set<any> = selectList

    const new_search_list = searchList.map((row, index) => {
      tmp.add(row.id)
      dispatch((
        remove_product_ids_for_removed_rows(row.code)
      ))

      dispatch(
        add_product_ids_for_selected_rows(row.code)
      )
      setSelectRow(index)

      return {
        ...row,
        border: true
      }

    })

    setSearchList(new_search_list)
    setTotalSearchList(new_search_list)
    // setTotalSearchList(new_search_list)
    // setTotalSearchList((prev) => [...prev, row])

  }

  const allSelectCancel = () => {


    let tmp: Set<any> = selectList

    console.log("totalSearchList 1111 : ", totalSearchList);


    totalSearchList.map((row) => {
      console.log("row.code : ", row.code);
      dispatch((
        add_product_ids_for_removed_rows(row.code)
      ))

    })

    dispatch(
      cancel_product_ids_for_modal()
    )

    console.log("product_ids_for_removed_rows :", selector.product_ids_for_removed_rows);


    const new_search_list = searchList.map((row, index) => {
      tmp.delete(row.id)

      dispatch((
        add_product_ids_for_removed_rows(row.code)
      ))
      setSelectRow(index)

      return {
        ...row,
        border: false
      }

    })

    // dispatch(
    // cancel_for_product_ids_for_modal()
    // )

    setSearchList(new_search_list)
    setTotalSearchList([])

  }

  // const modifyTotalSearchList = () => {
  //   const new_totalSearchList = totalSearchList.filter((row) => {
  //     if (selector.product_ids_for_current_basic_row.includes(row.code)) {
  //       return row
  //     }
  //   })
  // setTotalSearchList([])
  // }

  return (
    <SearchModalWrapper>
      <div style={column.modalType
        ? { width: 'calc(100% - 32px)', height: 32, paddingLeft: 8, opacity: row[`${column.key}`] ? 1 : .3 }
        : { width: 'calc(100% - 40px)', height: 40, paddingLeft: 8, opacity: row[`${column.key}`] ? 1 : .3 }
      } onClick={() => {
        if (row.first || !column.disableType) {
          setIsOpen(true)
        }
      }}>



        {getContents()}

      </div>
      {(row.first || !column.disableType) &&
        addSearchButton()
      }



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
            {column.type !== "searchToolModal" &&
              SearchBox()
            }

            <div style={{ marginBottom: "10px" }}>
              &nbsp;&nbsp;&nbsp; <button onClick={allSelect}>모두 선택</button>
              &nbsp; <button onClick={allSelectCancel}>모두 취소</button>
              &nbsp;&nbsp;
              출력 개수: {searchList.length}
            </div>

            <ExcelTable
              headerList={searchModalInit && [...searchModalColumn]}
              selectList={selectList}
              //@ts-ignore
              setSelectList={setSelectList}
              row={searchList ?? []}
              // row={basicRow ?? []}
              setRow={(e) => {
                console.log("eeeeeeee : ", e);

                let tmp: Set<any> = selectList
                e.map(v => {
                  if (v.isChange) {
                    tmp.add(v.id)
                    v.isChange = false
                  }
                })
                // setSelectList(tmp)
              }}
              width={1744}
              rowHeight={34}
              height={620}

              setSelectRow={(e) => {
                // 모달창 테이블의 로우 클릭시 전체를 다시 그림
                // step1
                // 클릭시에 선택한 행 정보에 이미 추가된 경우 제거(색깔 제거), 아니면 추가 (색깔 추가) <=> ui 적으로는 색깔 적용, 취소 
                let tmp: Set<any> = selectList;

                const new_row_for_search_table_update = searchList.map((row, index) => {

                  // 클릭한 행일 경우 
                  if (e === index) {
                    tmp.add(row.id)
                    // console.log("row.border : ", row.border);

                    // 이미 선택한 행일 경우
                    if (selector.product_ids_for_selected_rows.includes(row.code) && row.border === true) {
                      console.log("색깔 지우기");

                      // console.log("선택한 행의 개수 -1 : ", selector.product_ids_for_selected_rows.length);
                      tmp.delete(row.id)

                      dispatch((
                        remove_product_ids_for_selected_rows(row.code)
                      ))

                      dispatch((
                        add_product_ids_for_removed_rows(row.code)
                      ))

                      const new_total_search_list = totalSearchList.filter((el) => {
                        if (row.code !== el.code) {
                          return el
                        }
                      })

                      console.log("new_total_search_list : ", new_total_search_list.length);

                      setTotalSearchList(new_total_search_list);

                      return {
                        ...row,
                        border: false
                      }

                      // 아직 선택하지 않은 행의 경우 
                    } else {
                      tmp.add(row.id)

                      dispatch((
                        remove_product_ids_for_removed_rows(row.code)
                      ))

                      dispatch(
                        add_product_ids_for_selected_rows(row.code)
                      )

                      setTotalSearchList((prev) => [...prev, row])

                      return {
                        ...row,
                        border: true
                      }

                    }
                  } else {  // 클릭한 행 이외의 행에 대해
                    // 선택했던 행일 경우 색깔 축 
                    if (selector.product_ids_for_selected_rows.includes(row.code)) {
                      return {
                        ...row,
                        border: selector.product_ids_for_selected_rows.includes(row.code)
                      }
                    } else {  // 선택했던 행이 아닐 경우 색깔 없음
                      return {
                        ...row,
                      }
                    }
                  }


                })

                console.log("new_array_for_update : ", new_array_for_update);
                setSearchList(new_row_for_search_table_update)
                setSelectRow(e)

              }}
              type={'searchModal'}
              scrollEnd={(value) => {

                console.log("scrol event check !!");
                console.log("pageInfo.total , pageInfo.page : ", pageInfo.total, pageInfo.page);


                if (value) {
                  if (pageInfo.total > pageInfo.page) {
                    setPageInfo({ ...pageInfo, page: pageInfo.page + 1 })
                  }
                }
              }}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', }}>
            <FooterButton
              onClick={() => {
                setIsOpen(false)
                // setSelectRow(undefined)
                // modifyTotalSearchList();
                console.log("서치 리스트 초기화");
                
                setTotalSearchList([])
                dispatch(cancel_for_product_ids_for_modal())
                // dispatch(
                //   update_is_change()
                // )
                setOptionIndex(0)
                // setPageInfo(prev => {
                //   return {
                //     page: 1,
                //     total: prev.total
                //   }
                // })
                // allSelectCancel()
                setKeyword('')
              }}
              style={{ backgroundColor: '#E7E9EB' }}
            >
              <p style={{ color: '#717C90' }}>취소</p>
            </FooterButton>
            <FooterButton
              onClick={confirmFunction}
              style={{ backgroundColor: POINT_COLOR }}
            >
              <p style={{ color: '#0D0D0D' }}>등록하기</p>
            </FooterButton>
          </div>
        </div>
      </Modal>
    </SearchModalWrapper>
  )

}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
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

const LoadingBar = styled.div`
  width:100%;
  height:50px;
  display:flex;
  justify-content:center;
  align-items:center;
  
`;

export { OrderInfoReigesterModalButton }

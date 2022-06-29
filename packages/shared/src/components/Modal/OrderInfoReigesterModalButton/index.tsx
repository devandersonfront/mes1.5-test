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
import { add_product_ids_for_selected_rows, remove_product_ids_for_selected_rows, remove_all_product_ids_for_selected_rows } from "../../../reducer/product_ids_for_selected_rows_state";

// import { useDispatch, useSelector } from 'react-redux'


interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const OrderInfoReigesterModalButton = ({ column, row, onRowChange }: IProps) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [tab, setTab] = useState<number>(0)
  const [searchModalInit, setSearchModalInit] = useState<any>()
  const [searchModalColumn, setSearchModalColumn] = useState<Array<IExcelHeaderType>>()
  const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
    page: 1,
    total: 1
  })

  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [selectedRows, setSelectedRows] = useState([]);

  const [basicRow, setBasicRow] = useState<Array<any>>([
    // {
    //   name: "",
    //   id: "",
    // },
  ]);

  const selector = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state)
  const product_ids_for_selected_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_selected_rows)

  // console.log("selector.product_ids_for_selected_rows : ", selector.product_ids_for_selected_rows);
  // console.log("product_ids_for_selected_rows : ", product_ids_for_selected_rows);



  useEffect(() => {

    if (column.type === "bom") {
      setSearchList([{}])
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
        // console.log("searchModalInit : ", searchModalInit)
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
      // setSearchList([{}])
    }
  }, [isOpen, searchModalInit, pageInfo.page])

  const LoadBasic = async (page: number) => {
    Notiflix.Loading.circle();
    const selectType = () => {
      switch (column.type) {
        case "customerModel":
          return {
            keyword: keyword,
            opt: optionIndex,
            customer_id: row.product?.customerId ?? null
          }
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
        case "searchToolModal":
          return {
            product_id: row.product_id
          }
        case "customerModel":
          return {
            page: page || page !== 0 ? page : 1,
            renderItem: 4,
            customer_id: row.customer?.customer_id ?? null
          }
        default:
          return {
            page: page || page !== 0 ? page : 1,
            renderItem: 4,
          }
      }
    }
    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`, {
      path: searchToolInProduct(row)
      ,
      params: selectType()
    })

    // console.log("res for modal row: ", res);

    // hyunsok
    let custom_info_list;

    if (res) {
      custom_info_list = res.info_list.map((row) => {
        const random_id = Math.random() * 1000;

        return {
          ...row,
          id: `orderinfo_${random_id}`
        }
      })
    }

    // 2244
    // console.log("custom_info_list : ", custom_info_list);
    // 고쳐야할 부분 1111
    if (res) {
      // alert("hi")

      if (searchModalInit.excelColumnType === "toolProduct") {
        setSearchList([...SearchResultSort(!column.noSelect ? [null, ...res] : res, searchModalInit.excelColumnType)])
        setPageInfo({ page: res.page, total: res.totalPages });
        Notiflix.Loading.remove()
      } else
        if (res.page !== 1) {

          console.log("hihi");
          
          setSearchList([...searchList, ...SearchResultSort(!column.noSelect ? [{ noneSelected: true }, ...custom_info_list] : custom_info_list, searchModalInit.excelColumnType)])
          setPageInfo({ page: res.page, total: res.totalPages });
          Notiflix.Loading.remove()
        } else {
          // console.log(custom_info_list)

          // console.log("custom_info_list : ", custom_info_list);


          console.log("selector.product_ids_for_selected_rows : ", selector.product_ids_for_selected_rows);
          console.log("custom_info_list : ", custom_info_list);

          let tmp: Set<any> = selectList

              tmp.add(row.product_id)
              // tmp.add(index)

          const new_rows = custom_info_list.map((row, index) => {
            if (selector.product_ids_for_selected_rows.includes(row.product_id)) {
              // alert("실행이 되나? :  " + row.product_id)
              tmp.add(row.product_id)
              tmp.add(index)
              
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
          
          console.log("new_rows ::::", new_rows);
          setSearchList([...SearchResultSort(!column.noSelect ? [{ id: null, noneSelected: false }, ...new_rows] : new_rows, searchModalInit.excelColumnType)])

          Notiflix.Loading.remove()

        }
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


  const addSearchButton = () => {
    return <SearchIcon onClick={() => {
      setIsOpen(true)
    }} modalType={column.modalType}>
      <img style={column.modalType ? { width: 16.3, height: 16.3 } : { width: 440, height: 20 }} src={IcSearchButton} />
    </SearchIcon>
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
          fontSize: 22,
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
            setPageInfo({ total: 1, page: 1 });
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


  const confirmFunction2 = () => {
    alert("체크 박스 아무거나 체크 되도록 해보자")

  }

  const confirmFunction = () => {

    // alert("hyun")

    setIsOpen(false)
    if (selectRow !== undefined) {
      const selectNameFunction = (type: string) => {
        switch (type) {
          case "bom":
            return SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).name;
          case "rawmaterial":
            return SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).name;
          case "machine":
            return searchList[selectRow].name;
          case "mold":
            return searchList[selectRow].name;
          default:
            return row.name;
        }
      }
      if (column.clearContract) {
        onRowChange(
          {
            ...row,
            ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar),
            manager: SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
            name: selectNameFunction(column.type),
            tab: tab,
            // type_name: undefined,
            version: row.version,
            isChange: true,
            contract: null,
            contract_id: null
          }
        )
      } else if (column.type === "searchToolModal") {
        onRowChange({ ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar) })
      } else if (column.type === 'customer') {
        onRowChange(
          {
            ...row,
            ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar),
            manager: SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
            name: selectNameFunction(column.type),
            tab: tab,
            // type_name: undefined,
            version: row.version,
            isChange: true,
            cm_id: '',
            modelArray: {
              additional: [],
              cm_id: '',
              customer: null,
              customerId: '',
              model: '',
              sync: '',
              version: null
            }
          }
        )
      } else if (column.type === 'factory') {
        onRowChange({
          ...row,
          ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar),
          name: selectNameFunction(column.type),
          tab: tab,
          // type_name: undefined,
          version: row.version,
          isChange: true,
          cm_id: '',
          modelArray: {
            additional: [],
            cm_id: '',
            customer: null,
            customerId: '',
            model: '',
            sync: '',
            version: null
          }
        })
      } else if (column.type === 'tool') {
        onRowChange(
          {
            ...row,
            ...SearchModalResult(searchList[selectRow], column.toolType === 'register' ? 'toolRegister' : searchModalInit.excelColumnType, column.staticCalendar),
            manager: SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
            // name: selectNameFunction(column.type),
            tab: tab,
            // type_name: undefined,
            version: row.version,
            isChange: true,
          }
        )
      } else if (column.type === "bom") {
        // const bomType = (tab:number) => {
        //   switch (tab) {
        //     case 0:
        //       return "rawmaterial"
        //     case 1:
        //       return "submaterial"
        //     case 2:
        //       return "product"
        //     default:
        //       return "rawmaterial"
        //   }
        // }
        const searchModalResult = SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar)
        delete searchModalResult.doubleClick
        onRowChange(
          {
            ...row,
            ...searchModalResult,
            name: selectNameFunction(column.type),
            tab: tab === null ? 0 : tab,
            version: row.version,
            isChange: true,
            //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
            returnType: column.key
          }
        )
      } else {
        // alert("모달 클릭하면 여기가 실행 and onRowChange 실행")
        // console.log("selectList.size : ", selectList.size);
        // console.log("searchList : ", searchList);

        const newRows = []

        selectList.forEach((id, i) => {
          const s = selectList;
          // const index = 0;

          searchList.forEach((row, index) => {
            if (row.id === id) {

              // console.log("check : ", id);
              // console.log("index : ", index);

              // console.log("searchList[i]", searchList[index]);


              newRows.push(searchList[index]);
            }
          })

        })

        // console.log("newRows : ", newRows);

        const array_for_update = newRows.map((rowdata) => {

          const random_id = Math.random() * 1000;


          return (
            {
              ...row,
              id: "orderinfo_" + random_id,
              ...SearchModalResult(rowdata, searchModalInit.excelColumnType, column.staticCalendar),
              manager: SearchModalResult(rowdata, searchModalInit.excelColumnType).manager,
              name: selectNameFunction(column.type),
              tab: tab,
              // type_name: undefined,
              version: row.version,
              isChange: true,
              //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
              returnType: column.key,
              date: row?.date,
              deadline: row?.deadline,
              goal: row?.goal
            }

          )
        })

        // console.log("array_for_update : ", array_for_update);
        // dispatch(remove_all_product_ids_for_selected_rows())


        if (newRows.length > 1) {
          onRowChange(
            // {
            //   ...row,
            //   ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar),
            //   manager: SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
            //   name: selectNameFunction(column.type),
            //   tab: tab,
            //   // type_name: undefined,
            //   version: row.version,
            //   isChange: true,
            //   //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
            //   returnType: column.key,
            //   date: row?.date,
            //   deadline: row?.deadline,
            //   goal: row?.goal
            // }
            // hyunsok
            [...array_for_update]
          )

        } else {
          onRowChange(
            {
              ...row,
              ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType, column.staticCalendar),
              manager: SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
              name: selectNameFunction(column.type),
              tab: tab,
              // type_name: undefined,
              version: row.version,
              isChange: true,
              //일상 점검 모달에서 작성자 확인 / 관리자 확인 구분 용도
              returnType: column.key,
              date: row?.date,
              deadline: row?.deadline,
              goal: row?.goal
            }
            // [...array_for_update]
          )
        }

      }

    }
  }

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


            <ExcelTable
              // searchModalColumn
              // headerList={ searchModalInit && searchModalList[`${searchModalInit.excelColumnType}Search`]}
              headerList={searchModalInit && [SelectColumn, ...searchModalColumn]}
              selectList={selectList}

              //@ts-ignore
              setSelectList={setSelectList}
              row={searchList ?? []}
              // row={basicRow ?? []}
              setRow={(e) => {
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
              height={640}
              setSelectRow={(e) => {
                setSelectedRows([])
                let tmp: Set<any> = selectList;

                console.log(" : ", product_ids_for_selected_rows);


                const update = searchList.map((row, index) => {

                  if (e === index) {
                    console.log("searchList : ", searchList);

                    if (product_ids_for_selected_rows.includes(searchList[e].product_id)) {
                      tmp.delete(row.id)
                      dispatch((
                        remove_product_ids_for_selected_rows(searchList[e].product_id)
                      ))
                      // setSelectedRows(
                      //   selectedRows.filter((e) => {
                      //     e !== index
                      //   })
                      // )
                      return {
                        ...row,
                        // doubleClick: confirmFunction,
                        border: false
                      }
                    } else {
                      tmp.add(row.id)

                      // 2244
                      console.log("searchList : ", searchList);
                      dispatch((
                        add_product_ids_for_selected_rows(searchList[e].product_id)
                      ))

                      return {
                        ...row,
                        // doubleClick: confirmFunction,
                        border: true
                      }
                    }

                  } else {
                    return {
                      ...row,
                      // doubleClick: confirmFunction,
                      // border: product_ids_for_selected_rows.includes(searchList[e].product_id)
                    }
                  }
                })

                // setSelectedRows([])22
                setSearchList(update);

                setSelectRow(e)
              }}
              type={'searchModal'}
              scrollEnd={(value) => {
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
                setSelectRow(undefined)
                setOptionIndex(0)
                setKeyword('')
              }}
              style={{ backgroundColor: '#E7E9EB' }}
            >
              <p style={{ color: '#717C90' }}>취소</p>
            </FooterButton>
            <FooterButton
              onClick={() => { confirmFunction() }}
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
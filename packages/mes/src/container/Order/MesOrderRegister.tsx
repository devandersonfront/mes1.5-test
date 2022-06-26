import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod , } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import moment from 'moment'
// import { useDispatch } from "react-redux";
import { deleteSelectMenuState, setSelectMenuStateChange } from "shared/src/reducer/menuSelectState";

import { useDispatch, useSelector } from "react-redux";
import {RootState} from 'shared/src/reducer'
import {add_product_ids_for_selected_rows} from "shared/src/reducer/product_ids_for_selected_rows_state";



interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesOrderRegister = ({ page, keyword, option }: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD')
  }])

  const [basicRow2, setBasicRow2] = useState<Array<any>>([{
    // date: moment().format('YYYY-MM-DD'),
    // deadline: moment().format('YYYY-MM-DD')
  }])

  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["orderRegister"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  const selector = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state)
  const product_ids_for_selected_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_selected_rows)


  // useEffect(() => {

  //   if (basicRow.length < 1) {
  //     setBasicRow([{
  //       date: moment().format('YYYY-MM-DD'),
  //       deadline: moment().format('YYYY-MM-DD')
  //     }])
  //   }
  // }, [basicRow])

  useEffect(() => {
    getMenus()
    Notiflix.Loading.remove()
    dispatch(setSelectMenuStateChange({ main: "영업 관리", sub: router.pathname }))
    return (() => {
      dispatch(deleteSelectMenuState())
    })
  }, [])

  useEffect(() => {
  }, [basicRow])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_SALES_01'
      }
    })

    if (res) {
      let tmpColumn = columnlist["orderRegister"]

      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object | undefined;
        res.bases && res.bases.map((menu: any) => {
          if (menu.colName === column.key) {
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab: menu.tab,
              unit: menu.unit,
              moddable: menu.moddable
            }
          } else if (menu.colName === 'id' && column.key === 'tmpId') {
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab: menu.tab,
              unit: menu.unit,
              moddable: menu.moddable
            }
          }
        })

        if (menuData) {
          return {
            ...column,
            ...menuData,
          }
        }

      }).filter((v: any) => v)

      setColumn([...tmpColumn.map(v => {
        return {
          ...v,
          name: !v.moddable ? v.name + '(필수)' : v.name
        }
      })])
    }
  }

  const SaveBasic = async () => {
    let res: any
    let checkValue = true;

    if (selectList.size <= 0) {
      Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
      return
    }
    const error = basicRow.map((row) => {
      if (selectList.has(row.id) && !row.code) {
        // Notiflix.Report.warning("경고","CODE를 입력해주세요.","확인")
        return 1
      } else if (!Number(row.amount)) {
        // Notiflix.Report.warning("경고","수주량을 정확히 입력해주세요.","확인")
        return 2
      }
    })
    // else{
    //   basicRow.map((row) => {
    //     if(!Number(row.amount) && row.amount !== "0"){
    //       Notiflix.Report.warning("경고", "정확한 수주량을 입력해주세요.", "확인", )
    //       checkValue = false;
    //       return;
    //     }
    //   })
    // }
    if (error.includes(1)) {
      return Notiflix.Report.warning("경고", "CODE를 입력해주세요.", "확인")
    } else if (error.includes(2)) {
      return Notiflix.Report.warning("경고", "수주량을 정확히 입력해주세요.", "확인")
    }
    if (!checkValue) return

    res = await RequestMethod('post', `contractSave`,
      basicRow.map((row, i) => {
        if (selectList.has(row.id)) {
          let selectKey: string[] = []
          let additional: any[] = []
          column.map((v) => {
            if (v.selectList) {
              selectKey.push(v.key)
            }

            if (v.type === 'additional') {
              additional.push(v)
            }
          })

          let selectData: any = {}

          Object.keys(row).map(v => {
            if (v.indexOf('PK') !== -1) {
              selectData = {
                ...selectData,
                [v.split('PK')[0]]: row[v]
              }
            }
          })

          return {
            ...row,
            ...selectData,
            customer: row.customerArray,
            amount: row.amount ?? 0,
            additional: [
              ...additional.map(v => {
                if (row[v.name]) {
                  return {
                    id: v.id,
                    title: v.name,
                    value: row[v.name],
                    unit: v.unit
                  }
                }
              }).filter((v) => v)
            ]
          }

        }
      }).filter((v) => v))


    if (res) {
      Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
        router.push('/mes/order/list')
      });
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        let random_id = Math.random() * 1000;
        setBasicRow([
          {
            name: "", id: "order" + random_id, date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD')
          },
          ...basicRow
        ])
        break;
      case 1:
        SaveBasic()

        break;
      case 2:
        if (selectList.size <= 0) {
          Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
        } else {
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
            () => {
              const filter = basicRow.filter((row, index) => !selectList.has(row.id))
              setBasicRow([...filter])
              setSelectList(new Set())
            },
            () => { }
          )
        }
        break;
    }
  }
  // console.log("basicRow2[0].product_id : ", basicRow2[0].product_id);

  return (
    <div>
      <PageHeader
        title={"수주 정보 등록"}
        buttons={
          ['행추가', '저장하기', '삭제']
        }
        buttonsOnclick={
          onClickHeaderButton
        }
      />

      {/* search table */}
      <ExcelTable
        editable
        resizable
        headerList={[
          SelectColumn,
          ...column
        ]}
        row={basicRow}
        setRow={(e) => {
          console.log("e : ", e);
          let tmp: Set<any> = selectList

          e.map((row) => {

            if (row.length > 1) {
              row.map(el => {
                if (el.isChange) {
                  tmp.add(el.id)
                  el.isChange = false
                }
              })
            }

          })

          e.map(v => {
            if (v.isChange) {
              tmp.add(v.id)
              v.isChange = false
            }
          })

          setSelectList(tmp)

          const current_rows_product_ids = basicRow2.map((row) => {
            console.log("row.product_id : ", row.product_id);
            return row.product_id
          })

          // console.log("current_rows_product_ids ; ", current_rows_product_ids);

          console.log("e[0] : ", e[0]);
          if (e[0].length > 1) {

            const result_ids = basicRow2.map(row => row.product_id)

            if (basicRow2.length > 1) {
              const rows_for_update = e[0].filter((row) => {
                if (!result_ids.includes(row.product_id)) {
                  return row;
                }
              })
              setBasicRow2((prev) => [...prev, ...rows_for_update])
            } else {
              // alert("여러줄")
              if(!product_ids_for_selected_rows.includes(e[0].product_id)){

                setBasicRow2(e[0]);
              }else{
                console.log("여기 실행되면 아무것도 추가 안됨");
                // console.log(e);
              }              
            }

          } else {
            // alert(" 한줄")
            // console.log("e :::::::", e);
            // console.log("basicRow2 : ", basicRow2);

            if(basicRow2[0].product_id){

              if(e[0].product_id !== undefined){
                console.log("여기 실행 11 !!");
                
                setBasicRow2(e)
              } else {
                console.log("여기 실행 22 !!");
                setBasicRow2(e[0]);
              }

            } else {

              const basicrow_product_ids = basicRow2.map((row)=> {
                return row.product_id;
              })

              console.log("basicrow_product_ids : ", basicrow_product_ids);
              

              if(basicrow_product_ids.includes(e[0].product_id)){
                console.log("기존 로우에 있음");
                
                setBasicRow2((prev)=> [...prev, e[0]])
                
              } else {
                console.log("기존 로우에 없음");

                setBasicRow2(e)
              }

            }
            


            // console.log("basicrow_product_ids : ", basicrow_product_ids);


          }


        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={basicRow.length * 40 >= 40 * 18 + 56 ? 40 * 19 : basicRow.length * 40 + 56}
      />

      {/* hyun's table */}

      <h2 style={{color: "white", fontSize: "21px"}}>검색 결과</h2>

        

      {basicRow.length >= 1 ? (
        // searchResultTable
        <ExcelTable
          customHeaderRowHeight={1}
          rowHeight={basicRow2.length > 0  ? 40 : 0}
          editable
          resizable
          headerList={[
            SelectColumn,
            ...column
          ]}
          row={basicRow2}
          setRow={(e) => {

          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          width={1576}
          height={basicRow2.length * 40 >= 40 * 18 + 56 ? 40 * 19 : basicRow2.length * 40 + 56}
        />
      )
        :
        ""
      }


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

export { MesOrderRegister };

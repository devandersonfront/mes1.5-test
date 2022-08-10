import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import moment from 'moment'
// import { deleteSelectMenuState, setSelectMenuStateChange } from "shared/src/reducer/menuSelectState";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";


import { useDispatch, useSelector } from "react-redux";
import { RootState } from 'shared/src/reducer'
import { add_product_ids_for_removed_rows, add_product_ids_for_selected_rows, cancel_product_ids_for_modal, initialize_product_ids_for_basicrow, remove_product_ids_for_selected_rows, set_product_ids_for_selected_rows } from "shared/src/reducer/product_ids_for_selected_rows_state";
import { off } from 'process';
import { tmpdir } from 'os';



interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}



const MesOrderRegister = ({ page, keyword, option }: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD'),
    isFirst: true
  }])
  const [basicRow2, setBasicRow2] = useState<Array<any>>([{
    // date: moment().format('YYYY-MM-DD'),
    // deadline: moment().format('YYYY-MM-DD')
  }])
  22
  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [codeCheck, setCodeCheck] = useState<boolean>(true)

  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["orderRegister"])

  const selector = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state)
  const product_ids_for_selected_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_selected_rows)
  const product_ids_for_removed_rows = useSelector((selector: RootState) => selector.product_ids_for_selected_rows_state.product_ids_for_removed_rows)

  console.log(basicRow, 'basicRow')


  useEffect(() => {
    console.log(`The current value of imageUri is: ${basicRow}`);
    dispatch(
      cancel_product_ids_for_modal()
    )
  }, []);

  useEffect(() => {
    // console.log("12", selectList.size);
    console.log("basicRow.length : ", basicRow.length);

  }, [])

  useEffect(() => {
    getMenus()
    Notiflix.Loading.remove()
    dispatch(setMenuSelectState({ main: "영업 관리", sub: router.pathname }))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  }, [])

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

    console.log(selectList, 'selectList')
    console.log(selectList.size, 'size')


    if (selectList.size <= 0) {
      await Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
      return
    }

    console.log("basicRow : ", basicRow);

    const error = basicRow.map((row) => {
      if (selectList.has(row.id) && !row.code) {
        // Notiflix.Report.warning("경고","CODE를 입력해주세요.","확인")
        return 1
      } else if (!Number(row.amount)) {
        // Notiflix.Report.warning("경고","수주량을 정확히 입력해주세요.","확인")
        return
      }
      else {
        basicRow.map((row) => {
          if (!Number(row.amount) && row.amount !== "0") {
            Notiflix.Report.warning("경고", "정확한 수주량을 입력해주세요.", "확인",)
            checkValue = false;
            return;
          }
        })
      }
    })

    if (error.includes(1)) {
      return Notiflix.Report.warning("경고", "CODE를 입력해주세요.", "확인")
    } else if (error.includes(2)) {
      return Notiflix.Report.warning("경고", "수주량을 정확히 입력해주세요.", "확인")
    }
    if (!checkValue) return
    console.log("basicRow : ", basicRow.map((row, i) => {

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

        let random_process_id = Math.random() * 1000;

        return {
          ...row,
          process: {
            process_id: random_process_id,
            name: process,
            additional: []
          },
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
    }).filter((v) => v));



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
          // 2244
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
            () => {

              console.log("selectList : ", selectList);
              // selectList.forEach((id)=> {
              //   console.log("id !! ", id);

              //   add_product_ids_for_removed_rows(id)
              //   remove_product_ids_for_selected_rows(id)
              // })              

              const filtered_array = basicRow.filter((row, index) => !selectList.has(row.id))

              console.log("filetered_array : ", filtered_array);

              const current_array_for_product_id = filtered_array.map((el) => el.product_id)
              console.log("current_array_for_product_id : ", current_array_for_product_id);


              const new_selected_row_for_update = product_ids_for_selected_rows.filter((id) => {
                if (current_array_for_product_id.includes(id)) {
                  return id
                }
              })

              console.log("new_selected_row_for_update : ",);

              dispatch(
                set_product_ids_for_selected_rows(new_selected_row_for_update)
              )

              if (filtered_array.length === 0) {
                setBasicRow([{
                  date: moment().format('YYYY-MM-DD'),
                  deadline: moment().format('YYYY-MM-DD'),
                  isFirst: true

                }])
              } else {
                setBasicRow([...filtered_array])
              }

              setSelectList(new Set())
            },
            () => { }
          )
        }
        break;
    }
  }

  // step 4
  // 선택한 행의 정보로 수주 정보 등록 테이블을 초기화
  const mysetrow = async (e: any) => {
    setCodeCheck(false)
    console.log("e[0] <=> 넘어온 정보 , ", e[0]);
    let registered_prodouct_ids_arr = basicRow.map(row => row.code)
    // dispatch(initialize_product_ids_for_basicrow([...registered_prodouct_ids_arr]))
    // console.log("기존 행 ids (필터링 전) : ", registered_prodouct_ids_arr);

    let filtered_array_for_register = []
    let array_for_register_of_search_result = [];
    let tmp: Set<any> = selectList

    filtered_array_for_register = basicRow.filter((row) => {
      if (!product_ids_for_removed_rows.includes(row.code)) {
        return row
      }
    })
    console.log("필터링된 행 정보 : ", filtered_array_for_register);
    // console.log("e[0] : ", e[0]);

    // filtered_array_for_register
    // 디폴트행 제거
    filtered_array_for_register = filtered_array_for_register.filter((row, index) => {
      if (row.code) {
        return row
      }
    })

    console.log("==========================");

    // console.log("filtered_array_for_register : ", filtered_array_for_register);
    // console.log("filtered_array_for_register : ", filtered_array_for_register);

    // 기존행 ids 정보 초기화
    registered_prodouct_ids_arr = basicRow.map((row, index) => {
      return row.code
    })
    console.log("e[0].length : ", e[0].length);

    array_for_register_of_search_result = e[0].filter((row, index) => {
      if (row.code && !registered_prodouct_ids_arr.includes(row.code) && !product_ids_for_removed_rows.includes(row.code)) {
        tmp.add(row.id)
      }

      if (product_ids_for_removed_rows.includes(row.code)) {
        console.log("row.id : ", row.id);

        tmp.delete(row.id)
      }

      
      setSelectList(tmp)

      if (!registered_prodouct_ids_arr.includes(row.code)) {
        return row
      }
    })

    console.log("추가할 행 정보 : ", [...filtered_array_for_register, ...array_for_register_of_search_result]);

    const current_row_ids = array_for_register_of_search_result.map((row) => {
      return row.code
    })

    // dispatch(initialize_product_ids_for_basicrow([...current_row_ids]))


    // [{
    //   date: moment().format('YYYY-MM-DD'),
    //   deadline: moment().format('YYYY-MM-DD')
    // }],

    let new_array = [...filtered_array_for_register, ...array_for_register_of_search_result]

    console.log("new_array : ", new_array);

    // alert("실행 확인")
    // new_array = new_array.filter((row, index) => {
    //   if (row.code !== undefined) {
    //     return row
    //   }
    // })

    // 기존 행에 없는것만 추가 

    new_array = new_array.map((row, index) => {

      if (index === 0) {
        return {
          ...row,
          isFirst: true
        }

      } else {
        return {
          ...row,
          isFirst: false
        }
      }

    })

    if (new_array.length == 0) {
      setBasicRow([{
        date: moment().format('YYYY-MM-DD'),
        deadline: moment().format('YYYY-MM-DD'),
        isFirst: true
      }])
      console.log("basicRow : ", basicRow);
      setSelectList(new Set())
      // setBasicRow()
    }
    else {
      await setBasicRow(prev => [...new_array])
    }

  }

  // console.log("basicRow : ", basicRow[0]);

  // useEffect(() => {
  //   if(basicRow.length === 0 ){
  //     let tmp: Set<any> = selectList
  //     setSelectList(new Set())
  //   }
  // },[basicRow])


  return (
    <div>
      <PageHeader
        title={"수주 정보 등록"}
        buttons={
          ['', '저장하기', '삭제']
        }
        buttonsOnclick={
          onClickHeaderButton
        }
      />

      <ExcelTable
        editable
        resizable
        headerList={[
          SelectColumn,
          ...columnlist.orderRegisterManage({ basicRow: basicRow, setbasicRow: setBasicRow, codeCheck: true })
        ]}
        row={basicRow}
        // step4
        setRow={(e) => {
          console.log('setrow', e)
          let random_id = Math.random() * 1000;
          let tmp: Set<any> = selectList

          // 여러행일때
          // setSelectList(tmp)

          if (e[0].length) {
            console.log("11 ");

            e.map((row) => {
              if (product_ids_for_removed_rows.includes(row.code)) {
                console.log("row.id : ", row.id);
                tmp.delete(row.id)
              }
            })

            setSelectList(tmp);


            mysetrow(e)

          } else if (e) {
            console.log("hihhihi");
            
            e.map((row) => {
              if (row.isChange && !product_ids_for_removed_rows.includes(row.code)) {
                tmp.add(row.id)
              }
            })
            setSelectList(tmp);

            if(e[0].length === 0 ){
              setSelectList(new Set())
            }


            const current_rows = basicRow.map((row) => row.code);

            setBasicRow(
              basicRow.map((row)=> {
                return {
                  ...row,
                  isChange: false
                }
              })
            )

            if (e[0] && current_rows.includes(e[1]?.code) && !e[0].code) {
              setBasicRow([
                {
                  name: "", id: "order" + random_id, date: moment().format('YYYY-MM-DD'),
                  deadline: moment().format('YYYY-MM-DD'),
                  isFirst: true

                },
              ])

            } else {
              console.log("1 : ", e);
              if (e[0].length === 0) {
                console.log("11111");
                
                setBasicRow([
                  {
                    name: "", id: "order" + random_id, date: moment().format('YYYY-MM-DD'),
                    deadline: moment().format('YYYY-MM-DD'),
                    isFirst: true
                  },
                ])
              } else {
                console.log("12341234 1111, " , e);

                const new_rows = e.map((row) => {
                  if (row.isChange && !product_ids_for_removed_rows.includes(row.code)) {
                    tmp.add(row.id)
                  }
                  return {
                    ...row,
                    isChange: false
                  }
                })

                setSelectList(tmp)

                setBasicRow(new_rows)
              }


            }

            // setBasicRow(e)
            // if(basicRow.length === 0 ){
            //   setBasicRow([
            //     {
            //       name: "", id: "order" + random_id, date: moment().format('YYYY-MM-DD'),
            //       deadline: moment().format('YYYY-MM-DD')
            //     },
            //   ])
            // }
            // console.log("power");
          } else {

            console.log("e99999", e);
            // const current_rows = basicRow.map((row)=> row.code);

            // if(basicRow.includes(e[1].code)){
            //   if(e[0]){
            //   setBasicRow(e)

            //   }


            // } else {
            //   setBasicRow(e)
            // }


            // if(e[0]=[]){
            //   e[1] = []

            // }

            // if(e[0] == [] || e[1] == []){
            //   setBasicRow([
            //     {
            //       name: "", id: "order" + random_id, date: moment().format('YYYY-MM-DD'),
            //       deadline: moment().format('YYYY-MM-DD')
            //     },
            //   ])
            // }

            console.log("2222222", e);
            setBasicRow(e)
          }
        }}

        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={basicRow.length * 40 >= 40 * 18 + 56 ? 40 * 19 : basicRow.length * 40 + 56}
      />

      {/* <div style={{color:"yellow"}}>hi</div> */}

      {/* <ExcelTable
        editable
        resizable
        height={basicRow[0] !== undefined && basicRow[0]?.code ? basicRow.length * 40 >= 40 * 18 + 56 ? 40 * 19 : basicRow.length * 40 + 56 : 0}
        headerList={[
          SelectColumn,
          ...columnlist.orderRegisterManage({ basicRow: basicRow, setBasicRow: setBasicRow, codeCheck: false })
        ]}
        customHeaderRowHeight={0}
        row={basicRow}

        // step4
        setRow={(e) => {
          if (e[0].length) {
            console.log("111111111");
            mysetrow(e)

          } else {
            console.log("422222", e);
            setBasicRow(e)
            // mysetrow2(e[0])
          }
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
      /> */}

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

import React, { useEffect, useState } from 'react'
import { columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, } from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import moment from 'moment'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch, } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'



interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesOrderRegister = ({ }: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD'),
    isFirst: true
  }])
  const [column, setColumn] = useState<any>(columnlist["orderRegister"]())
  const [currentSelectedRows, setCurrentSelectedRows] = useState([]);

  // useEffect(() => {
  //   if (basicRow.length > 0 && currentSelectedRows.length > 0) {

  //     const new_rows = basicRow.map((row) => {
  //       if (currentSelectedRows.includes(row.code)) {
  //         return {
  //           ...row,
  //           border: true
  //         }
  //       }
  //     })

  //     setBasicRow([...new_rows])
  //   }
  // }, [basicRow, currentSelectedRows])

  useEffect(() => {
    getMenus()
    dispatch(setMenuSelectState({ main: "영업 관리", sub: router.pathname }))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  }, [])

  const setMenu = (menus: any[]) => (
    columnlist.orderRegister().map(col => {
      const newMenus = menus.filter(menu => menu.colName === col.key).map(menu => ({
        id: menu.mi_id,
        name: !menu.moddable ? menu.title + '(필수)' : menu.title,
        width: menu.width,
        tab: menu.tab,
        unit: menu.unit,
        moddable: menu.moddable
      }))
      return { ...col, ...newMenus[0] }
    })
  )

  const getMenus = async () => {

    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_SALES_01'
      }
    })
    if (res) {
      setColumn(setMenu(res.bases))
    }
  }

  const SaveBasic = async () => {
    try {
      if (selectList.size < 1) throw ("데이터를 선택해주세요.")

      basicRow.map((row) => {
        if (selectList.has(row.id)) {
          if (!row.code) {
            throw ("CODE를 입력해주세요.")
          } else if (!Number.isInteger(Number(row.amount)) || row.amount < 1) {
            throw ("수주량을 정확히 입력해주세요.")
          }
        }
      })


      const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => (
        {
          ...row,
          customer: row.customerArray,
          amount: row.amount ?? 0,
        }))
      Notiflix.Loading.circle()
      const res = await RequestMethod('post', `contractSave`, postBody)

      if (res) {
        Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
          router.push('/mes/order/list')
        });
      }
    } catch (errMsg) {
      Notiflix.Report.warning("경고", errMsg, "확인")
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        SaveBasic()

        break;
      case 1:
        if (selectList.size < 1) {
          Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
        } else {
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
            () => {
              const filteredRows = basicRow.filter((row, index) => !selectList.has(row.id))
              if (filteredRows.length === 0) {
                setBasicRow([{
                  date: moment().format('YYYY-MM-DD'),
                  deadline: moment().format('YYYY-MM-DD'),
                  isFirst: true
                }])
              } else {
                setBasicRow(filteredRows)
              }
              setSelectList(new Set())
            },
            () => { }
          )
        }
        break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"수주 정보 등록"}
        buttons={
          ['저장하기', '삭제']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        headerList={[
          SelectColumn,
          ...column.map(col => ({ ...col, basicRow, setBasicRow, currentSelectedRows, setCurrentSelectedRows }))
        ]}
        row={basicRow}
        setRow={(row) => {
          let tmp: Set<any> = selectList
          row.map(v => {
            if (v.isChange) tmp.add(v.id)
          })
          setSelectList(tmp)
          setBasicRow(row)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={setExcelTableHeight(basicRow.length)}
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

export { MesOrderRegister };

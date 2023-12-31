import React, { useEffect, useState } from 'react'
import {
  columnlist, ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { useRouter } from 'next/router'
import { NextPageContext } from 'next'
import moment from 'moment'
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import { useDispatch, } from "react-redux";
import { setExcelTableHeight } from 'shared/src/common/Util'
import Checkbox from "shared/src/components/InputBox/Checkbox";
import OperationRegisterModal from "../../../../shared/src/components/Modal/Operation/OperationRegisterModal";



interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesOrderRegister = ({ }: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD'),
    isFirst: true
  }])
  const [column, setColumn] = useState<any>(columnlist["orderRegister"]())
  const [operationModal, setOperationModal] = useState<boolean>(false)


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
     if (process.env.NEXT_PUBLIC_CUSTOM_TARGET == "ai"){
      setColumn([...setMenu(res.bases),
        process.env.NEXT_PUBLIC_CUSTOM_TARGET == "ai" && { key: "ai_check", name: "작업지시서 등록", width: 118, formatter: Checkbox, columnType:"checkbox" }])
     } else setColumn(setMenu(res.bases))
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


      let postBody = basicRow.filter(row => selectList.has(row.id)).map(row => (
        {
          ...row,
          product: {
            ...row.product,
            customer : row?.customerArray?.customer_id ? row.customerArray : null,
            model : row?.modelArray?.cm_id ? row.modelArray : null
          },
          customer: row.customerArray,
          amount: row.amount ?? 0,
        }))

      if(process.env.NEXT_PUBLIC_CUSTOM_TARGET == "ai"){
        postBody = postBody.map((row) => {
          if(row.ai_check) {
            return {contract:row, make_sheet:true}
          }else{
            return {contract:row, make_sheet:false}
          }
        })
      }
      Notiflix.Loading.circle()

      const res = await RequestMethod('post', process.env.NEXT_PUBLIC_CUSTOM_TARGET == "ai" ? `aiContractSave` : `contractSave`, postBody)

      if(res && basicRow.find((v) => v.ai_check)){
        const resultData = basicRow.map((row, index) => {
          let tmpRow = {...row}
          if(row.ai_check){
            res.map((v) => {
              if(v.product.product_id == row.product.product_id) tmpRow.operationData = v
            })

          }
          return tmpRow
        })
        setBasicRow(resultData)
          Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
            setOperationModal(true)
          });
      }
      else if (res) {
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
        setExcelOpen(true)
        break;

      case 1:
        SaveBasic()

        break;
      case 2:
        if (selectList.size < 1) {
          Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
        } else {
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
            () => {
              let filteredRows = basicRow.filter((row, index) => !selectList.has(row.id))
              if (filteredRows.length === 0) {
                filteredRows = [{
                  date: moment().format('YYYY-MM-DD'),
                  deadline: moment().format('YYYY-MM-DD'),
                  isFirst: true
                }]
              } else {
                filteredRows[0] = {...filteredRows[0], isFirst: true}
              }
              setBasicRow(filteredRows)
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
          ['엑셀', '저장하기', '삭제']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        headerList={[
          SelectColumn,
          ...column.map(col => ({ ...col, basicRow, setBasicRow }))
        ]}
        row={basicRow}
        setRow={(row) => {
          let tmp: Set<any> = new Set(selectList)
          const newRow = row.map(v => {
            if (v.isChange) tmp.add(v.id)
            return {
              ...v,
              id:v.id,
              isChange: false
            }
          })
          setSelectList(tmp)
          setBasicRow(newRow)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={setExcelTableHeight(basicRow.length)}
      />

      {operationModal && <OperationRegisterModal row={basicRow.filter((v) => v.ai_check)} isOpen={operationModal} setIsOpen={setOperationModal}/>}

      <ExcelDownloadModal
          isOpen={excelOpen}
          toMovePageName={'/mes/order/list'}
          category={"contract"}
          title={"수주 정보"}
          setIsOpen={setExcelOpen}
          resetFunction={() => {}}
          onlyForm={true}
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

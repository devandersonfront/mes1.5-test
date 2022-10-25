import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    RootState
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { alertMsg } from 'shared/src/common/AlertMsg'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesOrderModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state:RootState) => state.modifyInfo)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", order_date: moment().format('YYYY-MM-DD'),
    limit_date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["orderModify"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  useEffect(() => {
    if(selector && selector.type && selector.modifyInfo){
      setBasicRow(selector.modifyInfo.map(info => ({
          ...info,
          customer_id: info?.product?.customer?.name ?? '-',
          cm_id: info?.product?.model?.model ?? '-',
          name: info.product?.name ?? '-'
        })
      ))
    }else{
      router.push('/mes/order/list')
    }
  }, [selector])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"영업 관리",sub:"/mes/order/list"}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const SaveBasic = async () => {
    try {

      const postBody = basicRow.map((row, i) => {
        if(selectList.has(row.id)){
          let selectKey: string[] = []
          let additional:any[] = []
          column.map((v) => {
            if(v.selectList){
              selectKey.push(v.key)
            }

            if(v.type === 'additional'){
              additional.push(v)
            }
          })

          let selectData: any = {}

          Object.keys(row).map(v => {
            if(v.indexOf('PK') !== -1) {
              selectData = {
                ...selectData,
                [v.split('PK')[0]]: row[v]
              }
            }
          })

          return {
            ...row,
            ...selectData,
            product: {
              ...row.product,
              customer : row?.customerArray?.customer_id ? row.customerArray : null,
              model : row?.modelArray?.cm_id ? row.modelArray : null
            },
            customer: row.customerArray,
            additional: [
              ...additional.map(v => {
                if(row[v.name]) {
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
      }).filter((v) => v)
      if(postBody.length < 1)
      {
        throw(alertMsg.noSelectedData)
      }
      const res = await RequestMethod('post', `contractSave`, postBody)
      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => {
          router.push('/mes/order/list')
        });
      }
    } catch (errMsg){
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        SaveBasic()

        break;
      // case 1:
      //   Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
      //     ()=>{},
      //     ()=>{}
      //   )
      //   break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"수주 정보 (수정)"}
        buttons={
          ['저장하기']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        selectable
        headerList={[
          SelectColumn,
          ...column
        ]}
        row={basicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          e.map(v => {
            if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
          })
          setSelectList(tmp)
          setBasicRow(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
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

export {MesOrderModify};

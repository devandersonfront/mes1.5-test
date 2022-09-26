import React, {useEffect, useState} from 'react'
import {columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { alertMsg } from 'shared/src/common/AlertMsg'
import { RegisterContainer } from 'shared/src/containers/RegisterContainer'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesSubMaterialInput = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [basicRow, setBasicRow] = useState<Array<any>>([])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"부자재 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  //
  // const getMenus = async () => {
  //   let res = await RequestMethod('get', `loadMenu`, {
  //     path: {
  //       tab: 'ROLE_WIP_01'
  //     }
  //   })
  //
  //   if(res){
  //     let tmpColumn = columnlist["subinV1u"]
  //
  //     tmpColumn = tmpColumn.map((column: any) => {
  //       let menuData: object | undefined;
  //       res.bases && res.bases.map((menu: any) => {
  //         if(menu.colName === column.key){
  //           menuData = {
  //             id: menu.id,
  //             name: menu.title,
  //             width: menu.width,
  //             tab:menu.tab,
  //             unit:menu.unit,
  //             moddable: menu.moddable,
  //           }
  //         } else if(menu.colName === 'id' && column.key === 'tmpId'){
  //           menuData = {
  //             id: menu.id,
  //             name: menu.title,
  //             width: menu.width,
  //             tab:menu.tab,
  //             unit:menu.unit,
  //             moddable: menu.moddable,
  //           }
  //         }
  //       })
  //
  //       if(menuData){
  //         return {
  //           ...column,
  //           ...menuData,
  //         }
  //       }
  //     }).filter((v:any) => v)
  //
  //     setColumn([...tmpColumn.map(v=> {
  //       return {
  //         ...v,
  //         name: !v.moddable ? v.name+'(필수)' : v.name
  //       }
  //     })])
  //   }
  // }

  const validate = (row) => {
    if(!!!row.sm_id) throw(alertMsg.noSubMaterial)
    if(!!!row.warehousing) throw(alertMsg.noImportAmount)
    if(!!!row.lot_number) throw(alertMsg.noLotNumber)
  }

  const checkDuplicateLotNumber = (lotNumbers: string[]) => {
    if(lotNumbers.length !== new Set(lotNumbers).size) throw (alertMsg.duplicateLotNumber)
  }

  const setPostBody = (row) => ({
    ...row,
    current: row.warehousing,
    warehousing: row.warehousing,
    customer: row.customerArray,
    version: undefined,
    sub_material : {
      ...row.sub_material,
      customer : row?.customerArray?.customer_id ? row.customerArray : null,
    }
  })

  return (
    <RegisterContainer title={'부자재 입고 등록'}
                       data={basicRow}
                       setData={setBasicRow}
                       validate={validate}
                       setPostBody={setPostBody}
                       apiType={'lotSmSave'}
                       afterSavePath={'/mes/submaterialV1u/stock'}
                       columnKey={'subinV1u'}
                       checkDuplicate={checkDuplicateLotNumber}
                       initData={{ id: "", date: moment().format('YYYY-MM-DD')}}
                       multiRegister={true}
                       duplicateKey={'lot_number'}
    />
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

export {MesSubMaterialInput};

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
import {forEach} from "lodash";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesRawMaterialInput = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [radioNum, setRadioNum ] = useState<number>(0)

  useEffect(() => {
    dispatch(setMenuSelectState({main:"원자재 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const validate = (row) => {
    if(!!!row.rm_id) throw(alertMsg.noRawMaterial)
    if(!!!row.amount) throw(alertMsg.noImportAmount)
    if(!!!row.lot_number) throw(alertMsg.noLotNumber)
  }

  const checkDuplicateLotNumber = (lotNumbers: string[]) => {
    if(lotNumbers.length !== new Set(lotNumbers).size) throw (alertMsg.duplicateLotNumber)
  }

  const setPostBody = (row) => ({
    ...row,
    warehousing: row.amount,
    type: row.type_id,
    raw_material: {
      ...row.raw_material,
      type:row.raw_material?.type_id,
      unit:row.raw_material?.unit_id,
      customer : row?.customerArray?.customer_id ? row.customerArray : null,
    },
    version: undefined,
  })


  const saveEvent = async (data,selectList) => {
    try {
      const filterSelectedRows = (data) => data.filter((row) => selectList.has(row.id))
      const rows = filterSelectedRows(data)
      checkDuplicateLotNumber && checkDuplicateLotNumber(rows.map(row => row['lot_number']))
      const postBody = radioNum ? normalSave(rows) : unitCountSave(rows)
      await RequestMethod("post", "lotRmSave", postBody)
          .then((res) => {
            Notiflix.Report.success("저장되었습니다.", "", "확인", () => {
              router.push("/mes/rawmaterialV1u/inputList")
            })
      })
    }catch (errMsg){
      console.log(errMsg,'errMsg')
      Notiflix.Report.warning('경고',errMsg,'확인')
    }
  }

  const normalSave = (rows) => {
    return rows.map((value)=>(
      {
          ...value,
          warehousing: value.amount,
          type: value.type_id,
          raw_material: {
          ...value.raw_material,
          type:value.raw_material?.type_id,
          unit:value.raw_material?.unit_id,
          customer : value?.customerArray?.customer_id ? value.customerArray : null,
          },
          version: undefined,
      }
    ))
  }

  const unitCountSave = (rows) => {
    let divisionData = []
    rows.map((value) => {
      if (value.unitCount) {
        for (let i = 0; i < value.unitCount; i++) {
          divisionData.push({
            ...value,
            amount: Number(value.amount) / value.unitCount,
            unitCount: undefined,
            lot_number: value.lot_number + `0${i + 1}-0${value.unitCount}`,
            warehousing: Number(value.amount) / value.unitCount,
            type: value.type_id,
            raw_material: {...value.raw_material, type: value.raw_material.type_id, unit: value.raw_material.unit_id}
          })
        }
      } else {
        divisionData.push({
          ...value,
          amount: Number(value.amount),
          unitCount: undefined,
          lot_number: value.lot_number + `01-01`,
          warehousing: Number(value.amount),
          type: value.type_id,
          raw_material: {...value.raw_material, type: value.raw_material.type_id, unit: value.raw_material.unit_id}
        })
      }
    })

    return divisionData
  }

  return (
    <RegisterContainer title={'원자재 입고 등록'}
                       data={basicRow}
                       setData={setBasicRow}
                       validate={validate}
                       setPostBody={setPostBody}
                       //버튼 커스텀
                       buttonEvent={{save:saveEvent}}
                       apiType={'lotRmSave'}
                       afterSavePath={'/mes/rawmaterialV1u/inputList'}
                       columnKey={'rawinV1u'}
                       checkDuplicate={checkDuplicateLotNumber}
                       initData={{ id: "", date: moment().format('YYYY-MM-DD')}}
                       multiRegister={true}
                       duplicateKey={'lot_number'}
                       radioButtons={['단위량','일반']}
                       useRadio
                       radioNum={setRadioNum}
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

export {MesRawMaterialInput};

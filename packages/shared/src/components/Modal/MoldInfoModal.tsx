import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import {ExcelTable} from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'
import Notiflix from 'notiflix'
import NormalModal from './NormalModal'
import { RequestMethod } from '../../common/RequestFunctions'
import MultiSelectModal from './MultiSelectModal'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify: boolean
}

const initData = {sequence: 1 , setting : 0}

const MoldInfoModal = ({column, row, onRowChange}: IProps) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false)
  const [ searchList, setSearchList ] = useState<any[]>([initData])
  const hasSaved = !!row.product_id

  useEffect(() => {
    if (isOpen) {
      if (row.molds?.length) {
        setSearchList(row.molds.map((v, i) => {
          return {
            ...v,
            ...v.mold,
            border: false,
            sequence: i + 1,
            isFirst: i === 0
          }
        }))
      } else {
        setSearchList([initData])
      }
    }
  }, [ isOpen ])

  const executeValidation = () => {
    const hasNoData = searchList.length === 0
    if(hasNoData) return
    const hasInvalidData = searchList.some(row => !row.mold_id)
    if(searchList.length === 1 && hasInvalidData) return
    const defaultSettingCount = searchList.filter(row => row.setting === 1).length

    if (hasInvalidData) {
      throw("데이터를 입력해주세요.")
    } else if (defaultSettingCount !== 1) {
      throw("기본설정은 한 개여야 합니다.")
    }
  }

  const getRequestBody = () =>
    searchList.map((mold)=> (
      {
        sequence : mold.sequence,
        setting : mold.setting,
        mold: {...mold}
      }
    )).filter((mold) => mold.mold.mold_id)

  const updateData = async () => {
    const requestBody = getRequestBody()
    return await RequestMethod('post', 'prdMoldSave', requestBody, null, null, null, row.product_id).then(() =>
      Notiflix.Report.success('저장되었습니다.','','확인', () =>
      {
        row.reload()
        // setIsOpen(false)
      }))
  }

  const onConfirm = () => {
    const hasNoData = row.molds?.length === 0 && searchList.length === 1 && !searchList[0]?.mold_id
    const isChanged = () => row?.molds?.length !== searchList.length ||
      row?.molds?.some((mold, mIdx) => mold?.mold?.mold_id !== searchList?.[mIdx]?.mold?.mold_id || mold?.setting !== searchList?.[mIdx]?.setting)
    if(!hasNoData && isChanged()) {
      if(hasSaved)
      {
        return updateData()
      } else {
        onRowChange({
          ...row,
          molds: searchList.map((v, i) => {
            return {
              sequence: i + 1,
              setting: v.setting,
              mold: v
            }
          }),
          name: row.name,
          isChange: true
        })
      }
    }
  }

  const onCloseEvent = () => {
    setIsOpen(false)
  }

  return (
    <MultiSelectModal buttonTitle={'금형'} title={'금형 정보 (해당 제품을 만드는 데 필요한 금형을 등록해주세요)'} hasData={row.molds?.length > 0} isOpen={isOpen}
                      onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent}
                      onConfirm={onConfirm} disabled={row.readonly}
                      validateConfirm={executeValidation} indexKey={'sequence'} headers={[
      [ { key: '거래처명', value: row.customerArray?.name ?? "-" }, { key: '모델', value: row.modelArray?.model ?? "-" }, ],
      [ { key: 'CODE', value: row.code ?? "-" }, { key: '품명', value: row.name ?? "-" }, {
        key: '품목 종류',
        value: row.type ? TransferCodeToValue(row.type, 'material') : "-"
      }, { key: '생산 공정', value: row.process?.name ?? "-" } ],
      [ { key: '단위', value: row.unit ?? "-" } ]
    ]} data={searchList} setData={setSearchList} dataColumnKey={'moldInfo'}/>
  )
}

export {MoldInfoModal}

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

const initData = {seq: 1 , setting : 0, isFirst:true}
const ToolInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([initData])
  const hasSaved = !!row.product_id

  useEffect(() => {
    if(isOpen) {
      if(row?.tools && row?.tools.length > 0){
        setSearchList(row.tools.map((v,i) => {
          return {
            ...v,
            ...v.tool,
            border: false,
            seq: i+1,
            isFirst: i === 0
          }
        }))
      } else {
        setSearchList([initData])
      }
    }
  }, [isOpen])

  const executeValidation = () => {
    const hasNoData = searchList.length === 0
    if(hasNoData) return
    const hasInvalidData = searchList.some(row => !row.tool_id)
    if(searchList.length === 1 && hasInvalidData) return
    const defaultSettingCount = searchList.filter(row => row.setting === 1).length

    if(hasInvalidData){
      throw("데이터를 입력해주세요.")
    }else if(defaultSettingCount === 0){
      throw("기본설정은 한 개 이상이어야 합니다.")
    }
  }

  const getRequestBody = () =>
    searchList.map((tool)=> (
      {
        sequence : tool.sequence,
        setting : tool.setting,
        tool: {...tool}
      }
    )).filter((tool) => tool.tool.tool_id)

  const updateData = async () => {
    const requestBody = getRequestBody()
    return await RequestMethod('post', 'prdToolSave', requestBody, null, null, null, row.product_id).then(() =>
      Notiflix.Report.success('저장되었습니다.','','확인', () =>
      {
        row.reload()
        // setIsOpen(false)
      }))
  }

  const onConfirm = () => {
    const hasNoData = row.tools?.length === 0 && searchList.length === 1 && !searchList[0]?.tool_id
    const isChanged = () => row?.tools?.length !== searchList.length ||
      row?.tools?.some((tool, tIdx) => tool?.tool?.tool_id !== searchList?.[tIdx]?.tool?.tool_id)
    if (!hasNoData && isChanged()) {
      if (hasSaved) {
        return updateData()
      } else {
        onRowChange({
          ...row,
          tools: searchList.map((v, i) => {
            return {
              sequence: i + 1,
              tool: v,
              setting: v.setting
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
    <MultiSelectModal buttonTitle={'공구'} title={'공구 정보 (해당 제품을 만드는 데 필요한 공구를 등록해주세요)'} hasData={row.tools?.length > 0} isOpen={isOpen}
                 onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent}
                 onConfirm={onConfirm} disabled={row.readonly}
                 validateConfirm={executeValidation} headers={[
      [ { key: '거래처명', value: row.customerArray?.name ?? "-" }, { key: '모델', value: row.modelArray?.model ?? "-" }, ],
      [ { key: 'CODE', value: row.code ?? "-" }, { key: '품명', value: row.name ?? "-" }, {
        key: '품목 종류',
        value: row.type ? TransferCodeToValue(row.type, 'material') : "-"
      }, { key: '생산 공정', value: row.process?.name ?? "-" } ],
      [ { key: '단위', value: row.unit ?? "-" } ]
    ]} data={searchList} setData={setSearchList} dataColumnKey={'toolInfo'}/>
  )
}

export {ToolInfoModal}

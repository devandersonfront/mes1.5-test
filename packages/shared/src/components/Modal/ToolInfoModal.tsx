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

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify: boolean
}

const ToolInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>(undefined)
  const [searchList, setSearchList] = useState<any[]>([{seq: 1 , setting : 1}])

  useEffect(() => {
    if(isOpen) {
      setSelectRow(undefined)
      if(row?.tools && row?.tools.length > 0){
        setSearchList(row.tools.map((v,i) => {
          return {
            ...v,
            ...v.tool,
            seq: i+1
          }
        }))
      } else {
        setSearchList([{seq: 1 , setting : 1}])
      }
    }
  }, [isOpen])

  const executeValidation = () => {
    console.log(searchList)
    const hasInvalidData = searchList.some(row => !row.tool_id)
    const defaultSettingCount = searchList.filter(row => row.setting === 1).length

    if(hasInvalidData){
      throw("데이터를 입력해주세요.")
    }else if(defaultSettingCount === 0){
      throw("기본설정은 한 개 이상이어야 합니다.")
    }
  }

  const onConfirm = () => {
      if(selectRow !== undefined && selectRow !== null) {
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

  const onCloseEvent = () => {
    setIsOpen(false)
  }

  return (
    <NormalModal buttonTitle={'공구'} title={'공구 정보 (해당 제품을 만드는 데 필요한 공구를 등록해주세요)'} hasData={row.tools?.length > 0} isOpen={isOpen}
                 onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent} duplicateCheckKey={'code'}
                 onConfirm={onConfirm}
                 validateConfirm={executeValidation} headers={[
      [ { key: '거래처명', value: row.customerArray?.name ?? "-" }, { key: '모델', value: row.modelArray?.model ?? "-" }, ],
      [ { key: 'CODE', value: row.code ?? "-" }, { key: '품명', value: row.name ?? "-" }, {
        key: '품목 종류',
        value: row.type ? TransferCodeToValue(row.type, 'material') : "-"
      }, { key: '생산 공정', value: row.process?.name ?? "-" } ],
      [ { key: '단위', value: row.unit ?? "-" } ]
    ]} data={searchList} setData={setSearchList} dataIndex={selectRow} setDataIndex={setSelectRow}
                 dataColumnKey={'toolInfo'}/>

  )
}

export {ToolInfoModal}

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
import { RequestMethod } from '../../common/RequestFunctions'
import MultiSelectModal from './MultiSelectModal'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const initData = {seq: 1 , setting : 0, isFirst: true}

const MachineInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([initData])
  const hasSaved = !!row.product_id

  useEffect(() => {
    if(isOpen) {
      if(row.machines?.length){
        setSearchList(row.machines.map((v,i) => {
          return {
            ...v,
            ...v.machine,
            border:false,
            type_id:v.machine.type,
            type:selectMachineType(v.machine.type),
            seq: i+1,
            isFirst: i === 0
          }
        }))
      } else {
        setSearchList([initData])
      }
    }
  }, [isOpen])

  const selectMachineType = (value:number) => {
    let result = "";
    switch(value) {
      case 0 :
        result = "선택없음";
        break ;
      case 1 :
        result = "프레스";
          break ;
      case 2 :
        result = "로봇";
          break ;
      case 3 :
        result = "용접기";
          break ;
      case 4 :
        result = "밀링";
          break ;
      case 5 :
        result = "선반";
          break ;
      case 6 :
        result = "탭핑기";
        break ;
      default:
        result = value?.toString();
        break;
    }
    return result;
  }

  const executeValidation = () => {
    const hasInvalidData = searchList.some(row => !row.machine_id)
    if(searchList.length === 1 && hasInvalidData) return
    const defaultSettingCount = searchList.filter(row =>row.setting === 1).length

    if(hasInvalidData){
      throw("데이터를 입력해주세요.")
    }else if(defaultSettingCount !== 1){
      throw("기본설정은 한 개여야 합니다.")
    }
  }

  const getRequestBody = () =>
    searchList.map((machine)=> (
      {
        sequence : machine.sequence,
        setting : machine.setting,
        machine : {
          ...machine,
          type : machine.type_id,
          weldingType : machine.weldingType_id,
        }
      }
    )).filter((machine) => machine.machine.machine_id)

  const updateData = async () => {
    const requestBody = getRequestBody()
    return await RequestMethod('post', 'prdMachineSave', requestBody, null, null, null, row.product_id).then(() =>
      Notiflix.Report.success('저장되었습니다.','','확인', () =>
      {
        row.reload()
        // setIsOpen(false)
      }))
  }

  const onConfirm = () => {
    try{
      const hasNoData = row.machines?.length === 0 && searchList.length === 1 && !searchList[0]?.machine_id
      const isChanged = () => row?.machines?.length !== searchList.length ||
        row?.machines?.some((machine, mIdx) => machine?.machine?.machine_id !== searchList?.[mIdx]?.machine?.machine_id || machine?.setting !== searchList?.[mIdx]?.setting)
      if(hasSaved && !hasNoData && isChanged()) {
        return updateData()
      } else {
        if (!hasNoData && isChanged()) {
          onRowChange({
            ...row,
            machines: searchList.map((v, i) => {
              return {
                sequence: i+1,
                machine: v,
                setting : v.setting
              }
            }).filter((v)=> v.machine?.mfrCode),
            isChange: true
          })
        }
      }
    }catch(errMsg){
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const onCloseEvent = () => {
    setIsOpen(false)
  }

  const changeRow = (machine) => typeof machine.type !== "string" ? ({...machine, type_id:machine.type, type:selectMachineType(machine.type)}) : ({...machine})

  return (
    <MultiSelectModal buttonTitle={'기계'} title={'기계 정보 (제품 생산되는 데 사용되는 모든 기계를 입력해주세요)'} hasData={row.machines?.length > 0} isOpen={isOpen}
                 onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent}
                 onConfirm={onConfirm} disabled={row.readonly}
                 validateConfirm={executeValidation} headers={[
      [ { key: '거래처명', value: row.customerArray?.name ?? "-" }, { key: '모델', value: row.modelArray?.model ?? "-" }, ],
      [ { key: 'CODE', value: row.code ?? "-" }, { key: '품명', value: row.name ?? "-" }, {
        key: '품목 종류',
        value: row.type ? TransferCodeToValue(row.type, 'material') : "-"
      }, { key: '생산 공정', value: row.process?.name ?? "-" } ],
      [ { key: '단위', value: row.unit ?? "-" } ]
    ]} data={searchList} setData={setSearchList}
                 dataColumnKey={'machineInfo'} changeRow={changeRow}/>
  )
}

export {MachineInfoModal}

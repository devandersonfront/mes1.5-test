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
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
import { MDRegisterModalButtons } from '../Buttons/MDRegisterModalButtons'
import NormalModal from './NormalModal'
import { alertMsg } from '../../common/AlertMsg'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const deviceList = [
  {pk: 0, name: "선택없음"},
  {pk: 1, name: "미스피드 검출장치"},
  {pk: 2, name: "하사점 검출장치"},
  {pk: 3, name: "로드모니터"},
  {pk: 4, name: "앵글시퀀서"},
  {pk: 5, name: "엔코더"},
  {pk: 6, name: "통관센서"},
  {pk: 7, name: "유틸리티 센서"},
]

const DeviceInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1 , setting : 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      setSelectRow(undefined)
      if(row.devices !== undefined && row.devices !== null && row.devices.length > 0){
        setSearchList(row.devices.map((device, index)=>(
          {...device,
            seq:index+1,
            manager:device.manager?.name ?? "",
            manager_data:device.manager,
            type:deviceList[device.type]?.name ?? device.type}
        )))
      }
    }else{
      setSearchList([{seq: 1 , setting : 1}])
    }
  }, [isOpen, searchKeyword])

  const getManagerName = () => {
    if(row.manager){
      switch (typeof row.manager){
        case "string":
          return row.manager;
        case "object":
          return row.manager.name;
        default:
           return ""
      }
    }
  }

  const settingTypeId = (type:string | number) => {
    let result:number = 0;
    if(typeof type === "number"){
      return type
    }
    deviceList.map((value) => {
      if(type === value.name){
        result = value.pk;
      }
    })
    return result;
  }

  const validateConfirm = () => {
    const hasInvalidData = searchList.some(row => !row.device_id)

    if(hasInvalidData){
      throw(alertMsg.noData)
    }
  }

  const onConfirm = () => {
    if(selectRow !== undefined && selectRow !== null) {
      const newrow = {
        ...row,
        name: row.name,
        devices: searchList.map((device) => {
          return { ...device, border: false, manager: device.manager_data }
        }).filter(v => v.mfrCode !== undefined),
        isChange: true,
      }
      onRowChange(newrow)
    }
  }

  const onCloseEvent = () => {
    setIsOpen(false)
  }

  return (
    <NormalModal title={'주변장치 정보'} buttonTitle={'주변장치'}  hasData={row.devices.length > 0} isOpen={isOpen} onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent}
     validateConfirm={validateConfirm} duplicateCheckKey={'mfrCode'}
     onConfirm={onConfirm} headers={[
      [{key:'기계 제조사', value: row.mfrName}, {key:'기계 이름', value: row.name, width: 770},],
      [{key:'기계 종류', value: row.type},{key:'용접 종류', value: row.weldingType},{key:'제조 번호', value: row.mfrCode},{key:'담당자', value: getManagerName()},],
      [{key:'오버홀', value: row.interwork ? "유" : "무"},]
    ]} data={searchList} setData={setSearchList} dataIndex={selectRow} setDataIndex={setSelectRow} dataColumnKey={'deviceInfo'}
   changeRow={row => ({
      ...row,
      type_id : settingTypeId(row.type),
      type: Number(row.type) ? deviceList[row.type]?.name : row.type
    })} />
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

const Button = styled.button`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    
`;

const HeaderTable = styled.div`
  width: 1744px;
  height: 32px;
  margin: 0 16px;
  background-color: #F4F6FA;
  border: 0.5px solid #B3B3B3;
  display: flex
`

const HeaderTableTextInput = styled.div`
  background-color: #ffffff;
  padding-left: 3px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  margin-right: 70px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {DeviceInfoModal}

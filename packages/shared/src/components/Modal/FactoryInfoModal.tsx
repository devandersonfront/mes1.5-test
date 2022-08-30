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
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import { MDRegisterModalButtons } from '../Buttons/MDRegisterModalButtons'
import NormalModal from './NormalModal'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const FactoryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>(undefined)
  const [searchList, setSearchList] = useState<any[]>([{seq: 1 , setting : 1}])
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      if(!row.factory_id){
        Notiflix.Report.warning("경고","공장을 먼저 등록해주시기 바랍니다.","확인", () => onCloseEvent());
      }else {
        setSelectRow(undefined)
        getData()
      }
    }
  }, [isOpen])


  const changeRow = (row: any, i : number) => {
    let random_id = Math.random()*1000;
    return{
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager,
      manager_name: row.manager?.name,
      appointment: row.manager?.appointment,
      telephone:row.manager?.telephone,
      id: `subFactory_${random_id}`,
      seq : i + 1,
    }
  }

  const getData = async (page: number = 1) => {
    Notiflix.Loading.circle()

    const res = await RequestMethod('get', `subFactoryList`,{
      path: {
        factory_id: row.factory_id,
        page: page,
        renderItem: 18,
      },
      params: {
        sorts:"seq"
      }
    })

    if (res.totalPages > 0 && res.totalPages < res.page) {
      getData(1);
    } else {
      setPageInfo({
        page: res.page,
        total: res.totalPages
      })
      if(res.info_list?.length > 0){
        const searchList = res.info_list.map((row: any, index: number) => changeRow(row, index))
        setSearchList(searchList)
      }
    }
    Notiflix.Loading.remove()
  }

  const saveSubFactory = async () => {
    const postBody = searchList.map((list)=>{
      if(!list.name){
        throw("세분화명을 입력해주세요.")
      }else{
        return {...list , factory_id : row.factory_id, manager: list.manager?.user_id ? list.manager : list.user?.user_id ? list.user : null}
      }})
    Notiflix.Loading.circle();
    const res = await RequestMethod("post", "subFactorySave", postBody)
    if(res){
      Notiflix.Report.success("확인","저장되었습니다.","확인",() => {
        onCloseEvent()
        row.reload()
      })
    }
    Notiflix.Loading.remove();
  }

  const deleteSubFactory = async () => {
    if(selectRow === undefined){
      return Notiflix.Report.warning('오류', '선택된 정보가 없습니다.', '확인')
    }
    if(searchList[selectRow]?.sf_id){
      Notiflix.Confirm.show(
        '행 삭제',
        '행을 삭제 하시겠습니까?',
        'Yes',
        'No',
        async () => {

          await RequestMethod("delete", "subFactoryDelete",[searchList[selectRow]])
          .then((res)=>{
            Notiflix.Report.success("확인", "삭제되었습니다.", "확인" ,() =>getData(1))
          })
        },
      );
    } else {
      let tmpRow = [...searchList]
      tmpRow.splice(selectRow, 1)
      setSearchList(tmpRow.map((v, i) => {
        return {
          ...v,
          seq: i+1
        }
      }))
      setSelectRow(undefined)
    }
  }

  const changeData = (key:string) => {
    return !!row[key] ? row[key] : "-"
  }

  const onCloseEvent = () => {
    setIsOpen(false)
  }

  return (
    <NormalModal buttonTitle={'세분화'} title={'공장 정보'} hasData={row.subFactories?.length > 0} isOpen={isOpen} onModalButtonClick={() => setIsOpen(true)} onClose={onCloseEvent} duplicateCheckKey={'name'} onConfirm={saveSubFactory}
           onDelete={deleteSubFactory} headers={[
      [{key:'공장명', value: changeData("name")}, {key:'공장 주소', value: changeData("address"), width: 786},],
      [{key:'담당자', value: changeData("manager")},{key:'직책', value: changeData('appointment')},{key:'전화번호', value: changeData("telephone"), width: 480}],
      [{key:'비고', value: changeData("description"), width: 1090}]
    ]} data={searchList} setData={setSearchList} dataIndex={selectRow} setDataIndex={setSelectRow} dataColumnKey={'factoryInfo'}
                 changeRow={row => ({
                                    ...row,
                                    noneSelected:false
                             })}/>
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
  height:100%;
  justify-content:center;
  align-items:center;
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
  margin-right: 62px;
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

export {FactoryInfoModal}

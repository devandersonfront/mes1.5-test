import React, {ChangeEvent, useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
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
import {PaginationComponent}from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {LineBorderContainer} from '../Formatter/LineBorderContainer'
import {TextEditor} from '../InputBox/ExcelBasicInputBox'
import {RegisterInput} from '../InputBox/RegisterInput'
import {Input} from '@material-ui/core'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

interface IRequestData {
  code: string
  mold_name: string
  cavity: string
  spm: string
  dieHeight: string
  limit: string
  check: string
  current: string
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const MoldRegisterModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('금형')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([
    {code: 'SU-M-3', name:'OP10', cavity:'1', spm: '24', dieHeight: '10', limit: '0', check: '0', current: '0'}
  ])
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [requestData, setRequestData] = useState<IRequestData>({
    code: '', cavity: '', check: '', current: '', dieHeight: '', limit: '', mold_name: '', spm: ''
  })

  const changeRequestData = (changeType: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setRequestData({
      ...requestData,
      [changeType]: event.target.value
    })
  }

  const changeRow = (row: any, key?: string) => {
    console.log('factory row', row)
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager ? row.manager.name : null,
      factory: row.name,
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `machineSearch`,{
      path: {
        page: page,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      let searchList = res.results.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({
        ...pageInfo,
        page: res.results.page,
        total: res.results.totalPages,
      })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () => {
    return <>
     <Button onClick={() => setIsOpen(true)}>
       <p>신규 금형 등록</p>
     </Button>
    </>
  }

  return (
    <SearchModalWrapper >
      { ModalContents() }
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5
        }
      }}>
        <div style={{
          width: 1376,
          height: 736,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{height: 600}}>
            <div style={{
              marginTop: 24,
              marginLeft: 16,
              marginRight: 16,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <p style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                margin: 0,
              }}>신규 금형 등록</p>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
            <div style={{
              width: 1344, height: 200, margin: '16px 0 16px 16px',
            }}>
              <TableBackground>
                <TableItems style={{width: 160}}><p style={{fontWeight: 'bold'}}>항목</p></TableItems>
                <TableItems style={{width: 1152}}><p style={{fontWeight: 'bold'}}>입력 내용</p></TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>CODE</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['code']} onChange={changeRequestData('code')} placeholder={'CODE 입력'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>금형명</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['mold_name']} onChange={changeRequestData('mold_name')} placeholder={'금형명 입력'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>캐비티</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['cavity']} onChange={changeRequestData('cavity')} placeholder={'0'} unit={'EA'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>SPM</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['spm']} onChange={changeRequestData('spm')} placeholder={'0'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>슬라이드 위치</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['dieHeight']} onChange={changeRequestData('dieHeight')} placeholder={'0'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>최대 타수</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['limit']} onChange={changeRequestData('limit')} placeholder={'타수 입력'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>점검 타수</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['check']} onChange={changeRequestData('check')} placeholder={'타수 입력'}/>
                </TableItems>
              </TableBackground>
              <TableBackground>
                <TableItems style={{width: 160}}><p>현재 타수</p></TableItems>
                <TableItems style={{width: 1152}}>
                  <RegisterInput value={requestData['current']} onChange={changeRequestData('current')} placeholder={'타수 입력'}/>
                </TableItems>
              </TableBackground>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: '50%', height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                if(selectRow !== undefined && selectRow !== null){
                  onRowChange({
                    ...row,
                    ...searchList[selectRow],
                    name: row.name,
                    isChange: true
                  })
                }
                setIsOpen(false)
              }}
              style={{width: '50%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>등록하기</p>
            </div>
          </div>
        </div>
      </Modal>
    </SearchModalWrapper>
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
`

const TableBackground = styled.div`
  width: calc(100% - 32px);
  height: 32px;
  background-color: #F4F6FA;
  border: 0.5px solid #B3B3B3;
  display: flex;
`

const TableItems = styled.div`
  height: 32px;
  display: flex;
  margin: 0 8px;
  justify-content: left;
  align-items: center;
  p {
    padding: 0;
    margin: 0;
    font-size: 15px;
  }
`

export {MoldRegisterModal}

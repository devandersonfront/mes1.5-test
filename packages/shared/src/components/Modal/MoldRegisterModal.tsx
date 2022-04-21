import React, {ChangeEvent, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import {RegisterInput} from '../InputBox/RegisterInput'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  register: () => void
}

interface IRequestData {
  code: string
  name: string
  cavity: string
  spm: string
  slideHeight: string
  limit: string
  inspect: string
  current: string
}

const MoldRegisterModal = ({column, row, onRowChange, register}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [requestData, setRequestData] = useState<IRequestData>({
    code: '', cavity: '', inspect: '', current: '', slideHeight: '', limit: '', name: '', spm: ''
  })

  const changeRequestData = (changeType: string) => (event: ChangeEvent<HTMLInputElement>) => {
    setRequestData({
      ...requestData,
      [changeType]: event.target.value
    })
  }

  const SaveBasic = async () => {
    let body = [{
      ...requestData,
      period: 0,
      additional:[],
    }]

    const res = await RequestMethod('post', `moldSave`,body)

    if(res) {
      Notiflix.Report.success('저장되었습니다.','','확인', ()=> {
          register()
          setRequestData({
            code: '', cavity: '', inspect: '', current: '', slideHeight: '', limit: '', name: '', spm: ''
          })
          setIsOpen(false)
      });
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
                  <RegisterInput value={requestData['name']} onChange={changeRequestData('name')} placeholder={'금형명 입력'}/>
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
                  <RegisterInput value={requestData['slideHeight']} onChange={changeRequestData('slideHeight')} placeholder={'0'}/>
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
                  <RegisterInput value={requestData['inspect']} onChange={changeRequestData('inspect')} placeholder={'타수 입력'}/>
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
              onClick={SaveBasic}
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

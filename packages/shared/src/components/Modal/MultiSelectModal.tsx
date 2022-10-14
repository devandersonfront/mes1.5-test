import React from 'react'
import Modal from 'react-modal'
import Styled from 'styled-components'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import { MDRegisterModalButtons } from '../Buttons/MDRegisterModalButtons'
import { ExcelTable } from '../Excel/ExcelTable'
import { searchModalList } from '../../common/modalInit'
import { POINT_COLOR } from '../../common/configset'
import styled from 'styled-components'
import { UploadButton } from '../../styles/styledComponents'
import Notiflix from 'notiflix'
import { decideKoreanSuffix } from '../../common/Util'
import { alertMsg } from '../../common/AlertMsg'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';

type headerItem = {
  key: string,
  value: string,
  width?: number
}

interface Props {
  title:string
  buttonTitle?: string
  hasData: boolean
  isOpen: boolean
  onModalButtonClick: () => void
  onClose: () => void
  onConfirm: () => void
  headers: headerItem[][]
  data: any
  setData: (e: any) => void
  dataColumnKey: string
  addLimit?: number
  indexKey?: string
  changeRow?: (e: any) => any
  validateConfirm?: () => void
  disabled?: boolean
}




const MultiSelectModal: React.FunctionComponent<Props> = ({
                                                      children,
                                                      title,
                                                      buttonTitle,
                                                      hasData,
                                                      isOpen,
                                                      onModalButtonClick,
                                                      onClose,
                                                      onConfirm,
                                                      headers,
                                                      data,
                                                      setData,
                                                      dataColumnKey,
                                                      addLimit = 10,
                                                      indexKey = 'seq',
                                                      changeRow,
                                                      validateConfirm,
                                                      disabled
                                                    }) => {

  const ModalButton = () =>
      (
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%'
        }}>
          <UploadButton style={hasData ? {width: '100%', backgroundColor: '#ffffff00'} : { opacity: disabled ? .3 : 1}} onClick={() => disabled ? undefined : onModalButtonClick()}>
            <p style={hasData ? {color: 'white', textDecoration: 'underline'} : undefined}>{buttonTitle} {hasData ? '보기' : '등록'}</p>
          </UploadButton>
        </div>
      )

  const Headers = () => (
    headers.map((header, headerIdx) =>
      <HeaderTable key={headerIdx}>
        {
          header.map((headerItem, headerItemIdx) =>
            <>
              <HeaderTableTitle key={'title' + headerIdx + headerItemIdx}>
                <HeaderTableText key={'titleText' + headerIdx + headerItemIdx} style={{fontWeight: 'bold'}}>{headerItem.key}</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput key={'input' + headerIdx + headerItemIdx} style={{width: headerItem.width ?? 144}}>
                <Tooltip key={'tooltip' + headerIdx + headerItemIdx} placement={'rightTop'}
                         overlay={
                           <div key={'overlay' + headerIdx + headerItemIdx} style={{fontWeight : 'bold'}}>
                             {headerItem.value ?? '-'}
                           </div>
                         } arrowContent={<div key={'arrow' + headerIdx + headerItemIdx} className="rc-tooltip-arrow-inner"></div>}>
                  <HeaderTableText key={'inputText' + headerIdx + headerItemIdx}>{headerItem.value ?? '-'}</HeaderTableText>
                </Tooltip>
              </HeaderTableTextInput>
            </>
          )
        }
      </HeaderTable>
    )
  )

  return <ModalWrapper >
    { ModalButton() }
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
        width: 1776,
        height: 795,
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
      }}>
        <div>
          <div style={{
            margin: '24px 16px 16px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <p style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              margin: 0,
            }}>{title}</p>
            <div style={{display: 'flex'}}>
              {/*<Button>*/}
              {/*  <p>엑셀로 받기</p>*/}
              {/*</Button>*/}
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onClose}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
            {
              Headers()
            }
            <div style={{padding: '0 16px', width: 1776, display:"flex", justifyContent:"left", marginTop: 20}}>
              <ExcelTable
                headerList={searchModalList[dataColumnKey](data, setData)}
                row={data ?? [{}]}
                setRow={(e, index) => {
                  let newSearchList = changeRow ? e.map((row) => changeRow(row)) : e
                  try{
                    setData(newSearchList)
                  } catch(errMsg){
                    Notiflix.Report.warning('경고',errMsg, '확인')
                  }
                }}
                width={searchModalList[dataColumnKey]()?.map(column => column.width).reduce((prevValue, currentValue) => prevValue + currentValue) + 8}
                rowHeight={32}
                height={552}
                onRowClick={clicked => {
                  const rowIdx = data.indexOf(clicked)
                  if(!data[rowIdx]?.border){
                    const newSearchList = data.map((v,i)=> ({
                      ...v,
                      border : i === rowIdx
                    }))
                    setData(newSearchList)
                  }
                }}
                type={'searchModal'}
                headerAlign={'center'}
              />
            </div>
          </div>
          <div style={{height: 40, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={onClose}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={async () => {
                try{
                  validateConfirm && validateConfirm()
                  await onConfirm()
                  onClose()
                } catch(errMsg){
                  Notiflix.Report.warning('경고', errMsg, '확인')
                }
              }}
              style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>등록하기</p>
            </div>
          </div>
        </div>
    </Modal>
  </ModalWrapper>


}

export default MultiSelectModal

const ModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
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

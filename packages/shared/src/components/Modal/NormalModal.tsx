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
  onDelete?: () => void
  headers: headerItem[][]
  data: any
  setData: (e: any) => void
  dataIndex: number
  setDataIndex: (e: number) => void
  dataColumnKey: string
  addLimit?: number
  indexKey?: string
  changeRow?: (e: any) => any
  validateConfirm?: () => void
  duplicateCheckKey: string
}




const NormalModal: React.FunctionComponent<Props> = ({
                                                      children,
                                                      title,
                                                      buttonTitle,
                                                      hasData,
                                                      isOpen,
                                                      onModalButtonClick,
                                                      onClose,
                                                      onConfirm,
                                                      onDelete,
                                                      headers,
                                                      data,
                                                      setData,
                                                      dataIndex,
                                                      setDataIndex,
                                                      dataColumnKey,
                                                      addLimit = 10,
                                                      indexKey = 'seq',
                                                      changeRow,
                                                      validateConfirm,
                                                       duplicateCheckKey
                                                    }) => {

  const ModalButton = () =>
      (
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%'
        }}>
          <UploadButton style={hasData ? {width: '100%', backgroundColor: '#ffffff00'} : undefined} onClick={onModalButtonClick}>
            <p style={hasData ? {color: 'white', textDecoration: 'underline'} : undefined}>{buttonTitle} {hasData ? '보기' : '등록'}</p>
          </UploadButton>
        </div>
      )

  const Headers = () => (
    headers.map(header =>
      <HeaderTable>
        {
          header.map(headerItem =>
            <>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>{headerItem.key}</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: headerItem.width ?? 144}}>
                <Tooltip placement={'rightTop'}
                         overlay={
                  <div style={{fontWeight : 'bold'}}>
                    {headerItem.value ?? '-'}
                  </div>
                } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                  <HeaderTableText>{headerItem.value ?? '-'}</HeaderTableText>
                </Tooltip>
              </HeaderTableTextInput>
            </>
          )
        }
      </HeaderTable>
    )
  )

  const getButtons = () => (
      <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
      <Button onClick={() => {
        if(data?.length === addLimit) {
          Notiflix.Report.warning('경고', `최대 ${addLimit}까지 등록할 수 있습니다.`, '확인')
          return
        } else {
          setData(prev =>[
            ...prev,
            {
              setting: 0,
              [indexKey]: prev.length+1,
            }
          ])
        }
      }}>
        <p>행 추가</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(dataIndex === undefined || dataIndex === 0){
          return;
        }else{
          let tmpRow = data.slice()
          let tmp = tmpRow[dataIndex]
          tmpRow[dataIndex] = {...tmpRow[dataIndex - 1], [indexKey]: tmpRow[dataIndex - 1][indexKey] + 1, isChange: true}
          tmpRow[dataIndex - 1] = {...tmp, [indexKey]: tmp[indexKey] - 1, isChange: true}
          setData(tmpRow)
          setDataIndex(dataIndex-1)
        }
      }}>
        <p>위로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(dataIndex === data.length-1 || dataIndex === undefined){
          return
        } else {
          let tmpRow = data.slice()
          let tmp = tmpRow[dataIndex]
          tmpRow[dataIndex] = {...tmpRow[dataIndex + 1], [indexKey]: tmpRow[dataIndex + 1][indexKey] - 1, isChange: true}
          tmpRow[dataIndex + 1] = {...tmp, [indexKey]: tmp[indexKey] + 1, isChange: true}
          setData(tmpRow)
          setDataIndex(dataIndex + 1)
        }
      }}>
        <p>아래로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() =>
      {
        if(onDelete){
          onDelete()
        } else {
          if(dataIndex === undefined){
            return Notiflix.Report.warning(
              '경고',
              alertMsg.noSelectedData,
              '확인',
            );
          } else {
            let tmpRow = [...data]
            tmpRow.splice(dataIndex, 1)
            const filterRow = tmpRow.map((v , i)=>{
              return {...v , [indexKey] : i + 1, isChange:true}
            })
            setData(filterRow)
            setDataIndex(undefined)
          }
        }
      }}>
        <p>삭제</p>
      </Button>
    </div>
  )

  const checkDuplicate = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(dataIndex, 1)

    const isCheck = spliceRow.some((row)=> row[duplicateCheckKey] === tempRow[dataIndex]?.[duplicateCheckKey] && row[duplicateCheckKey] !==undefined && row[duplicateCheckKey] !=='')

    if(spliceRow){
      if(isCheck){
        throw(`중복된 ${decideKoreanSuffix(buttonTitle, '이','가')} 존재합니다.`)
      }
    }
  }

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
        height: 819,
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
          {
            getButtons()
          }
          <div style={{padding: '0 16px', width: 1776, display:"flex", justifyContent:"left"}}>
            <ExcelTable
              headerList={searchModalList[dataColumnKey]}
              row={data ?? [{}]}
              setRow={(e, index) => {
                let newSearchList = changeRow ? e.map((row) => changeRow(row)) : e
                try{
                  checkDuplicate(newSearchList)
                  setData(newSearchList)
                } catch(errMsg){
                  Notiflix.Report.warning('경고',errMsg, '확인')
                }
              }}
              width={1760}
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
                  setDataIndex(rowIdx)
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

export default NormalModal

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

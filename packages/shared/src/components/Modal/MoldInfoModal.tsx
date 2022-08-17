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

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify: boolean
}

const MoldInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{sequence: 1 , setting : 1}])

  useEffect(() => {
    if(isOpen) {
      setSelectRow(undefined)
      if(row?.molds && row?.molds.length > 0){
        setSearchList(row.molds.map((v,i) => {
          return {
            ...v,
            ...v.mold,
            border:false,
            sequence: i+1
          }
        }))
      }
    }
  }, [isOpen])

  const executeValidation = () => {
    const hasInvalidData = searchList.some(row => !row.mold_id)
    const defaultSettingCount = searchList.filter(row => row.setting === 1).length

    if(hasInvalidData){
      throw("데이터를 입력해주세요.")
    }else if(defaultSettingCount !== 1){
      throw("기본설정은 한 개여야 합니다.")
    }
  }

  const competeMold = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)

    const isCheck = spliceRow.some((row)=> row.code === tempRow[selectRow]?.code && row.code !==undefined && row.code !=='')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
            '경고',
            `중복된 금형이 존재합니다.`,
            '확인'
        );
      }
    }
    setSearchList(rows)
  }

  const onConfirm = () => {
    try {
      executeValidation()
      if (selectRow !== undefined && selectRow !== null) {

        if (column.name === '금형') {
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
        } else {

          onRowChange({
            ...row,
            molds: searchList.map((v, i) => {
              return {
                sequence: i + 1,
                mold: { mold: { ...v } }
              }
            }),
            name: row.name,
            isChange: true
          })
        }
        setIsOpen(false)
      }
    }catch(errMsg){
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }

  const ModalContents = () => (
            <UploadButton onClick={() => {
              setIsOpen(true)
            }} hoverColor={POINT_COLOR} haveId={!!row.molds?.length}>
              <p>{!!row.molds?.length ? "금형 수정" : "금형 등록"}</p>
            </UploadButton>
      )

  const getButtons = () => {
    return <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
      <Button onClick={() => {
        setSearchList(prev =>[
          ...prev,
          {
            setting: 1,
            sequence: prev.length+1
          }
        ])
      }}>
        <p>행 추가</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === undefined || selectRow === 0){
          return;
        }else{
          let tmpRow = searchList.slice()
          let tmp = tmpRow[selectRow]
          tmpRow[selectRow] = {...tmpRow[selectRow - 1], sequence: tmpRow[selectRow - 1].sequence + 1, isChange: true}
          tmpRow[selectRow - 1] = {...tmp, sequence: tmp.sequence - 1, isChange: true}
          setSearchList(tmpRow)
          setSelectRow(selectRow-1)
        }
      }}>
        <p>위로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === searchList.length-1 || selectRow === undefined){
          return
        } else {
          let tmpRow = searchList.slice()
          let tmp = tmpRow[selectRow]
          tmpRow[selectRow] = {...tmpRow[selectRow + 1], sequence: tmpRow[selectRow + 1].sequence - 1, isChange: true}
          tmpRow[selectRow + 1] = {...tmp, sequence: tmp.sequence + 1, isChange: true}
          setSearchList(tmpRow)
          setSelectRow(selectRow + 1)
        }
      }}>
        <p>아래로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === undefined){
          return Notiflix.Report.warning(
            '경고',
            '선택된 정보가 없습니다.',
            '확인',
          );
        } else {
          let tmpRow = [...searchList]
          tmpRow.splice(selectRow, 1)
          const filterRow = tmpRow.map((v , i)=>{
            return {...v , sequence : i + 1, isChange:true}
          })
          setSearchList(filterRow)
          setSelectRow(undefined)
        }

      }}>
        <p>삭제</p>
      </Button>
    </div>
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
            width: 1776,
            height: 800
          }}>
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
              }}>금형 정보 (해당 제품을 만드는데 필요한 금형을 등록해주세요)</p>
              <div style={{display: 'flex'}}>
                {/*<Button>*/}
                {/*  <p>엑셀로 받기</p>*/}
                {/*</Button>*/}
                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                  setIsOpen(false)
                }}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            <HeaderTable>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>거래처명</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.customerArray ? row.customerArray.name : "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.modelArray ? row.modelArray.model : "-"}</HeaderTableText>
              </HeaderTableTextInput>
            </HeaderTable>
            <HeaderTable>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.code ?? "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.name ?? "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.type ? TransferCodeToValue(row.type, 'material') : "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>생산 공정</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.process ? row.process.name : "-"}</HeaderTableText>
              </HeaderTableTextInput>
            </HeaderTable>
            <HeaderTable>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{row.unit ?? "-"}</HeaderTableText>
              </HeaderTableTextInput>
            </HeaderTable>
            {
              getButtons()
            }
            <div style={{padding: '0 16px', width: 1776, display:"flex", justifyContent:"left"}}>
              <ExcelTable
                  headerList={searchModalList.moldInfo}
                  row={searchList ?? [{}]}
                  setRow={(e) => {
                    competeMold([...e])}}
                  width={searchModalList.moldInfo.map(mold => mold.width).reduce((prevValue, currentValue) => prevValue + currentValue)}
                  rowHeight={32}
                  height={552}
                  onRowClick={(clicked) => {
                    const e = searchList.indexOf(clicked)
                    if(!searchList[e].border){
                      const newSearchList = searchList.map((row,rowIdx) => ({
                        ...row,
                        border: rowIdx === e
                      }))
                      setSearchList(newSearchList)
                      setSelectRow(e)
                    }
                  }}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                <p>취소</p>
              </div>
              <div onClick={() => {
                onConfirm()
              }}
                  style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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
  width: 100%;
  height:100%;
  display: flex;
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
const Underline = styled.div`
  color:white;
  text-decoration:underline;
  display:flex;
  justify-content:center;
  align-items:center;
  width:112px;
  height:32px;
`;

export {MoldInfoModal}

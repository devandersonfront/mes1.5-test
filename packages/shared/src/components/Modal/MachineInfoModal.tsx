import React, {useEffect, useState} from 'react'
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
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'
import Notiflix from 'notiflix'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']
const MachineInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1 , setting : 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })



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

  const haveBasicValidation = () => {

    if(searchList.length > 0){
        return searchList.some((list)=>list.setting === 1)
    }

    return true;
  }

  const haveDataValidation = () => {

    let dataCheck = true

    searchList.map((v,i)=>{
        if(!v.machine_id){
            dataCheck = false
        }
    })

    return dataCheck
  }

  const executeValidation = () => {

    let isValidation = false
    // const haveList = searchList.length === 0
    const haveData = haveDataValidation()
    const haveBasic = haveBasicValidation()

    if(!haveData){
        isValidation = true
        Notiflix.Report.warning("경고","데이터를 입력해주세요.","확인",)
    }else if(!haveBasic){
        isValidation = true
        Notiflix.Report.warning("경고","기본설정은 최소 한개 이상 필요합니다.","확인",)
    }

    return isValidation

  }

  useEffect(() => {
    if(isOpen) {
      if(row?.machines && row?.machines.length > 0){

        setSearchList(row.machines.map((v,i) => {
          return {
            ...v,
            ...v.machine,
            type_id:v.machine.type,
            type:selectMachineType(v.machine.type),
            seq: i+1
          }
        }))
      }
    }
  }, [isOpen, searchKeyword])

  const ModalContents = () => (

    <UploadButton onClick={() => {
      setIsOpen(true)
    }} hoverColor={POINT_COLOR} haveId={row?.machines?.length > 0} status={column.modalType ? "modal" : "table"} >
      <p>{row?.machines?.length > 0 ? "기계 수정" : "기계 등록"}</p>
    </UploadButton>
  )

    const competeMachine = (rows) => {

      const tempRow = [...rows]
      const spliceRow = [...rows]
      spliceRow.splice(selectRow, 1)

      const isCheck = spliceRow.some((row)=> row.mfrCode === tempRow[selectRow]?.mfrCode && row.mfrCode !== undefined && row.mfrCode !=='')

      if(spliceRow){
        if(isCheck){
          return Notiflix.Report.warning(
            '경고',
            `중복된 기계가 존재합니다.`,
            '확인'
          );
        }
      }

      setSearchList(rows)
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
            }}>기계 정보 (제품 생산되는 데 사용되는 모든 기계를 입력해주세요)</p>
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
              <HeaderTableText>{row.customerArray ? row.customerArray.name : '-'}</HeaderTableText>
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
          <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
            <Button onClick={() => {
              let tmp = searchList

              setSearchList([
                ...searchList,
                {
                  setting:1,
                  seq: searchList.length+1
                }
              ])
            }}>
              <p>행 추가</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              if(selectRow === 0 || selectRow === undefined){
                return
              }
              let tmpRow = [...searchList]

              let tmp = tmpRow[selectRow]
              tmpRow[selectRow] = tmpRow[selectRow - 1]
              tmpRow[selectRow - 1] = tmp

              // setSearchList([...tmpRow.map((v, i) => {
              //   if(!searchList[selectRow-1].border){
              //     searchList.map((v,i)=>{
              //       v.border = false;
              //     })
              //     searchList[selectRow-1].border = true
              //     setSearchList([...searchList])
              //   }
              //   setSelectRow(selectRow -1)
              //   return {
              //     ...v,
              //     seq: i+1
              //   }
              // })])
              setSelectRow((prevSelectRow)=> prevSelectRow - 1)
              setSearchList([...tmpRow.map((v, i) => {
                return {
                  ...v,
                  seq: i+1
                }
              })])

            }}>
              <p>위로</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              if(selectRow === searchList.length-1 || selectRow === undefined){
                return
              }
              let tmpRow = [...searchList]
              let tmp = tmpRow[selectRow]
              tmpRow[selectRow] = tmpRow[selectRow + 1]
              tmpRow[selectRow + 1] = tmp

              // setSearchList([...tmpRow.map((v, i) => {
              //   if(!searchList[selectRow+1].border){
              //     searchList.map((v,i)=>{
              //       v.border = false;
              //     })
              //     searchList[selectRow+1].border = true
              //     setSearchList([...searchList])
              //   }
              //   setSelectRow(selectRow +1)
              //   return {
              //     ...v,
              //     seq: i+1
              //   }
              // })])
              setSelectRow((prevSelectRow)=> prevSelectRow + 1)
              setSearchList([...tmpRow.map((v, i) => {
                return {
                  ...v,
                  seq: i+1
                }
              })])
            }}>
              <p>아래로</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {

              if(selectRow === -1){
                return Notiflix.Report.warning('오류', '삭제를 하기위해서는 선택을 해주세요', '확인')
              }
                let tmpRow = [...searchList]
                tmpRow.splice(selectRow, 1)
                setSearchList([...tmpRow.map((v, i) => {
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
                setSelectRow(-1)
            }}>
              <p>삭제</p>
            </Button>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.machineInfo}
              row={searchList }
              setRow={(e) => {
                const filterList = [...e.map((machine) => {
                  if(typeof machine.type !== "string"){
                    return {...machine, type_id:machine.type, type:selectMachineType(machine.type)}
                  }else{
                    return {...machine}

                  }
                })]

                competeMachine(filterList)
              }}
              width={1746}
              rowHeight={32}
              height={552}
              // setSelectRow={(e) => {
              //   setSelectRow(e)
              // }}
              setSelectRow={(e) => {
                if(!searchList[e].border){
                  searchList.map((v,i)=>{
                    v.border = false;
                  })
                  searchList[e].border = true
                  setSearchList([...searchList])
                }
                setSelectRow(e)
              }}
              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {

                const isValidation = executeValidation()
                if(!isValidation){

                  if(selectRow !== undefined && selectRow !== null){
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
                  setIsOpen(false)
                }}
              }
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
  height: 100%;
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

const Underline = styled.div`
  color:white;
  text-decoration:underline;
  display:flex;
  justify-content:center;
  align-items:center;
  width:112px;
  height:32px;
`;

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

export {MachineInfoModal}

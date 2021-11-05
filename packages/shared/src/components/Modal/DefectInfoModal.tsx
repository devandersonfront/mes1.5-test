import React, {useEffect, useRef, useState} from 'react'
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
import {UploadButton} from '../../styles/styledComponents'
import moment from 'moment'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']



const DefectInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const tabRef = useRef(null)

  const [bomDummy, setBomDummy] = useState<any[]>([
    {code: 'SU-20210701-1', name: 'SU900-1', material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},
  ])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([
    {reason: '재질',},
    {reason: '누락',},
    {reason: '이종',},
    {reason: '기타',},
  ])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [focusIndex, setFocusIndex] = useState<number>(0)

  useEffect(() => {
    if(isOpen) {
      // SearchBasic(searchKeyword, optionIndex, 1).then(() => {
      //   Notiflix.Loading.remove()
      // })
    }
  }, [isOpen, searchKeyword])
  // useEffect(() => {
  //   if(pageInfo.total > 1){
  //     SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager ? row.manager.name : null
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

  const addNewTab = (index: number) => {
    let tmp = bomDummy
    tmp.push({code: 'SU-20210701-'+index, name: 'SU900-'+index, material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},)
    setBomDummy([...tmp])
  }

  const deleteTab = (index: number) => {
    if(bomDummy.length - 1 === focusIndex){
      console.log('last')
      setFocusIndex(focusIndex-1)
    }
    if(bomDummy.length === 1) {
      return setIsOpen(false)
    }

    let tmp = bomDummy
    tmp.splice(index, 1)
    setBomDummy([...tmp])
  }

  const AddComma = (number:number) => {
    let regexp = /\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g;
    return number.toString().replace(regexp, ",");
  }

  const totalDefect = () => {
    let total = 0
    searchList.map(v => {
      if(v.amount){
        total += Number(v.amount)
      }
    })

    return AddComma(total)
  }

  const ModalContents = () => {
    return <>
      <div style={{
        width: '100%'
      }}>
        <div style={{
          fontSize: '15px',
          margin: 0,
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: column.type === 'Modal' && '#0D0D0D',
          background:row.border ? "#19B9DF80" : column.type === 'Modal' ? "white" : '#0000',
        }} onClick={() => {
          setIsOpen(true)
        }}>
          <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>3</p>
        </div>
      </div>
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
            }}>불량 유형별 수량 (20210517-001)</p>
            <div style={{display: 'flex', alignItems: 'center', justifyContent:'center', height: 28}}>
              <div style={{display: 'flex'}}>
                <p style={{margin: 0, padding: 0, fontSize: 22, fontWeight: 'bold'}}>총 불량 개수</p>
                <div style={{
                  backgroundColor: 'white', width: 144, height: 28, border: '1px solid #B3B3B3', marginLeft: 16, marginRight: 32,
                  display: 'flex', alignItems: 'center', paddingTop:3, paddingLeft: 8
                }}>
                  <p style={{margin:0, padding: 0}}>{totalDefect()}</p>
                </div>
              </div>
              <Button>
                <p>엑셀로 받기</p>
              </Button>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={ searchModalList.defectCount }
              row={searchList ?? []}
              setRow={(e) => {
                let addIndex = 0
                let ppr_id = ''
                let reason = ''
                let tmpRow = e.map((v, i) => {
                  if(v.add) {
                    addIndex = i+1
                    reason = v.reason
                    ppr_id = v.ppr_id
                  }
                  return {
                    ...v,
                    add: false
                  }
                })
                if(addIndex){
                  tmpRow.splice(addIndex, 0, {
                    ppr_id,
                    reason,
                    start: `${moment().format('YYYY-MM-DD HH:mm')}:00`,
                    end: null,
                  })
                }


                setSearchList([...tmpRow])
              }}
              width={1746}
              rowHeight={32}
              height={718}
              setSelectRow={(e) => {
                setSelectRow(e)
              }}
              type={'searchModal'}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            {
              column.type !== 'readonly' && <div
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  style={{width: "50%", height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                  <p>취소</p>
              </div>
            }
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
              style={{width: column.type !== 'readonly' ? "50%" : "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>{column.type !== 'readonly' ? "등록하기" : "확인"}</p>
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

`;

const TabBox = styled.button`
  max-width: 214.5px;
  min-width: 40px;
  height: 32px;
  background-color: #19B9DF;
  opacity: 0.5;
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 4px;
  cursor: pointer;
  flex: 1;
  p {
    font-size: 15px;
    width: 168px;
    text-overflow: ellipsis;
    color: white;
    padding-left: 8px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {DefectInfoModal}

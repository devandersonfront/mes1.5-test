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
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['고객사명','대표자명','담당자명', '', '', '주소', '사업자 번호']

const ProcessSeqModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('작업 지시서')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])

  useEffect(() => {
    if(isOpen && row.pp_id) SearchBasic(keyword, 0).then(() => {
      Notiflix.Loading.remove()
    })
  }, [isOpen])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      process_id: row.process.name,
      process_idPK: row.process.process_id,
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `productprocessList`,{
      path: {
        pp_id: row.pp_id
      }
    })

    let searchList = res.results.processes.map((row: any, index: number) => {
      return changeRow(row)
    })

    if(res && res.status === 200){
      setSearchList([...searchList])
    }
  }

  const ModalContents = () => {
    if(column.searchType === 'operation' && row.index !== 1){
      return <></>
    }

    if(column.disableType === 'record' && row.osd_id){
      return <div style={{width: '100%', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <p>{row[`${column.key}`]}</p>
      </div>
    }

    return <>
      <div style={{width: 'calc(100% - 40px)', height: 40}} onClick={() => {
        setIsOpen(true)
      }}>
        { row[`${column.key}`]}
      </div>
      <div style={{
        display: 'flex',
        backgroundColor: POINT_COLOR,
        width: 38,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center'
      }} onClick={() => {
        if(row.pp_id){
          setIsOpen(true)
        }
      }}>
        <img style={{width: 20, height: 20}} src={IcSearchButton}/>
      </div>
    </>
  }

  return (
    <SearchModalWrapper >
      {ModalContents()}
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
          overflow:"hidden"
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5
        }
      }}>
        <div style={{
          width: 1776,
          height: 816
        }}>
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
            }}>{row.name} 생산 공정</p>
            <div style={{cursor: 'pointer'}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{padding: '0 16px 0 16px', width: 856, marginTop: 22}}>
            <ExcelTable
              headerList={searchModalList.productprocess}
              row={searchList ?? []}
              setRow={() => {}}
              width={1750}
              rowHeight={32}
              height={740}
              setSelectRow={(e) => {
                setSelectRow(e)
              }}
              type={'searchModal'}
            />
          </div>
          <div style={{ height: 26, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                if(selectRow !== undefined && selectRow !== null){
                  onRowChange({
                    ...row,
                    ...searchList[selectRow],
                    mold_id: searchList[selectRow].mold_name,
                    mold_idPK: searchList[selectRow].mold_id,
                    isChange: true
                  })
                }
                setIsOpen(false)
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
  display: flex;
  width: 100%;
`

export {ProcessSeqModal}

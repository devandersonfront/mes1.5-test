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
import {PaginationComponent} from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import moment from "moment";
import {PeriodSelectCalendar} from "../Header/PeriodSelectCalendar";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['거래처명','모델명','CODE','품명','Lot번호']

const RawMaterialSearchModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('Lot')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({from:moment(new Date()).startOf("month").format('YYYY-MM-DD'), to:moment(new Date()).endOf("month").format('YYYY-MM-DD')})

  useEffect(() => {
    if(isOpen) SearchBasic(searchKeyword, optionIndex, 1).then(() => {
      Notiflix.Loading.remove()
    })
  }, [isOpen, searchKeyword, selectDate])

  useEffect(() => {
    if(pageInfo.total > 1){
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      customer_id: row.raw_material.model.customer.name,
      customer_idPK: row.raw_material.model.customer.customer_id,
      cm_id: row.raw_material.model.model,
      cm_idPK: row.raw_material.model.cm_id,
      code: row.raw_material.code,
      name: row.raw_material.name,
      texture: row.raw_material.texture,
      ln_id: row.number,
      ln_idPK: row.ln_id
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `rawinSearch`,{
      path: {
        page: page,
        renderItem: 18,
        customer_id: row.customer_idPK,
        cm_id: row.cm_idPK,
        rm_id: row.rm_id
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0,
        nz: column.disableType === 'record',
        from:selectDate.from,
        to:selectDate.to
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

  return (
    <SearchModalWrapper >
      {
        (column.searchType !== 'operation' || row.index===1) && <>
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
              setIsOpen(true)
            }}>
                <img style={{width: 20, height: 20}} src={IcSearchButton}/>
            </div>
        </>
      }

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
            <div style={{display:"flex",justifyContent:"space-between",width:"530px"}}>
              <p style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                margin: 0,
              }}>{title} 검색</p>
              <PeriodSelectCalendar selectDate={selectDate} onChangeSelectDate={setSelectDate} dataLimit={false} />
            </div>
            <div style={{cursor: 'pointer'}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{
            width: 1776, height: 32, margin: '16px 0 16px 16px',
            display: 'flex'
          }}>
            <div style={{
              width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
              backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
              borderRight: 'none'
            }}>
              <select
                defaultValue={'-'}
                onChange={(e) => {
                  setOptionIndex(Number(e.target.value))
                }}
                style={{
                  color: 'black',
                  backgroundColor: '#00000000',
                  border: 0,
                  height: 32,
                  width: 120,
                  fontSize:15,
                  fontWeight: 'bold'
                }}
              >
                {
                  optionList && optionList.map((v, i) => {
                    return <option value={i}>{v}</option>
                  })
                }
              </select>
            </div>
            <input
              value={keyword ?? ""}
              type={"text"}
              placeholder="검색어를 입력해주세요."
              onChange={(e) => {setKeyword(e.target.value)}}
              onKeyDown={(e) => {
                if(e.key === 'Enter'){
                  setSearchKeyword(keyword)
                }
              }}
              style={{
                width:"1594px",
                height:"32px",
                paddingLeft:"10px",
                border:"0.5px solid #B3B3B3",
                backgroundColor: 'rgba(0,0,0,0)'
              }}
            />
            <div
              style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
              onClick={() => {
                setSearchKeyword(keyword)
              }}
            >
              <img src={Search_icon} style={{width:"16px",height:"16px"}} />
            </div>
          </div>
          <div style={{padding: '0 16px 0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.lot}
              row={searchList ?? []}
              setRow={() => {}}
              width={1750}
              rowHeight={32}
              height={576}
              setSelectRow={(e) => {
                setSelectRow(e)
              }}
              type={'searchModal'}
            />
            <PaginationComponent
              currentPage={pageInfo.page}
              totalPage={pageInfo.total}
              themeType={'modal'}
              setPage={(page) => {
                SearchBasic(searchKeyword, optionIndex, page).then(() => {
                  Notiflix.Loading.remove()
                })
              }}
            />
          </div>
          <div style={{ height: 84, display: 'flex', alignItems: 'flex-end'}}>
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
                    ln_id: searchList[selectRow].ln_id,
                    ln_idPK: searchList[selectRow].ln_idPK,
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

export {RawMaterialSearchModal}

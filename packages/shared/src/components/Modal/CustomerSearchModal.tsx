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
import {PaginationComponent} from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['거래처명','대표자명','담당자명', '', '', '', '', '사업자 번호']

const CustomerSearchModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('거래처')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) SearchBasic(searchKeyword, optionIndex, 1).then(() => {
      Notiflix.Loading.remove()
    })
  }, [isOpen, searchKeyword])

  useEffect(() => {
    if(pageInfo.total > 1){
      SearchBasic(keyword, 0, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      customer_id: row.name,
      customer: row.name,
      customerPK: row.customer_id,
      customer_idPK: row.customer_id
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `customerSearch`,{
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
        setIsOpen(true)
      }}>
        <img style={{width: 20, height: 20}} src={IcSearchButton}/>
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
              }}>{title} 검색</p>
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
                    SearchBasic('', Number(e.target.value), 1).then(() => {
                      Notiflix.Loading.remove()
                    })
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
                      if(v){
                        return <option value={i}>{v}</option>
                      }
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
                headerList={searchModalList.customer}
                row={searchList ?? []}
                setRow={() => {}}
                width={1750}
                rowHeight={32}
                height={576}
                onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
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
                  setOptionIndex(0)
                  setIsOpen(false)
                }}
                style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                <p>취소</p>
              </div>
              <div
                onClick={() => {
                  setOptionIndex(0)
                  if(selectRow !== undefined && selectRow !== null){
                      onRowChange({
                        ...row,
                        ...searchList[selectRow],
                        cm_id: column.searchType === 'model' ? row.cm_id : undefined,
                        cm_idPK: column.searchType === 'model' ? row.cm_id : undefined,
                        code: column.searchType === 'product' ? row.code : undefined,
                        rm_id: column.searchType === 'product' ? row.rm_id : undefined,
                        name: column.searchType === 'product' ? row.name : undefined,
                        texture: column.searchType === 'product' ? row.texture : undefined,
                        depth: column.searchType === 'product' ? row.depth : undefined,
                        width: column.searchType === 'product' ? row.width : undefined,
                        height: column.searchType === 'product' ? row.height : undefined,
                        type: column.searchType === 'product' ? row.type : 'COIL',
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

export {CustomerSearchModal}

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
import {LineBorderContainer} from '../Formatter/LineBorderContainer'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조사','장치 이름','제조 번호','담당자명']

const DeviceSearchModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{name: '2호기 로드모니터', device_code: 'P2021030356', manufacturer: '비랑전자', machine_type: '로드모니터', user_id: '-'}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
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
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page])

  const confirmFunction = () => {
      onRowChange({
        ...row,
        ...searchList[selectRow],
        isChange: true
      })
    // }
    setIsOpen(false)
  }

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager ? row.manager.name : null,
      manager_data: row.manager,
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `deviceSearch`,{
      path: {
        page: page,
        renderItem: 18,
      },
      params: {
        // sorts:"name",
        // types:0,
        keyword: keyword ?? '',
        opt: option ?? 0,
      }
    })

    // if(res && res.status === 200){
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
    // }
  }

  const ModalContents = () => {
    return <>
      <div style={{width: 'calc(100% - 30px)', height: 32, background: row.border ? '#19B9DF80' : undefined, display:'flex', alignItems:'center'  }} onClick={() => setIsOpen(true)}>
        <p style={{opacity: row[`${column.key}`] ? 1 : .3, paddingLeft: 10}}>{row[column.key] ?? column.placeholder}</p>
      </div>
      <div style={{
        display: 'flex',
        backgroundColor: POINT_COLOR,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
      }} onClick={() => setIsOpen(true)}>
        <img style={{width: 16.3, height: 16.3}} src={IcSearchButton}/>
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
          height: 795
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
            }}>주변장치 검색</p>
            <div style={{cursor: 'pointer'}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{height: 32, margin: '16px 0 16px 16px',
            display: 'flex' }}>
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
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.device}
              row={searchList ?? []}
              width={1746}
              rowHeight={32}
              height={654}
              setRow={()=>{}}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
                const update = searchList.map(
                  (row, index) => index === e
                    ? {
                      ...row,
                      doubleClick: confirmFunction,
                      border: true,
                    }
                    : {
                      ...row,
                      border: false
                    }
                );

                setSearchList(update)

                setSelectRow(e)
              }}
              type={'searchModal'}
            />
            {/*<PaginationComponent*/}
            {/*  currentPage={pageInfo.page}*/}
            {/*  totalPage={pageInfo.total}*/}
            {/*  themeType={'modal'}*/}
            {/*  setPage={(page) => {*/}
            {/*    SearchBasic(searchKeyword, optionIndex, page).then(() => {*/}
            {/*      Notiflix.Loading.remove()*/}
            {/*    })*/}
            {/*  }}*/}
            {/*/>*/}
          </div>
          <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => confirmFunction()}
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

export {DeviceSearchModal}

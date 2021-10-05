import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
//@ts-ignore
import CheckboxSrc from '../../../public/images/check_box_activated.png'
import {ExcelTable} from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import {PaginationComponent}from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {LineBorderContainer} from '../Formatter/LineBorderContainer'
import {MoldRegisterModal} from './MoldRegisterModal'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['CODE','금형명',]

const filterTitleList = ['CODE', '금형명', '캐비티', 'SPM', '슬라이드 위치', '최대 타수', '점검 타수', '현재 타수']

const MoldSearchModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('금형')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([
    {code: 'SU-M-3', name:'OP10', cavity:'1', spm: '24', dieHeight: '10', limit: '0', check: '0', current: '0'}
  ])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [filterList, setFilterList] = useState<boolean[]>(new Array(8).fill(false))

  // useEffect(() => {
  //   if(isOpen) SearchBasic(searchKeyword, optionIndex, 1).then(() => {
  //     Notiflix.Loading.remove()
  //   })
  // }, [isOpen, searchKeyword])
  // console.log(row)
  // useEffect(() => {
  //   if(pageInfo.total > 1){
  //     SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    console.log('factory row', row)
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager ? row.manager.name : null,
      factory: row.name,
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

  const onClickFilter = (index: number) => {
    let tmp = filterList
    tmp[index] = !tmp[index]
    setFilterList([...tmp])
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
      <div style={{width: '100%', height: 32}} onClick={() => {
        // setIsOpen(true)
      }}>
        {
          column.type === 'Modal'
            ? <LineBorderContainer row={row} column={column} setRow={() => {}}/>
            : row[`${column.key}`]
        }
      </div>
      <div style={{
        display: 'flex',
        backgroundColor: POINT_COLOR,
        width: column.type === 'Modal' ? 30 : 38,
        height: column.type === 'Modal' ? 30 : 38,
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
          padding: 0
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
            <div style={{display: 'flex', alignItems: 'center'}}>
              <p style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                margin: 0,
              }}>{title} 검색</p>
              {
                filterList.map((v, i) => {
                  return <CheckDiv>
                    <input type={'checkbox'} id={`check${i}`} style={{display: 'none'}}/>
                    <label form={`check${i}`} onClick={() => onClickFilter(i)}>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                      {
                        v
                          ? <img style={{width: 14, height: 14, marginRight: 8}} src={CheckboxSrc}/>
                          : <div style={{width: 14, height: 14, marginRight: 8, border: '1px solid #b3b3b3', backgroundColor: '#F4F6FA', }}/>
                      }
                      {filterTitleList[i]}
                      </div>
                    </label>
                  </CheckDiv>
                })
              }
            </div>
            <div style={{display: 'flex'}}>
              <MoldRegisterModal column={column} onRowChange={() => {}} row={row}/>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
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
          <div style={{padding: '0 16px 0 16px', width: 1746}}>
            <ExcelTable
              headerList={searchModalList.mold}
              row={searchList ?? []}
              setRow={() => {}}
              width={1746}
              rowHeight={32}
              height={576}
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
          <div style={{ height: 80, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: '50%', height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
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
`;

const CheckDiv = styled.div`
  display: flex;
  align-items: center;
  margin-left: 25px;
  font-size: 16px;
`

export {MoldSearchModal}

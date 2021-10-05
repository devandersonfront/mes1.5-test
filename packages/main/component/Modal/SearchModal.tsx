import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../public/images/ic_x.png'
import ExcelTable from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = {
  member: ['사용자명'],
  product: ['고객사명','모델명','CODE', '품명', '재질'],
  customer: ['고객사명'],
  model: ['고객사명', '모델']
}

const SearchModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])

  useEffect(() =>{
    setTitle(column.searchType ?? '')
    if(column.searchType) {
      changeTypeToString(column.searchType)
    }
  }, [column.searchType])

  useEffect(() => {
    if(isOpen) SearchBasic(keyword, 0)
  }, [isOpen])

  const changeTypeToString = (type: string) => {
    switch(type){
      case 'member':
        setTitle('담당자')
        break;
      case 'product':
        setTitle('제품')
        break;
      case 'customer':
        setTitle('고객사')
        break;
      case 'model':
        setTitle('고객사 모델')
        break;
      default:
        setTitle('')
        break;
    }
  }

  const changeRow = (row: any, key?: string) => {
    let tmpData = {}
    Object.keys(row).map(v => {

      if(row[v] && typeof row[v] === 'object' && v !== 'additional'){
        let data = changeRow(row[v], v)
        tmpData = {
          ...tmpData,
          ...data,
        }
      }else{
        if(key === 'customer' && v.indexOf(key) === -1){
          if(v === 'name'){
            tmpData = {
              ...tmpData,
              [key+'_idPK']: row[key+'_id'],
              [key+'_id']: row[v],
              [key]: row[v],
            }
          }else if(v === 'name'){
            tmpData = {
              ...tmpData,
              [key+'_'+v]: row[v]
            }
          }else{
            tmpData = {
              ...tmpData,
              [v]: row[v]
            }
          }
        }
        else if (key === 'authority' && v === 'ca_id') {
          tmpData = {
            ...tmpData,
            ['authorityPK']: row['ca_id'],
            ['authority']: row['name'],
          }
        } else if(key === 'raw_material' && v === 'name'){
          tmpData = {
            ...tmpData,
            name: row['name'],
          }
        } else if (key === 'model' && v === 'cm_id') {
          tmpData = {
            ...tmpData,
            ['cm_idPK']: row['cm_id'],
            ['cm_id']: row['model'],
          }
        } else if (key === 'manager' && v === 'user_id') {
          tmpData = {
            ...tmpData,
            ['user_idPK']: row.user_id,
            ['user_id']: row.name,
          }
        } else if(key && v === 'name') {
          tmpData = {
            ...tmpData,
            [`${key}_${v}`]: row[v]
          }
        } else {
          tmpData = {
            ...tmpData,
            [v]: row[v]
          }
        }
      }
    })

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number) => {
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `${column.searchType}Search`,{
      path: {
        page: 1,
        renderItem: 19,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    let searchList = res.results.info_list.map((row: any, index: number) => {
      return changeRow(row)
    })

    if(res && res.status === 200){
      setSearchList([...searchList])
    }
  }

  return (
    <SearchModalWrapper >
      <div style={{width: 'calc(100% - 40px)', height: 40}} onClick={() => {
        setIsOpen(true)
      }}>
        {column.searchType === 'product' ? row['code'] : row[`${column.key}`]}
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
            width: 888,
            height: 480
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
              width: 856, height: 32, margin: '16px 0 16px 16px',
              display: 'flex'
            }}>
              <div style={{
                width: 88, display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
                borderRight: 'none'
              }}>
                <select
                  defaultValue={'-'}
                  onChange={(e) => {
                    SearchBasic('', Number(e.target.value))
                  }}
                  style={{
                    color: 'black',
                    backgroundColor: '#00000000',
                    border: 0,
                    height: 32,
                    width: 115,
                    fontSize:15,
                    fontWeight: 'bold'
                  }}
                >
                  {
                    optionList && optionList[column.searchType].map((v, i) => {
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
                    SearchBasic(keyword, optionIndex)
                  }
                }}
                style={{
                  width:"736px",
                  height:"32px",
                  paddingLeft:"10px",
                  border:"0.5px solid #B3B3B3",
                  backgroundColor: 'rgba(0,0,0,0)'
                }}
              />
              <div
                style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                onClick={() => {
                  SearchBasic(keyword, optionIndex)
                }}
              >
                <img src={Search_icon} style={{width:"16px",height:"16px"}} />
              </div>
            </div>
            <div style={{padding: '0 16px 0 16px', width: 856}}>
              <ExcelTable
                headerList={searchModalList[column.searchType ?? '']}
                row={searchList ?? []}
                setRow={() => {}}
                width={856}
                rowHeight={32}
                height={320}
                setSelectRow={(e) => {
                  setSelectRow(e)
                }}
                type={'searchModal'}
              />
            </div>
            <div style={{ height: 70, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
                  setIsOpen(false)
                }}
                style={{width: 444, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                <p>취소</p>
              </div>
              <div
                onClick={() => {
                  let pk = ''
                  Object.keys(searchList[0]).map(v => {
                    if(v.indexOf('_id') !== -1){
                      pk = v
                    }
                  })
                  if(selectRow !== undefined && selectRow !== null){
                    if(column.searchType === 'product'){
                      onRowChange({
                        ...row,
                        ...searchList[selectRow],
                        [column.key+'PK']: searchList[selectRow][pk],
                      })
                    }else{
                      onRowChange({
                        ...row,
                        ...searchList[selectRow],
                        [column.key]: searchList[selectRow].name,
                        [column.key+'PK']: searchList[selectRow][pk],
                        name: row.name
                      })
                    }
                  }
                  setIsOpen(false)
                }}
                style={{width: 444, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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

export default SearchModal

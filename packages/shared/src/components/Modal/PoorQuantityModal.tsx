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
import {UnitBox, UnitValue, UnitWrapper, UploadButton} from '../../styles/styledComponents'
import Notiflix from 'notiflix'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['거래처명','모델명','CODE', '품명', '재질']

const PoorQuantityModal = ({column, row, onRowChange}: IProps) => {
  const [isExist, setIsExist] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('불량 수량')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>(-1)
  const [searchList, setSearchList] = useState<any[]>([])

  useEffect(() => {
    if(row.poor_quantities && row.poor_quantities.length){
      setSearchList([...row.poor_quantities])
    }else{
      if(column.searchType === 'list'){
        // SearchDefect().then(() => {
        //   // Notiflix.Loading.remove()
        // })
      }else{
        SearchBasic(keyword, 0).then(() => {
          // Notiflix.Loading.remove()
        })
      }
    }
  }, [isOpen, row['process_idPK']])

  useEffect(() => {
    if(selectRow >= 0) {
      if(searchList[selectRow].pp_id){
        ProductProcessSearch(searchList[selectRow].pp_id)
      }
    }
  }, [selectRow])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
        ...row,
        amount: 0
      }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number) => {
    // Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `defectReasonSearch`,{
      path: {
        page: 1,
        renderItem: 19,
        process_id: row.process_idPK,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      if(res.results.info_list.length > 0){
        setIsExist(false)
        let searchList = res.results.info_list.map((row: any, index: number) => {
          return changeRow(row)
        })
        setSearchList([...searchList])
      } else {
        setIsExist(true)
        setSearchList([{reason: '전체 불량 수량', amount: 0}])
      }
    }
  }

  const SearchDefect = async () => {
    // Notiflix.Loading.circle()
    const res = await RequestMethod('get', `recordDefect`,{
      path: {
        or_id: row.or_id
      },
    })

    if(res && res.status === 200){
      setIsOpen(true)
      if(res.results.poor_quantities.length){
        let searchList = res.results.poor_quantities.map((row: any, index: number) => {
          return {
            ord_id: row.ord_id,
            pdr_id: row.pdr.pdr_id,
            reason: row.pdr.reason,
            amount: row.amount
          }
        })

        setSearchList([...searchList])
        setIsExist(false)
      }else{
        setIsExist(true)
        setSearchList([{
          reason: '전체 불량 수량',
          amount: row.poor_quantity
        }])
      }
    }
  }

  const ProductProcessSearch = async (pp_id: number) => {
    const res = await RequestMethod('get', `productprocessList`,{
      path: {
        pp_id
      }
    })

    if(res && res.status === 200){

    }
  }

  return (
    <>
    {
      // !isExist ?
        // (row.poor_quantity || row.poor_quantity === 0)
        (row.poor_count || row.poor_count === 0 || column.searchType === 'disable')
        ? <UnitWrapper onClick={() => {
          if(column.searchType === 'list' || column.searchType === 'disable' ) {
            if(row['or_id']) {
              SearchDefect().then(() => {})
            }
          }else{
            if(row['process_id']){
              setIsOpen(true)
            }else{
              Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
            }
          }
        }}>
          <UnitValue>
            <p>{row.poor_count}</p>
          </UnitValue>
          <UnitBox>
        <span>{column.unitData}</span>
          </UnitBox>
        </UnitWrapper>
        : <SearchModalWrapper>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%'}}>
            <UploadButton onClick={() => {
              if(row['process_id']){
                setIsOpen(true)
              }else{
                Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
              }
            }}>
              <p>불량 수량 등록</p>
            </UploadButton>
          </div>
        </SearchModalWrapper>
        // :
        // <div style={{margin: 0}} onClick={() => {
        //   setSearchList([{
        //     reason: '',
        //
        //   }])
        //   if(row['process_id']){
        //     setIsOpen(true)
        //   }else{
        //     Notiflix.Report.failure('실패', '공정을 먼저 선택해주세요', '확인')
        //   }
        // }}>
        //   <UnitContainer row={row} column={column} setRow={setSelectRow}></UnitContainer>
        // </div>
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
            <p style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              margin: 0,
            }}>{title}</p>
            <div style={{cursor: 'pointer'}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{padding: '0 16px 0 16px', width: 856}}>
            <ExcelTable
              editable
              headerList={column.searchType === 'disable' ? searchModalList.poorDisable : searchModalList.poor}
              row={searchList ?? []}
              setRow={setSearchList}
              width={1750}
              rowHeight={32}
              height={740}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                setSelectRow(e)
              }}
              type={'searchModal'}
            />
          </div>
          <div style={{ height: 49, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                if(selectRow !== undefined && selectRow !== null){
                  let quantity = 0
                  searchList.map(v => {
                    quantity+=Number(v.amount)
                  })

                  if(isExist){
                    onRowChange({
                      ...row,
                      poor_quantities: [],
                      poor_quantity: quantity,
                      isChange: true
                    })
                  }else{
                    onRowChange({
                      ...row,
                      poor_quantities: searchList.map(v => {
                        return {
                          ...v,
                          amount: v.amount ? Number(v.amount) : 0
                        }
                      }),
                      poor_count: quantity,
                      // poor_quantity: quantity,
                      poor_quantity: (row.poor_quantity && row.poor_quantity > quantity) ? row.poor_quantity : quantity,
                      isChange: true
                    })
                  }
                }
                setIsOpen(false)
              }}
              style={{width: '100%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>등록하기</p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

export {PoorQuantityModal}

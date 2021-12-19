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
import {PaginationComponent}from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const machineType = [
        {name:"금형명",},
        // {type: "기계 종류", weldingType: "용접 종류", mfrCode: "제조번호", manager: "담당자",},
        // {interwork:"오버홀"}
    ]

const moldType = [
  {code:"CODE", name:"금형명"},
  {cavity:"캐비티", spm:"SPM", slideHeight:"슬라이드 위치"},
  {limit:"최대 타수", inspect:"점검 타수", current:"현재 타수"},
]



const ProductInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    // if(isOpen) {
    //   SearchBasic(searchKeyword, optionIndex, 1).then(() => {
    //     Notiflix.Loading.remove()
    //   })
    // }
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

    if(res){
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
    }
  }

  const settingTitle = (index:number, inindex?:number) => {
    if(column.type === "mold" && index === 0 ? 450 : 144)
    switch(column.type){
      case "mold":
        let width ;
        if(index === 0){
          // width = 450;
          return 450;
        }else{
          // width = 144
          return 144;
        }


      case "machine":
        if(index === 0 && inindex === 1){
          return 755;
        }else{
          return 144;
        }
        return

    }
  }


  const ModalContents = () => {
    return (<>
      <div style={{
        padding: '3.5px 0px 0px 3.5px',
        width: '100%'
      }}>
      <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
        setIsOpen(true)
      }}>
        <p style={{color: 'white', textDecoration: 'underline'}}>품목 보기</p>
      </UploadButton>
      </div>
    </>)
  }

  const cleanUp = (row:any, value:any) => {

    if(typeof row[value] === "object" && row[value] !== null){
      return row[value].name
    }else{
      return row[value] === null ? "-" : row[value];
    }

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
            margin: '24px 16px 16px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <p style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              margin: 0,
            }}>생산 품목 정보</p>
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
          {machineType.map((header,index)=>{
            return (
                <HeaderTable>
                  {Object.keys(header).map((value,i)=> {
                    cleanUp(row,  value)
                    return (
                        <>
                          <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>{header[value]}</HeaderTableText>
                          </HeaderTableTitle>
                          <HeaderTableTextInput style={{width: settingTitle(index, i)}}>
                            {/*<HeaderTableText>{typeof row[value] === "boolean" ? row[value] ? "유" : "무" : row[value]}</HeaderTableText>*/}
                            <HeaderTableText>{cleanUp(row, value)}</HeaderTableText>
                          </HeaderTableTextInput>
                        </>
                    )}
                  )}
                </HeaderTable>
            )
          })}
          {/*<HeaderTable>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 450}}>*/}
          {/*    <HeaderTableText>SU-M-3</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>금형명</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 450}}>*/}
          {/*    <HeaderTableText>OP10</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*</HeaderTable>*/}
          {/*<HeaderTable>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>캐비티</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>1</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>SPM</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>24</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>슬라이드 위치</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>10</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*</HeaderTable>*/}
          {/*<HeaderTable>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>최대 타수</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>0</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>점검 타수</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>0</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*  <HeaderTableTitle>*/}
          {/*    <HeaderTableText style={{fontWeight: 'bold'}}>현재 타수</HeaderTableText>*/}
          {/*  </HeaderTableTitle>*/}
          {/*  <HeaderTableTextInput style={{width: 144}}>*/}
          {/*    <HeaderTableText>0</HeaderTableText>*/}
          {/*  </HeaderTableTextInput>*/}
          {/*</HeaderTable>*/}
          <div style={{display: 'flex', justifyContent: 'flex-start', margin: '24px 0 8px 16px'}}>
            <Button style={{backgroundColor: '#19B9DF'}} onClick={() => {
              let tmp = searchList
              setSearchList([
                ...searchList,
                {
                  seq: searchList.length+1
                }
              ])
            }}>
              <p style={{fontWeight: 'bold'}}>반·완제품</p>
            </Button>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.productInfo}
              row={row.products ?? row.product_id ?? [{}]}
              setRow={(e) => setSearchList([...e])}
              width={1746}
              rowHeight={32}
              height={591}
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
                    ...searchList[selectRow],
                    name: row.name,
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
  margin-right: 62px;
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

export {ProductInfoModal}

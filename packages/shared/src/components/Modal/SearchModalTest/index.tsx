import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../../public/images/ic_x.png'
import {ExcelTable} from '../../Excel/ExcelTable'
import {searchModalList} from '../../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../../public/images/btn_search.png'
import {RequestMethod} from '../../../common/RequestFunctions'
import {SearchInit} from './SearchModalInit'
import {MoldRegisterModal} from '../MoldRegisterModal'
import Notiflix from 'notiflix'
import {SearchModalResult, SearchResultSort} from '../../../Functions/SearchResultSort'
import {Select} from '@material-ui/core'
import {TransferCodeToValue} from '../../../common/TransferFunction'


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

const SearchModalTest = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{}])
  const [tab, setTab] = useState<number>(0)
  const [searchModalInit, setSearchModalInit] = useState<any>()
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  // const [page, setPage] = useState<number>(1);
  // const [totalPage, setTotalPage] = useState<number>(0);

  useEffect(() => {
    if(column.type){
      if(column.type === "bom"){
        setSearchList([{}])
        switch(tab){
          case 0:{
            setSearchModalInit(SearchInit.rawmaterial)
            break;
          }
          case 1:{
            setSearchModalInit(SearchInit.submaterial)
            break;
          }
          case 2:{
            setSearchModalInit(SearchInit.product)
            break;
          }
        }
      }else{
        setSearchModalInit(SearchInit[column.type])
      }
    }
  }, [column.type, tab])

  useEffect(() => {
    if(isOpen){
      LoadBasic();

    }
  }, [isOpen, searchModalInit, optionIndex, pageInfo.page])

  const LoadBasic = async (page?:number) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', `${searchModalInit.excelColumnType}Search`,{
      path: column.type === "customerModel" ?
          {
            page:  page ?? pageInfo.page,
            renderItem: 22,
            customer_id: row.customer?.customer_id ?? null
          }
          :
          {
            page: page ?? pageInfo.page,
            renderItem: 22,
          }
      ,
      params:{
        keyword:keyword,
        opt:optionIndex
      }
    })

    if(res){
        if(res.page !== 1){
          setSearchList([...searchList,...SearchResultSort(res.info_list, searchModalInit.excelColumnType)])
          setPageInfo({...pageInfo, total:res.totalPages});
          Notiflix.Loading.remove()
        }else{
          setSearchList([...SearchResultSort(res.info_list, searchModalInit.excelColumnType)])
          setPageInfo({...pageInfo, total:res.totalPages});
          Notiflix.Loading.remove()
        }
    }
    if(document.querySelector(".LoadingBar") !== null){
    }
  }
  const getContents = () => {
    if(row[`${column.key}`]){
      if( typeof row[`${column.key}`] === "string"){
        return row[column.key];
      }else{
        return row[column.key].name;
      }
    }else{
      if(searchModalInit && searchModalInit.placeholder){
        return searchModalInit.placeholder
      }else{
        return column.placeholder
      }
    }
  }

  return (
    <SearchModalWrapper >
      <div style={ column.modalType
        ? {width: 'calc(100% - 32px)', height: 32, paddingLeft:8, opacity: row[`${column.key}`] ? 1 : .3}
        : {width: 'calc(100% - 40px)', height: 40, paddingLeft:8, opacity: row[`${column.key}`] ? 1 : .3}
      } onClick={() => {
        setIsOpen(true)
      }}>
        {getContents()}
      </div>
      <div style={{
        display: 'flex',
        backgroundColor: POINT_COLOR,
        width: column.modalType ? 30 : 38,
        height: column.modalType ? 30 : 38,
        justifyContent: 'center',
        alignItems: 'center'
      }} onClick={() => {
        setIsOpen(true)
      }}>
        <img style={column.modalType ? {width: 16.3, height: 16.3} : {width: 20, height: 20}} src={IcSearchButton}/>
      </div>
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0,
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5
        }
      }}>
        <div style={{
          width: 1776,
          height: 816,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{
              marginTop: 24,
              marginLeft: 16,
              marginRight: 16,
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <div style={{display: 'flex'}}>
                <p style={{
                  color: 'black',
                  fontSize: 22,
                  fontWeight: 'bold',
                  margin: 0,
                }}>{searchModalInit && searchModalInit.title}</p>
                {
                  column.type === 'bom' && <div style={{marginLeft: 20}}>
                      <Select value={tab} onChange={(e) => {
                        setTab(Number(e.target.value))
                      }}>
                          <option value={0}>원자재</option>
                          <option value={1}>부자재</option>
                          <option value={2}>제품</option>
                      </Select>
                  </div>
                }
              </div>
              <div style={{display: 'flex'}}>
                {
                  column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {
                    LoadBasic();
                  }}/>
                }
                <div style={{cursor: 'pointer', marginLeft: 22}} onClick={() => {
                  setIsOpen(false)
                }}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            <div style={{
              width: '100%', height: 32, margin: '16px 0 16px 16px',
              display: 'flex',
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
                    // SearchBasic('', Number(e.target.value))
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
                    searchModalInit && searchModalInit.searchFilter.map((v, i) => {
                      return (<option value={i}>{v}</option>)
                    })
                  }
                </select>
              </div>
              <input
                value={keyword ?? ""}
                type={"text"}
                placeholder="검색어를 입력해주세요."
                onChange={(e) => {
                  setKeyword(e.target.value)
                  // setPageInfo({...pageInfo, page:1});
                }}
                onKeyDown={(e) => {
                  if(e.key === 'Enter'){
                    // setPageInfo({...pageInfo, page:1});
                    LoadBasic(1);
                  }
                }}
                style={{
                  width:1592,
                  height:"32px",
                  paddingLeft:"10px",
                  border:"0.5px solid #B3B3B3",
                  backgroundColor: 'rgba(0,0,0,0)'
                }}
              />
              <div
                style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                onClick={() => {
                  LoadBasic();
                }}
              >
                <img src={Search_icon} style={{width:"16px",height:"16px"}} />
              </div>
            </div>
            <ExcelTable
              headerList={searchModalInit && searchModalList[`${searchModalInit.excelColumnType}Search`]}
              row={searchList ?? []}
              setRow={() => {}}
              width={1744}
              rowHeight={32}
              height={640}
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
              scrollEnd={(value) => {
                if(value){
                  if(pageInfo.total > pageInfo.page){
                    setPageInfo({...pageInfo, page:pageInfo.page+1})
                  }
                }
              }}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end',}}>
            <FooterButton
              onClick={() => {
                setIsOpen(false)
              }}
              style={{backgroundColor: '#E7E9EB'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </FooterButton>
            <FooterButton
              onClick={() => {
                setIsOpen(false)
                onRowChange({
                  ...row,
                  ...SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType),
                  manager: column.type === "factory" ? row.manager : SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).manager,
                  name: row.name ?? SearchModalResult(searchList[selectRow], searchModalInit.excelColumnType).name,
                  tab: column.type === 'bom' ? tab : undefined,
                  type_name: column.type === 'bom' ? TransferCodeToValue(tab, 'material') : undefined,
                  version: row.version,
                  isChange:true
                })
              }}
              style={{backgroundColor: POINT_COLOR}}
            >
              <p style={{color: '#0D0D0D'}}>등록하기</p>
            </FooterButton>
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

const FooterButton = styled.div`
  width: 50%; 
  height: 40px;
  display: flex; 
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`

const LoadingBar = styled.div`
  width:100%;
  height:50px;
  display:flex;
  justify-content:center;
  align-items:center;
  
`;

export {SearchModalTest}

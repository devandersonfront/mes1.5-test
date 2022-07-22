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
import {UploadButton} from "../../styles/styledComponents";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const LotInfoModal = ({column, row, onRowChange}: IProps) => {
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
    if(isOpen) {
      if(row.productId){
        SearchBasic('', 0, 1)
      }else{
        setSearchList([...row.lots.map(v => {
          return {
            seq: 1,
            lot_number: v.group.sum.lot_number,
            start: v.group.sum.start,
            end: v.group.sum.end,
            worker: v.group.sum.worker?.name ?? '-',
            amount: v.group.sum.current
          }
        })])
      }
    }
  }, [isOpen, searchKeyword])

  const changeRow = (row: any, i: number) => {

    return {
      seq: i+1,
      lot_number: row.sum?.lot_number,
      start: row.sum?.start,
      end: row.sum?.end,
      worker: `${row.sum?.worker?.name ?? '-'} ${row.elements?.length > 1 ? `외 ${row.elements?.length-1}명`: ''}`,
      amount: row.sum?.current
    }

  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `recordGroupList`,{
      path: {
        product_id: row.productId,
        page: page,
        renderItem: 18,
      },
      params:{
        keyword:keyword
      }
    })

    if(res){

      let tmp
      if(typeof res === 'string'){
        let tmpRowArray = res.split('\n')

        tmp = tmpRowArray.map(v => {
          if(v !== ""){
            let tmp = JSON.parse(v)
            return tmp
          }
        }).filter(v=>v)
      }else{
        tmp = [...res?.info_list]
      }

      let searchList = tmp.map((row: any, index: number) => {
        return changeRow(row, index)
      })

      // setPageInfo({
      //   ...pageInfo,
      //   page: res.results.page,
      //   total: res.results.totalPages,
      // })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () =>
      <UploadButton onClick={() => {
        setIsOpen(true)
      }} hoverColor={POINT_COLOR} haveId >
          <p style={{textDecoration: 'underline', padding: 0, margin: 0}}>LOT 보기</p>
      </UploadButton>

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
            }}>LOT별 재고 현황</p>
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
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>거래처</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.customer_id ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.cm_id ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.code ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.name ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.type ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.unit ?? '-'}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>재고량</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.stock ?? 0}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
                <p style={{fontSize: 22, padding: 0, marginBottom: 8}}>{column.type === 'readonly'? "LOT 별 수량" : "작업이력"}</p>
              </div>
            </div>
            {/*<div style={{height: '100%', display: 'flex', alignItems:"flex-end", paddingBottom: 7}}>*/}
            {/*  <div style={{*/}
            {/*    display:"flex", justifyContent: 'flex-end', width: "400px", height: "32px", borderRadius: 6, backgroundColor: '#F4F6FA', marginRight: 16,*/}
            {/*    border:'0.5px solid #b3b3b3'*/}
            {/*  }}>*/}
            {/*    <div style={{*/}
            {/*      width: 120, height:32, display: 'flex', justifyContent: 'center', alignItems: 'center',*/}
            {/*      backgroundColor: POINT_COLOR, borderRadius: 6,*/}
            {/*    }}>*/}
            {/*        LOT 번호*/}
            {/*    </div>*/}
            {/*    <input*/}
            {/*      value={keyword ?? ""}*/}
            {/*      type={"text"}*/}
            {/*      placeholder="검색어를 입력해주세요."*/}
            {/*      onChange={(e) => {setKeyword(e.target.value)}}*/}
            {/*      onKeyDown={(e) => {*/}
            {/*        if(e.key === 'Enter'){*/}
            {/*          // SearchBasic(keyword,)*/}
            {/*        }*/}
            {/*      }}*/}
            {/*      style={{width:"248px", height:"31px", borderRadius: '6px', paddingLeft:"10px", border:"none", backgroundColor: 'rgba(0,0,0,0)'}}*/}
            {/*    />*/}
            {/*    <div*/}
            {/*      style={{background:"#19b9df", width:"31px",height:"31px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"6px"}}*/}
            {/*      onClick={() => {}}*/}
            {/*    >*/}
            {/*      <img src={Search_icon} style={{width:"16.3px",height:"16.3px"}} />*/}
            {/*    </div>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.lotStock}
              row={searchList ?? [{}]}
              setRow={(e) => setSearchList([...e])}
              width={1746}
              rowHeight={32}
              height={568}
              // onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
              //   setSelectRow(e)
              // }}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
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
          { column.type === "readonly" ?
            <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
              <div
                onClick={() => {
                  if (selectRow !== undefined && selectRow !== null) {
                    onRowChange({
                      ...row,
                      ...searchList[selectRow],
                      name: row.name,
                      isChange: true
                    })
                  }
                  setIsOpen(false)
                }}
                style={{
                  width: '100%',
                  height: 40,
                  backgroundColor: POINT_COLOR,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <p>확인</p>
              </div>
            </div>
            : <div style={{height: 45, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{
                width: 888,
                height: 40,
                backgroundColor: '#b3b3b3',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                if (selectRow !== undefined && selectRow !== null) {
                  onRowChange({
                    ...row,
                    ...searchList[selectRow],
                    name: row.name,
                    isChange: true
                  })
                }
                setIsOpen(false)
              }}
              style={{
                width: 888,
                height: 40,
                backgroundColor: POINT_COLOR,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <p>등록하기</p>
            </div>
          </div>}
        </div>
      </Modal>
    </SearchModalWrapper>
  )
}

const SearchModalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content:center;
  align-items:center;
`

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

export {LotInfoModal}

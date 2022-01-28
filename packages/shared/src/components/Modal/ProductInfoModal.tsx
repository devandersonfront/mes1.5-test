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
import {UploadButton} from '../../styles/styledComponents'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const ProductInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      cleanUpData();
    }
  }, [isOpen, searchKeyword])


  const cleanType = (type:number) => {
    switch(type) {
      case 0:
        return "반제품"
      case 1:
        return "재공품"
      case 2:
        return "완제품"
      default:
        break;
    }
  }


  const cleanUpData = () => {
    if(row.product_id){
      switch(column.type){
        case "mold" :
              let moldArray = [];
              row?.product_id.map((data)=>{
                let result:any = {...data};
                result.customerData = data?.customer;
                result.customer = data?.customer?.name;
                result.modelData = data?.model;
                result.model = data?.model?.model;
                result.type_id = data.type;
                result.product_type = cleanType(data.type);
                result.unit = data.unit;
                result.stock = data.stock;

                moldArray.push(result);
              })
              setSearchList(moldArray);


          return
        case "machine" :
          let machineArray = [];
          row?.product_id?.map((data)=>{
            let result:any = {...data};
            result.customerData = data?.customer;
            result.customer = data?.customer?.name;
            result.modelData = data?.model;
            result.model = data?.model?.model;
            result.type_id = data?.type;
            result.product_type = cleanType(data?.type);
            result.unit = data?.unit;
            result.stock = data?.stock;


            machineArray.push(result);
          })
          setSearchList(machineArray);
          return

        case "tool" :
          let toolArray = [];
          row?.product_id?.map((data)=>{
            let result:any = {...data};
            result.customerData = data?.customer;
            result.customer = data?.customer?.name;
            result.modelData = data?.model;
            result.model = data?.model?.model;
            result.type_id = data?.type;
            result.product_type = cleanType(data?.type);
            result.unit = data?.unit;
            result.stock = data?.stock;


            toolArray.push(result);
          })
          setSearchList(toolArray);

          return
        default :
          break;
      }
    }else{
      if(row?.products){
        let productArray = [];
        row?.products?.map((data) => {
          let result:any = {...data}
          result.customerData = data?.customer;
          result.customer = data?.customer?.name;
          result.modelData = data?.model;
          result.model = data?.model?.model;
          result.type_id = data?.type;
          result.product_type = cleanType(data?.type);
          result.unit = data?.unit;
          result.stock = data?.stock;

          productArray.push(result);
        })
        setSearchList(productArray);
      }else{
        Notiflix.Report.warning("경고","품목이 없습니다.","확인",() => setIsOpen(false))
      }
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
      case "tool" :
        return 450
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
          height: 816,
          display:'flex', flexDirection:"column", justifyContent:"space-between"
        }}>
          <div style={{}}>

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
            {column.headerType.map((header,index)=>{
            // {machineType.map((header,index)=>{
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
            {column.type !== "tool" &&
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
            }

            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                // headerList={searchModalList.productInfo}
                headerList={row.products ? searchModalList.productToolInfo : searchModalList.productInfo}
                // row={row.products ?? row.product_id ?? [{}]}
                row={searchList}
                setRow={(e) => setSearchList([...e])}
                width={1746}
                rowHeight={32}
                height={591}
                // setSelectRow={(e) => {
                //   setSelectRow(e)
                // }}
                setSelectRow={(e) => {
                  // if(!searchList[e].border){
                  //   searchList.map((v,i)=>{
                  //     v.border = false;
                  //   })
                  //   searchList[e].border = true
                  //   setSearchList([...searchList])
                  // }
                  setSelectRow(e)
                }}
                type={'searchModal'}
                headerAlign={'center'}
              />
            </div>
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

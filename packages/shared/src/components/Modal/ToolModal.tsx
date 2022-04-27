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
import ModalButton from '../Buttons/ModalButton'
import CloseButton from '../Buttons/CloseButton'

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const ToolModal = ({column, row, onRowChange}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectRow, setSelectRow] = useState<number>()
    const [data, setData] = useState<any[]>([])
    // const [searchKeyword, setSearchKeyword] = useState<string>('')
    // const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    //     page: 1,
    //     total: 1
    // })
    //
    // useEffect(() => {
    //     if(isOpen) {
    //         convertRowToData();
    //     }
    // }, [isOpen, searchKeyword])
    useEffect(() => {
        if(isOpen) {
            convertRowToData();
        }
    }, [isOpen])


    const getProductType = (type:number) => {
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


    async function convertRowToData() {
        if(row.products?.length > 0){
            switch(column.type){
                case "tool" :
                    const products = await Promise.all(await row.products.map( async product => (
                      {...product,
                            average: await getToolAverage(product.product_id, row.tool_id),
                            customerData : product?.customer,
                            customer : product?.customer?.name,
                            modelData : product?.model,
                            model : product?.model?.model,
                            type_id : product?.type,
                            product_type : getProductType(product?.type),
                            unit : product?.unit,
                            stock : product?.stock
                        })))
                    setData(products)
                    return
                default :
                    break;
            }
        }else{
            Notiflix.Report.warning("경고","품목이 없습니다.","확인",() => setIsOpen(false))
        }
    }

    async function getToolAverage(productId:number, toolId:number) {
            const res = await RequestMethod("get", "toolAverage", {
                path:{
                    product_id: productId,
                    tool_id: toolId
                }
            })
        return res? res : 0.0
    }

    const ModalContents = () => {
        return (<>
            <div style={{
                padding: '3.5px 0px 0px 3.5px',
                width: '100%'
            }}>
                <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
                    // ToolAverage()
                    setIsOpen(true)
                }}>
                    <p style={{color: 'white', textDecoration: 'underline'}}>품목 보기</p>
                </UploadButton>
            </div>
        </>)
    }

    const onClickClose = () => {
        setIsOpen(false)
        setData([])
    }

    const getHeaderTableValue = (row:any, value:any) => {

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
                                <CloseButton onClick={onClickClose}/>
                            </div>
                        </div>
                        {column.headerType.map((header,index)=>{
                            return (
                                <HeaderTable>
                                    {Object.keys(header).map((value,i)=> {
                                        return (
                                            <>
                                                <HeaderTableTitle>
                                                    <HeaderTableText style={{fontWeight: 'bold'}}>{header[value]}</HeaderTableText>
                                                </HeaderTableTitle>
                                                <HeaderTableTextInput style={{width: 450}}>
                                                    <HeaderTableText>{getHeaderTableValue(row, value)}</HeaderTableText>
                                                </HeaderTableTextInput>
                                            </>
                                        )}
                                    )}
                                </HeaderTable>
                            )
                        })}

                        <div style={{padding: '0 16px', width: 1776}}>
                            <ExcelTable
                                headerList={searchModalList.productToolInfo}
                                row={data}
                                setRow={(e) => setData([...e])}
                                width={1746}
                                rowHeight={32}
                                height={591}
                                setSelectRow={(e) => {
                                    setSelectRow(e)
                                }}
                                type={'searchModal'}
                                headerAlign={'center'}
                            />
                        </div>
                    </div>
                    <ModalButton buttonType={'readOnly'} closeButtonTitle={'확인'}  onClickCloseButton={onClickClose}/>
                </div>
            </Modal>
        </SearchModalWrapper>
    )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
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

export {ToolModal}

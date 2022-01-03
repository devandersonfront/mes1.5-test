import React, {useEffect, useState} from 'react';
import {IExcelHeaderType} from "../../common/@types/type";
import {UploadButton} from "../../styles/styledComponents";
import Modal from "react-modal";
// @ts-ignore
import IcX from "../../../public/images/ic_x.png";
import {TransferCodeToValue} from "../../common/TransferFunction";
import {ExcelTable} from "../Excel/ExcelTable";
import {searchModalList} from "../../common/modalInit";
import {POINT_COLOR} from "../../common/configset";
import styled from "styled-components";
import {MidRangeExcelTable} from "../Excel/MidRangeExcelTable";


interface IProps {
    column?: IExcelHeaderType
    row?: any
    onRowChange?: (e: any) => void
    modify?: boolean
}


const MidrangeFormReviewModal = ({column, row, onRowChange, modify}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
    const [searchKeyword, setSearchKeyword] = useState<string>('')

    useEffect(() => {
        if(isOpen) {
            if(row?.molds && row?.molds.length > 0){
                setSearchList(row.molds.map((v,i) => {
                    console.log("v : ", v)
                    return {
                        ...v,
                        ...v.mold,
                        seq: i+1
                    }
                }))
            }
        }
    }, [isOpen, searchKeyword])

    const changeRow = (row: any, key?: string) => {
        let tmpData = {
            ...row,
            machine_id: row.name,
            machine_idPK: row.machine_id,
            manager: row.manager ? row.manager.name : null
        }

        return tmpData
    }


    const ModalContents = () => {
        if(row?.molds){
            if(row.molds.length){
                return <>
                    <div style={{
                        padding: '3.5px 0px 0px 3.5px',
                        width: 112
                    }}>
                        <Button onClick={() => {
                            setIsOpen(true)
                        }}>
                            <p>금형 수정</p>
                        </Button>
                    </div>
                </>
            }else{
                return <>
                    <div style={{
                        padding: '3.5px 0px 0px 3.5px',
                        width: '100%'
                    }}>
                        <UploadButton onClick={() => {
                            setIsOpen(true)
                        }}>
                            <p>금형 등록</p>
                        </UploadButton>
                    </div>
                </>
            }
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
                    height: 800
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
                        }}>초ㆍ중ㆍ종 검사 양식 검토</p>
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
                    <div style={{padding: '0 16px', width: 1776, height: '80px'}}>
                        <ExcelTable
                            headerList={searchModalList.midrangeInfo}
                            row={searchList ?? [{}]}
                            setRow={(e) => setSearchList([...e])}
                            width={1746}
                            rowHeight={32}
                            height={552}
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
                    <div style={{padding: '0 16px', width: 1776}}>
                        <MidRangeExcelTable/>
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
  margin-right: 70px;
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

export {MidrangeFormReviewModal};

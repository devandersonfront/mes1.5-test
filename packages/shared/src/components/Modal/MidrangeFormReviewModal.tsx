import React, {useEffect, useState} from 'react';
import {IExcelHeaderType} from "../../@types/type";
import {UploadButton} from "../../styles/styledComponents";
import Modal from "react-modal";
// @ts-ignore
import IcX from "../../../public/images/ic_x.png";
import {TransferCodeToValue} from "../../common/TransferFunction";
import {ExcelTable} from "../Excel/ExcelTable";
import {searchModalList} from "../../common/modalInit";
import {POINT_COLOR} from "../../common/configset";
import styled from "styled-components";
import {MidrangeExcelTable} from "../Excel/MidrangeExcelTable";
import {MidrangeExcelFrameTable} from "../Excel/MidrangeExcelFrameTable";


interface IProps {
    data: any
    isOpen: boolean
    setIsOpen?: (isOpen: boolean) => void
}

const MidrangeFormReviewModal = ({ data, isOpen, setIsOpen}: IProps) => {
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<Array<any>>()

    useEffect(() => {
        document.body.style.cssText = `
            position:fixed;
            width: 100%;
            height: 100%;
        `
        return () => {
            document.body.style.cssText = `
            position:static;
        `
        }
    }, [ ])


    React.useEffect(()=>{
        setSearchList([...data.basic])
    },[data])
    return (
        <SearchModalWrapper >
            <Modal isOpen={isOpen} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 0,
                    width: 1793,
                    height: 800,
            },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                }
            }}
                   ariaHideApp={false}
            >
                <div style={{ display:'flex', justifyContent:'space-between', flexDirection:'column',height:'100%'
                }}>
                    <div style={{overflowY:'auto'}}>
                        <div style={{
                            margin: '24px 16px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
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
                        <div style={{padding: '0 16px', height: '80px', width: 1776}}>
                            <ExcelTable
                                headerList={searchModalList.midrangeInfo}
                                row={searchList ?? [{}]}
                                setRow={(e) => setSearchList([...e])}
                                width={1746}
                                rowHeight={32}
                                height={552}
                                onRowClick={(clicked) => {const rowIdx = searchList.indexOf(clicked)
                                    if(!searchList[rowIdx]?.border){
                                        const newSearchList = searchList.map((v,i)=> ({
                                            ...v,
                                            border : i === rowIdx
                                        }))
                                        setSearchList(newSearchList)
                                        setSelectRow(rowIdx)
                                    }
                                }}
                                type={'searchModal'}
                                headerAlign={'center'}
                            />
                        </div>
                        <div style={{padding: '0 16px' }}>
                            <MidrangeExcelTable formReviewData={data} />
                        </div>
                    </div>
                    <div
                        onClick={() => {
                            setIsOpen(false)
                        }}
                        style={{width: "100%", height: 40, marginTop: 10, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center', cursor:'pointer'}}
                    >
                        <p>확인</p>
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

export {MidrangeFormReviewModal};

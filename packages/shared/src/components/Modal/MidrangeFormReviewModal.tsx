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
import {MidrangeExcelTable} from "../Excel/MidrangeExcelTable";
import {MidrangeExcelFrameTable} from "../Excel/MidrangeExcelFrameTable";
import {RequestMethod} from "../../common/RequestFunctions";


interface IProps {
    formReviewData: any
    isOpen: boolean
    setIsOpen?: (isOpen: boolean) => void
    modify: boolean
}


const MidrangeFormReviewModal = ({ formReviewData, isOpen, setIsOpen, modify}: IProps) => {
    const [selectRow, setSelectRow] = useState<number>()
    const [ midrangeUpdate, setMidrangeUpdate] = useState<boolean>(false)
    const [searchList, setSearchList] = useState<Array<any>>()
    const [ midrangeData, setMidrangeData ] = useState({
        inspection_time: {},
        inspection_result: {},
        legendary_list: [],
        inspection_info: {},
        sic_id: '',
        record_id: '',
    })

    const recordInspectFrameSave = async () => {

        const inspection_info_beginning = midrangeData.inspection_info.beginning.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_info_middle = midrangeData.inspection_info.middle.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_info_end = midrangeData.inspection_info.end.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_result_beginning = midrangeData.inspection_result.beginning.filter((v)=>v)
        const inspection_result_middle = midrangeData.inspection_result.middle.filter((v)=>v)
        const inspection_result_end = midrangeData.inspection_result.end.filter((v)=>v)


        midrangeData.inspection_info = {
            beginning: inspection_info_beginning,
            middle: inspection_info_middle,
            end: inspection_info_end
        }
        midrangeData.inspection_result = {
            beginning: inspection_result_beginning,
            middle: inspection_result_middle,
            end: inspection_result_end
        }


        const res = await RequestMethod('post', `recordInspectSave`,{
            sic_id: midrangeData.sic_id,
            record_id: midrangeData.record_id,
            writer: {
                additional: [],
                appointment: "사원",
                authority: 6,
                ca_id: {ca_id: 6, name: "TEST", factor: 0, authorities: [], version: 9},
                company: "4HW59P",
                email: "123@naver.com",
                id: "123",
                name: "이예서",
                password: "$2a$10$jb36R0D7Nb.mf5aFHeRgiOmzsPWxRu0JHbDBqXSTmvj4.3t5n78Fi",
                profile: null,
                serviceAddress: "33aa5f3dc650/192.168.128.38:8080",
                sync: "member83",
                telephone: "010-000-0000",
                token: null,
                user_id: 83,
                version: 1
            },
            inspection_time: midrangeData.inspection_time,
            inspection_result: midrangeData.inspection_result,
            legendary_list: midrangeData.legendary_list,
            inspection_info: midrangeData.inspection_info
        })
    }


    const recordInspectFrameUpdate = async () => {

        const inspection_info_beginning = midrangeData.inspection_info.beginning.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_info_middle = midrangeData.inspection_info.middle.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_info_end = midrangeData.inspection_info.end.map((v)=>{
            const dataResultEnd = v.data_result.filter((v)=>v)
            return {...v, data_result: dataResultEnd }
        })

        const inspection_result_beginning = midrangeData.inspection_result.beginning.filter((v)=>v)
        const inspection_result_middle = midrangeData.inspection_result.middle.filter((v)=>v)
        const inspection_result_end = midrangeData.inspection_result.end.filter((v)=>v)


        midrangeData.inspection_info = {
            beginning: inspection_info_beginning,
            middle: inspection_info_middle,
            end: inspection_info_end
        }
        midrangeData.inspection_result = {
            beginning: inspection_result_beginning,
            middle: inspection_result_middle,
            end: inspection_result_end
        }


        const res = await RequestMethod('post', `recordInspectSave`,{
            version: midrangeData.version,
            sic_id: midrangeData.sic_id,
            record_id: midrangeData.record_id,
            writer: {
                user_id: 60,
                company: "4HW59P",
                name:"김연수",
                appointment:"대리",
                telephone:"0102412141",
                email:"youngineng@youngineng.com",
                authority:20,
                ca_id:{
                    ca_id:20,
                    name:"QC",
                    factor:0.0,
                    authorities:[

                    ],
                    version:0
                }
            },
            inspection_time: midrangeData.inspection_time,
            inspection_result: midrangeData.inspection_result,
            legendary_list: midrangeData.legendary_list,
            inspection_info: midrangeData.inspection_info
        })
    }

    React.useEffect(()=>{
        setSearchList([...formReviewData.basic])
    },[formReviewData])

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
                        }}>초ㆍ중ㆍ종 검사 등록</p>
                        <div style={{display: 'flex'}}>
                            {modify &&
                                <Button onClick={()=>setMidrangeUpdate(true)}>
                                  <p>수정 하기</p>
                                </Button>
                            }
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
                        <MidrangeExcelFrameTable formReviewData={formReviewData}  inspectFrameData={(e)=>setMidrangeData(e)}/>
                    </div>
                </div>
                {modify ?
                    midrangeUpdate ?
                        <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
                            <div
                                onClick={() => {
                                    setIsOpen(false)
                                }}
                                style={{width: "50%", height: 40, color: '#717C90', backgroundColor: '#DFDFDF', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <p>취소</p>
                            </div>
                            <div
                                onClick={() => {
                                    recordInspectFrameUpdate()
                                }}
                                style={{width: "50%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <p>등록하기</p>
                            </div>
                        </div>
                        :
                        <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
                            <div
                                onClick={() => {
                                    setIsOpen(false)
                                }}
                                style={{width: "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <p>확인</p>
                            </div>
                        </div>
                    :
                    <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{width: "50%", height: 40, color: '#717C90', backgroundColor: '#DFDFDF', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>취소</p>
                        </div>
                        <div
                            onClick={() => {
                                    recordInspectFrameSave()
                            }}
                            style={{width: "50%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>등록하기</p>
                        </div>
                    </div>
                }
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

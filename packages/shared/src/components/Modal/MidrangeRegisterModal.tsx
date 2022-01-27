import React, {useState} from 'react';
import moment from "moment";
import {RequestMethod} from "../../common/RequestFunctions";
import Modal from "react-modal";
import IcX from "../../../public/images/ic_x.png";
import {ExcelTable} from "../Excel/ExcelTable";
import {searchModalList} from "../../common/modalInit";
import {MidrangeExcelTable} from "../Excel/MidrangeExcelTable";
import {POINT_COLOR} from "../../common/configset";
import styled from "styled-components";
import {MidrangeExcelFrameTable} from "../Excel/MidrangeExcelFrameTable";
import Notiflix from "notiflix";


interface IProps {
    formReviewData: any
    isOpen: boolean
    setIsOpen?: (isOpen: boolean) => void
    modify: boolean
}


const MidrangeRegisterModal = ({ formReviewData, isOpen, setIsOpen, modify}: IProps) => {
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


        midrangeData.inspection_time = {
            beginning: moment(midrangeData.inspection_time.beginning).format('YYYY-MM-DD[T]HH:mm:ss'),
            middle: moment(midrangeData.inspection_time.middle).format('YYYY-MM-DD[T]HH:mm:ss'),
            end: moment(midrangeData.inspection_time.end).format('YYYY-MM-DD[T]HH:mm:ss')
        }

        const res = await RequestMethod('post', `recordInspectSave`,{
            sic_id: midrangeData.sic_id,
            record_id: midrangeData.record_id,
            writer: midrangeData.writer,
            inspection_time: midrangeData.inspection_time,
            inspection_result: midrangeData.inspection_result,
            legendary_list: midrangeData.legendary_list,
            inspection_info: midrangeData.inspection_info
        })

        if(res){
            Notiflix.Loading.circle()
            setIsOpen(false)
            window.location.reload()
        }
    }


    const recordInspectFrameUpdate = async () => {

        const res = await RequestMethod('post', `recordInspectSave`,{
            version: midrangeData.version,
            sic_id: midrangeData.sic_id,
            record_id: midrangeData.record_id,
            writer: midrangeData.writer,
            inspection_time: midrangeData.inspection_time,
            inspection_result: midrangeData.inspection_result,
            legendary_list: midrangeData.legendary_list,
            inspection_info: midrangeData.inspection_info
        })

        if(res){
            Notiflix.Loading.circle()
            setIsOpen(false)
            window.location.reload()
        }
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
                        }}> {modify ? "초ㆍ중ㆍ종 검사 결과보기" : "초ㆍ중ㆍ종 검사 등록"}</p>
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


export {MidrangeRegisterModal};

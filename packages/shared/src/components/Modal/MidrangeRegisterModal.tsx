import React, { useEffect, useState } from 'react'
import moment from "moment";
import {RequestMethod} from "../../common/RequestFunctions";
import Modal from "react-modal";
//@ts-ignore
import IcX from "../../../public/images/ic_x.png";
import {ExcelTable} from "../Excel/ExcelTable";
import {searchModalList} from "../../common/modalInit";
import {POINT_COLOR} from "../../common/configset";
import styled from "styled-components";
import {MidrangeExcelFrameTable} from "../Excel/MidrangeExcelFrameTable";
import Notiflix from "notiflix";
import {MidrangeRecordRegister} from "../../@types/type";


interface IProps {
    data: any
    isOpen: boolean
    setIsOpen?: (isOpen: boolean) => void
    modify: boolean
    reload: () => void
}


const now = moment().format('YYYY-MM-DD[T]HH:mm:ss')
const MidrangeRegisterModal = ({ data, isOpen, setIsOpen, modify, reload}: IProps) => {
    const [ editPage, setEditPage] = useState<boolean>(false)
    const [ midrangeData, setMidrangeData ] = useState<MidrangeRecordRegister>({
        legendary_list: [],
        inspection_info: {beginning: [{samples: 1, data_result: []}], middle: [{samples: 1, data_result: [] }], end: [{samples: 1, data_result: [] }]},
        inspection_result: { beginning: [], middle: [], end: [] },
        inspection_time: {
            beginning: now,
            middle: now,
            end: now
        },
        writer: undefined,
        sic_id:'',
        record_id:undefined,
        version:undefined,
        samples: undefined
    })

    useEffect(() => {
        const newData = {
            ...data,
            inspection_result: modify ? data.inspection_result : midrangeData.inspection_result,
            inspection_time : modify ? data.inspection_time : midrangeData.inspection_time,
        }
        setMidrangeData(newData)
    }, [])


    const readOnly = modify && !editPage

    const saveResult = async () => {
        Notiflix.Loading.circle()
        await RequestMethod('post', `recordInspectSave`,{
            sic_id: midrangeData.sic_id,
            record_id: midrangeData.record_id,
            writer: {...midrangeData.writer, additional: []},
            inspection_time: midrangeData.inspection_time,
            inspection_result: midrangeData.inspection_result,
            legendary_list: midrangeData.legendary_list,
            inspection_info: midrangeData.inspection_info
        })

        Notiflix.Loading.remove()
    }

    const onClose = () => {
        setEditPage(false)
        setIsOpen(false)
    }


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
                },

            }}>
                <div style={{width: 1760, height: 800, display:'flex', flexDirection:'column', justifyContent: 'space-between'}}>
                    <div style={{overflowY: 'visible'}}>
                        <ModalTitle>
                            <p style={{
                                color: 'black',
                                fontSize: 22,
                                fontWeight: 'bold',
                                margin: 0,
                            }}> {modify ? "초ㆍ중ㆍ종 검사 결과보기" : "초ㆍ중ㆍ종 검사 등록"}</p>
                            <div style={{display: 'flex', flex: modify && !editPage ? .1 : 0, justifyContent:'space-between'}}>
                                {modify && !editPage &&
                                    <Button onClick={()=> setEditPage(true)}>
                                        <p>수정 하기</p>
                                    </Button>
                                }
                                <div style={{cursor: 'pointer', display:'flex', alignItems:'center'}} onClick={onClose}>
                                    <img style={{width: 20, height: 20}} src={IcX}/>
                                </div>
                            </div>
                        </ModalTitle>
                        <ExcelTable
                            headerList={searchModalList.midrangeInfo}
                            row={data.basic ?? [{}]}
                            width={1728}
                            height={80}
                            rowHeight={32}
                            type={'searchModal'}
                            headerAlign={'center'}
                        />
                        <div style={{padding: '0 16px'}}>
                            { midrangeData.record_id && <MidrangeExcelFrameTable modalData={midrangeData} setModalData={setMidrangeData} readOnly={readOnly} hasResult={modify}/>}
                        </div>
                    </div>
                    {
                      readOnly ?
                              <div
                                onClick={onClose}
                                style={{height: 40, marginTop:10, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <p>확인</p>
                              </div>
                          :
                          <div style={{ height: 40, marginTop: 10, display:'flex'}}>
                              <div
                                onClick={onClose}
                                style={{flex:.5,height: 40, color: '#717C90', backgroundColor: '#DFDFDF', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                              >
                                  <p>취소</p>
                              </div>
                              <div
                                onClick={() => {
                                    saveResult()
                                    Notiflix.Report.success("저장되었습니다.","","확인", () => {onClose()
                                    reload && reload()})
                                }}
                                style={{flex:.5, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                              >
                                  <p>등록하기</p>
                              </div>
                          </div>
                    }
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

const ModalTitle = styled.div`
    padding: 16px 16px 16px;
    display: flex;
    justify-content:space-between;
    align-items:center;
`;

export {MidrangeRegisterModal};

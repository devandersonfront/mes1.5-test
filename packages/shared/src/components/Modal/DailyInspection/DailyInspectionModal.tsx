import React, {useState} from "react"
import {LineBorderContainer} from "../../Formatter/LineBorderContainer";
import {POINT_COLOR} from "../../../common/configset";
//@ts-ignore
import IcSearchButton from "../../../../public/images/ic_search.png";
import {IExcelHeaderType} from "../../../common/@types/type";
import Modal from "react-modal";
//@ts-ignore
import IcX from "../../../../public/images/ic_x.png";
//@ts-ignore
import Search_icon from "../../../../public/images/btn_search.png";
import {ExcelTable} from "../../Excel/ExcelTable";
import {searchModalList} from "../../../common/modalInit";
import {PaginationComponent} from "../../Pagination/PaginationComponent";
import Notiflix from "notiflix";
import styled from "styled-components";

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const DailyInspectionModal = ({row, column, onRowChange}:IProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const ModalContents = () => {
        if(column.searchType === 'operation' && row.index !== 1){
            return <></>
        }

        if(column.disableType === 'record' && row.osd_id){
            return <div style={{width: '100%', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <p>{row[`${column.key}`]}</p>
            </div>
        }

        return <>
            <div style={{width: '100%', height: 32}} onClick={() => {
            }}>
                {
                    column.type === 'Modal'
                        ? <LineBorderContainer row={row} column={column} setRow={() => {}}/>
                        : row[`${column.key}`]
                }
            </div>
            <div style={{
                display: 'flex',
                backgroundColor: POINT_COLOR,
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => {
                setIsOpen(true)
            }}>
                <img style={{width: 16.3, height: 16.3}} src={IcSearchButton}/>
            </div>
        </>
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
                        marginTop: 24,
                        marginLeft: 16,
                        marginRight: 16,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <p style={{
                            color: 'black',
                            fontSize: 22,
                            fontWeight: 'bold',
                            margin: 0,
                        }}>일상 점검 리스트 양식 검토</p>
                        <div style={{cursor: 'pointer'}} onClick={() => {
                            setIsOpen(false)
                        }}>
                            <img style={{width: 20, height: 20}} src={IcX}/>
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
                                // if(selectRow !== undefined && selectRow !== null){
                                //     onRowChange({
                                //         ...row,
                                //         ...searchList[selectRow],
                                //         isChange: true
                                //     })
                                // }
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


export default DailyInspectionModal

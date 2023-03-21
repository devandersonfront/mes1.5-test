import React, {useEffect, useState} from "react"
import {ExcelTable} from "../Excel/ExcelTable";
import {POINT_COLOR, SF_AI_ADDRESS, SF_ENDPOINT} from "../../common/configset";
import {searchModalList} from "../../common/modalInit"
import Modal from "react-modal";
import {CellButton} from "../../styles/styledComponents";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import axios from "axios";
import cookie from "react-cookies";
import {RequestMethod} from "../../common/RequestFunctions";
import Notiflix from "notiflix"
import {Select} from "@material-ui/core";
import {MoldRegisterModal} from "./MoldRegisterModal";
//@ts-ignore
import IcX from "../../../public/images/ic_x.png";

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
}

const AiCompareModal =  ({row, column, setRow}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [basic, setBasic] = useState<any[]>([])
    const [selectRow, setSelectRow] = useState<number>(null)
    useEffect(() => {
        if(isOpen){
            Notiflix.Loading.standard()
            axios.get(`${SF_AI_ADDRESS}/api/product_info/pair/${row.product_id}`,
                {'headers': {'Authorization': cookie.load('userInfo').token},}
            )
                .then((res) => {
                    RequestMethod("get", "aipProductLoad",{
                        params:{product_ids:[res.data.product_id, res.data.pair_product_id]}
                    })
                        .then((res) => {
                            let tmpBasic = res?.map((product, index) => {
                                return (
                                    {
                                        id: product.product_id,
                                        confirm_product:product.product_id,
                                        aor_id:row.ai_operation_record_id,
                                        predictionModel: product?.model?.model ?? "-",
                                        predictionCode: product.code,
                                        predictionName: product.name,
                                        predictionProcess: product.process.name,
                                        ranking:index+1,
                                        border:product.product_id == row.product_id
                                    }
                                )
                            })
                            setBasic(tmpBasic)
                            Notiflix.Loading.remove()
                        })
                })
        }
    }, [isOpen])

    const content = () => {
        return (
                <CellButton style={{width:"100%", height:"100%"}} disabled={!row.has_pair} onClick={() => {
                    if(row.has_pair){
                        setIsOpen(true)
                        row.setModalOpen()
                    }
                }}>
                    예측 품목 변경
                </CellButton>
        )
    }

    const ContentHeader = () => {
        return <div id={'content-header'} style={{
            marginTop: 24,
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div id={'content-title'} style={{display: 'flex'}}>
                <p style={{
                    color: 'black',
                    fontSize: 22,
                    fontWeight: 'bold',
                    margin: 0,
                }}>예측 순위</p>

            </div>
            <div id={'content-close-button'} style={{display: 'flex'}}>
                {/*{*/}
                {/*    column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {*/}
                {/*        LoadBasic(1)*/}
                {/*    }}/>*/}
                {/*}*/}
                <div className={'img_wrapper unprintable'} style={{cursor: 'pointer', marginLeft: 22}} onClick={() => {
                    setIsOpen(false)
                }}>
                    <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
            </div>
        </div>
    }

    const confirmFunction = () => {
        if(selectRow !== null && row.product_id !== basic[selectRow].product_id){
            Notiflix.Loading.standard()
            RequestMethod("post", "aiRecordConfirm", {aor_id:basic[selectRow].aor_id, confirm_product:basic[selectRow].confirm_product})
                .then((res) => {
                    Notiflix.Loading.remove()
                    Notiflix.Report.success("저장됐습니다.","","확인", () => {
                        row.setModalOpen()
                        setIsOpen(false)
                    })
                })
            return
        }
        row.setModalOpen()
        setIsOpen(false)

    }

    return (
        <div>
            {content()}
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
                    zIndex: 5,
                }
            }}>
                <div style={{
                    width: 1776,
                    height: 816,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    {/*<div id={'content-root'}>*/}
                    {ContentHeader()}
                        <ExcelTable
                            resizable
                            headerList={searchModalList.aiPredictionProduct}
                            row={basic}
                            width={1744}
                            rowHeight={32}
                            height={640}
                            onRowClick={(clicked) => {
                                const e = basic.indexOf(clicked)
                                const update = basic.map(
                                        (row, index) => {
                                            return {
                                                ...row,
                                                border: index === e
                                            }
                                    }
                                );
                                setBasic(update)
                                setSelectRow(e)
                            }}
                            type={'searchModal'}
                            // scrollEnd={(value) => {}}
                        />
                    {/*</div>*/}
                    <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
                        <FooterButton
                            onClick={() => {
                                setIsOpen(false)
                                row.setModalOpen()
                            }}
                            style={{backgroundColor: '#E7E9EB'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </FooterButton>
                        <FooterButton
                            onClick={confirmFunction}
                            style={{backgroundColor: POINT_COLOR}}
                        >
                            <p style={{color: '#0D0D0D'}}>등록하기</p>
                        </FooterButton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

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


export {AiCompareModal}

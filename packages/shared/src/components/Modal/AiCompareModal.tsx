import React, {useEffect, useState} from "react"
import {ExcelTable} from "../Excel/ExcelTable";
import {POINT_COLOR, SF_ENDPOINT} from "../../common/configset";
import {searchModalList} from "../../common/modalInit"
import Modal from "react-modal";
import {CellButton} from "../../styles/styledComponents";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import axios from "axios";
import cookie from "react-cookies";
import {RequestMethod} from "../../common/RequestFunctions";
import Notiflix from "notiflix"

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
        console.log('row : ', row)
        if(isOpen){
            console.log(isOpen)
            axios.get(`http://220.126.8.137:3000/api/product_info/pair/${row.product_id}`,
                {'headers': {'Authorization': cookie.load('userInfo').token},}
            )
                .then((res) => {
                    console.log(res)
                    RequestMethod("get", "aipProductLoad",{
                        params:{product_ids:[res.data.product_id, res.data.pair_product_id]}
                    })
                        .then((res) => {
                            console.log(res)

                            let tmpBasic = res.map((product, index) => {
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
                                    }
                                )
                            })
                            setBasic(tmpBasic)
                        })
                })
        }
    }, [isOpen])

    const content = () => {
        return (
            <div>
                <CellButton onClick={() => {
                    setIsOpen(true)
                }}>
                    예측
                </CellButton>
            </div>
        )
    }

    const confirmFunction = () => {
        Notiflix.Loading.standard()
        RequestMethod("post", "aiRecordConfirm", {aor_id:basic[selectRow].aor_id, confirm_product:basic[selectRow].confirm_product})
            .then((res) => {
                Notiflix.Loading.remove()
                Notiflix.Report.success("저장됐습니다.","","확인", () => {
                    row.onOpen()
                    setIsOpen(false)
                })
            })

    }

    return (
        <div >
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
                                console.log(row.setModalOpen)
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

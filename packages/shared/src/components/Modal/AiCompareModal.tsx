import React, {useEffect, useState} from "react"
import {ExcelTable} from "../Excel/ExcelTable";
import {POINT_COLOR} from "../../common/configset";
import {searchModalList} from "../../common/modalInit"
import Modal from "react-modal";
import {CellButton} from "../../styles/styledComponents";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import axios from "axios";
import cookie from "react-cookies";

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
}

const AiCompareModal =  ({row, column, setRow}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    console.log(row, column)
    useEffect(() => {
        if(isOpen){
            axios.get("http://dev-sizl-ai-backend-lb-1626843213.ap-northeast-2.elb.amazonaws.com/api/product_info/pair/322",
                {'headers': {'Authorization': cookie.load('userInfo').token},}
            )
                .then((res) => {
                    console.log(res)
                })
        }
    })
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
                            row={[{}]}
                            width={1744}
                            rowHeight={32}
                            height={640}
                            onRowClick={(clicked) => {
                            }}
                            type={'searchModal'}
                            // scrollEnd={(value) => {}}
                        />
                    {/*</div>*/}
                    <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
                        <FooterButton
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{backgroundColor: '#E7E9EB'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </FooterButton>
                        <FooterButton
                            // onClick={confirmFunction}
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

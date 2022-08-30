import React, {useState} from 'react'
import styled from "styled-components"
import {IExcelHeaderType} from '../../@types/type'
import {CellButton, FooterButton, ModalTextArea} from '../../styles/styledComponents'
import Modal from 'react-modal'
import {TitleTextArea} from "../TextAreaBox/TitleTextArea";

interface IProps {
    row: any
    column: IExcelHeaderType
}

const ReturnButton = ({row, column}: IProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [remark, setRemark] = useState<string>()
    const returnButton = () => {
        return <CellButton
                    onClick={() => {
                        setIsOpen(true)
                    }}
                >{column.name}</CellButton>
    }

    return (
        <div style={{width:"100%", height:"100%", display:"flex", justifyContent:"center", alignItems:"center"}}>
            {returnButton()}

            {
                isOpen &&
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
                    <ModalArea>
                        <div>
                            <ModalTitle>반납</ModalTitle>
                            <HeaderTable>
                                <HeaderTableTitle>
                                    <HeaderTableText>품명</HeaderTableText>
                                </HeaderTableTitle>
                                <HeaderTableTextInput style={{width:"100%"}}>
                                    <HeaderTableText>
                                        {row?.name ?? "-"}
                                    </HeaderTableText>
                                </HeaderTableTextInput>
                            </HeaderTable>
                            <HeaderTable>
                                <div style={{display:"flex", width:"100%", justifyContent:"space-between"}}>
                                    <HeaderTableTitle>LOT</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width:"100%"}}>
                                        <HeaderTableText>
                                            {row.lot_number}
                                        </HeaderTableText>
                                    </HeaderTableTextInput>
                                </div>
                                {/*<div style={{display:"flex", width:"50%"}}>*/}
                                {/*    <HeaderTableTitle>수량</HeaderTableTitle>*/}
                                {/*    <HeaderTableTextInput style={{width:"200px"}}>*/}
                                {/*        <HeaderTableText>*/}
                                {/*            20*/}
                                {/*        </HeaderTableText>*/}
                                {/*    </HeaderTableTextInput>*/}
                                {/*</div>*/}
                            </HeaderTable>
                            <HeaderTable style={{height:"initial", display:"flex", alignItems:"flex-start"}}>
                                <HeaderTableTitle style={{marginTop:"5px"}}>사유</HeaderTableTitle>
                                <ModalTextArea style={{height:"90px", borderRadius:"5px", border:"0.5px solid #B3B3B3"}} onBlur={(e) => {
                                    console.log(e.target.value)
                                    setRemark(e.target.value)
                                }}/>
                            </HeaderTable>
                        </div>
                        <div style={{display:"flex", width:"100%"}}>
                            <FooterButton onClick={() => {
                                setIsOpen(false)
                            }} style={{background:"rgb(179, 179, 179)"}}>
                                취소
                            </FooterButton>
                            <FooterButton onClick={() => {
                                row.onClickReturnEvent(row, remark)
                            }} style={{background:"cyan"}}>
                                확인
                            </FooterButton>
                        </div>
                    </ModalArea>
                </Modal>
            }
        </div>
    );
}

const ModalArea = styled.div`
    width:500px;
    height:300px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    flex-direction:column;
`;

const ModalTitle = styled.div`
    width:100%;
    height:50px;
    display:flex;
    justify-content:center;
    align-items:center;
    font-size:1.5em;
`

const HeaderTable = styled.div`
  width: 450px;
  height: 32px;
  margin-bottom: 16px;
  background-color: #F4F6FA;
  // border: 0.5px solid #B3B3B3;
  display: flex
`

const HeaderTableTextInput = styled.p`
  background-color: #ffffff;
  padding-left: 3px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  // margin-right: 70px;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 60px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export {ReturnButton};

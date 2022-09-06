import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {IExcelHeaderType} from '../../@types/type'
import {CellButton, FooterButton, ModalTextArea} from '../../styles/styledComponents'
import Modal from 'react-modal'
import {TitleTextArea} from "../TextAreaBox/TitleTextArea";
import NotTableDropdown from "../Dropdown/NotTableDropdown";

interface IProps {
    row: any
    column: IExcelHeaderType
}

const ReturnButton = ({row, column}: IProps) => {
    console.log("row : ", row)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [rowData, setRowData] = useState<any>({})
    const [remarkFormOpen, setRemarkFormOpen] = useState<boolean>(false)
    const returnButton = () => {
        return <CellButton
                    onClick={() => {
                        setIsOpen(true)
                    }}
                >{column.name}</CellButton>
    }

    useEffect(() => {
        if(row?.rmId){
            // 자재_lot_pk : lm_id(number)
            // 자재_pk : material_id(number)
            // 자재타입 : material_type(number) // 0: 원자재, 1:부자재
            // 출고타입 : export_type(number) // 0: 생산, 1: 반품, 2: 판매, 3: 기타
            // 수량 : count(number)

            rowData["material_type"] = 0
            rowData["lm_id"] = row.lot_rm_id
            rowData["material_id"] = row.rmId

        }
        // setRowData(rowData)
    },[])

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
                                <div style={{display:"flex", width:"50%", justifyContent:"space-between"}}>
                                    <HeaderTableTitle>LOT</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width:"200px"}}>
                                        <HeaderTableText>
                                            {row.lot_number}
                                        </HeaderTableText>
                                    </HeaderTableTextInput>
                                </div>
                                <div style={{display:"flex", width:"50%"}}>
                                    <HeaderTableTitle>수량</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width:"200px"}}>
                                        <input style={{border:"none", width:"100%", height:"100%"}} type={"number"} onBlur={(e) => {
                                            console.log(e.target.value)
                                            setRowData({...rowData, count: Number(e.target.value)})
                                        }}/>
                                    </HeaderTableTextInput>
                                </div>
                            </HeaderTable>
                            <HeaderTable style={{height:"initial", display:"flex", alignItems:"flex-start"}}>
                                <HeaderTableTitle style={{marginTop:"5px"}}>사유</HeaderTableTitle>
                                <NotTableDropdown options={[
                                    {title:"반납", value:1},
                                    {title:"판매", value:2},
                                    {title:"기타", value:3},
                                ]} onChangeEvent={(option) => {
                                    setRowData({...rowData, export_type: option.value})
                                    if(option.value == 3) setRemarkFormOpen(true)
                                    else setRemarkFormOpen(false)
                                }} />
                            </HeaderTable>

                            {remarkFormOpen &&
                                <HeaderTable style={{height:"initial", display:"flex", alignItems:"flex-start"}}>
                                    <HeaderTableTitle style={{marginTop:"5px"}}>내용</HeaderTableTitle>
                                    <ModalTextArea style={{height:"90px", borderRadius:"5px", border:"0.5px solid #B3B3B3"}} onBlur={(e) => {
                                        // setRemark(e.target.value)
                                        setRowData({...rowData, remark: e.target.value})
                                    }}/>
                                </HeaderTable>
                            }
                        </div>
                        <div style={{display:"flex", width:"100%"}}>
                            <FooterButton onClick={() => {
                                setIsOpen(false)
                            }} style={{background:"rgb(179, 179, 179)"}}>
                                취소
                            </FooterButton>
                            <FooterButton onClick={() => {

                                row.onClickReturnEvent(rowData)
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
    min-height:300px;
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

import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {IExcelHeaderType} from '../../@types/type'
import {CellButton, FooterButton, ModalTextArea} from '../../styles/styledComponents'
import Modal from 'react-modal'
import NotTableDropdown from "../Dropdown/NotTableDropdown";
import {TransferValueToCode} from "../../common/TransferFunction";
import Notiflix from "notiflix"
import {TransferType} from "../../common/Util";

interface IProps {
    row: any
    column: IExcelHeaderType
}

const ExportButton = ({row, column}: IProps) => {
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
            rowData["lot_raw_material"] = row
            rowData["material_type"] = 0

        }else{
            setRowData(row)
        }

        if(row.export_type === "기타") setRemarkFormOpen(true)
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
                            <ModalTitle>출고</ModalTitle>
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
                                    <HeaderTableTitle>{TransferType(row.type ?? row.sub_material?.unit ?? row.lot_sub_material?.sub_material?.unit)}</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width:"200px"}}>
                                        <input style={{border:"none", width:"100%", height:"100%"}} defaultValue={column.state == "edit" ? row.count : 0} type={"number"} onBlur={(e) => {
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
                                }} selectData={row.export_type}
                                />
                            </HeaderTable>
                            {remarkFormOpen &&
                                <HeaderTable style={{height:"initial", display:"flex", alignItems:"flex-start"}}>
                                    <HeaderTableTitle style={{marginTop:"5px"}}>내용</HeaderTableTitle>
                                    <ModalTextArea style={{height:"90px", borderRadius:"5px", border:"0.5px solid #B3B3B3"}} onBlur={(e) => {
                                        setRowData({...rowData, remark: e.target.value})
                                    }} defaultValue={row.remark}
                                    />
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
                                if(!rowData.count ||rowData.count <= 0){
                                    Notiflix.Report.warning("경고","수량은 양수여야 합니다.","확인",() => setIsOpen(false))
                                    return
                                }
                                if(!rowData.export_type){
                                    rowData.export_type = 1
                                }else if(isNaN(Number(rowData.export_type))){
                                    rowData.export_type = TransferValueToCode(rowData.export_type, "export")
                                }
                                row.onClickReturnEvent(rowData, setIsOpen)
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

export {ExportButton};

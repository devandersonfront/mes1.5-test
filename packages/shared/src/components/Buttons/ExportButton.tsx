import React, {useEffect, useState} from 'react'
import styled from "styled-components"
import {IExcelHeaderType} from '../../@types/type'
import {CellButton, FooterButton, ModalTextArea} from '../../styles/styledComponents'
import Modal from 'react-modal'
import NotTableDropdown from "../Dropdown/NotTableDropdown";
import { TransferEngToKor, TransferValueToCode } from '../../common/TransferFunction'
import Notiflix from "notiflix"
import { POINT_COLOR } from '../../common/configset'
import moment from 'moment'
import Calendar from 'react-calendar'
//@ts-ignore
import Calendar_icon from '../../../public/images/calendar_icon_black.png'

interface IProps {
    row: any
    column: IExcelHeaderType
}

const ExportButton = ({row, column}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [rowData, setRowData] = useState<any>({})
    const [remarkFormOpen, setRemarkFormOpen] = useState<boolean>(false)
    const [calendarOpen, setCalendarOpen] = useState<boolean>(false)
    const [selectDate, setSelectDate] = useState<string>(moment().format('YYYY-MM-DD'))
    const noStock = column.action === 'register' && row?.current === 0
    const returnButton = () => {
        return <CellButton style={{opacity: noStock || row.readonly ? .3: 1}}
                    onClick={() => {
                        if(noStock){
                            Notiflix.Report.warning('경고', '재고가 없습니다.', '확인')
                        } else if(row.readonly) {
                            row.onClickReturnEvent()
                        } else {
                            setIsOpen(true)
                        }
                    }}
                >{column.name} 하기</CellButton>
    }
    useEffect(() => {
        if(isOpen){
            if(column.type === 'rawMaterial' && column.action === 'register'){
                rowData["lot_raw_material"] = row
                rowData["material_type"] = 0
            }else{
                row.date && setSelectDate(row.date)
                setRowData(row)
            }

            if(row.export_type === "기타") setRemarkFormOpen(true)
        }
    },[isOpen])

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
                            <ModalTitle>{TransferEngToKor(column.type)} 출고</ModalTitle>
                            <HeaderTable>
                                <HeaderTableTitle>
                                    <HeaderTableText>CODE</HeaderTableText>
                                </HeaderTableTitle>
                                <HeaderTableTextInput style={{width: 390}}>
                                    <HeaderTableText>{column.type === 'rawMaterial' ? row?.raw_material?.code : row?.sub_material?.code ?? "-"}</HeaderTableText>
                                </HeaderTableTextInput>
                            </HeaderTable>
                            <HeaderTable>
                                    <HeaderTableTitle>LOT</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width: 165}}>
                                        <HeaderTableText>
                                            {row.lot_number}
                                        </HeaderTableText>
                                    </HeaderTableTextInput>
                                    <HeaderTableTitle>출고량</HeaderTableTitle>
                                    <HeaderTableTextInput style={{width: 165}}>
                                        <input style={{border:"none", width:"100%", height:"100%"}} defaultValue={column.action == "modify" ? row.count : 0} type={"number"} onBlur={(e) => {
                                            if(column.action === 'register'){
                                                if(row.current < Number(e.target.value)) return Notiflix.Report.warning('경고', '재고량보다 출고량이 많습니다.','확인')
                                            }else {

                                            }
                                            setRowData({...rowData, count: Number(e.target.value)})
                                        }}/>
                                    </HeaderTableTextInput>
                            </HeaderTable>
                            <HeaderTable>
                                <HeaderTableTitle>
                                    <HeaderTableText>출고일</HeaderTableText>
                                </HeaderTableTitle>
                                <HeaderTableTextInput style={{width: 90}}>
                                    <HeaderTableText>{selectDate}</HeaderTableText>
                                </HeaderTableTextInput>
                                    <img className={'unprintable'} src={Calendar_icon} style={{width:32,height:32,fill:"black"}} onClick={() => setCalendarOpen(!calendarOpen)}/>

                                {
                                  calendarOpen &&  <div style={{position:"absolute",top:39, zIndex:1}} >
                                   <Calendar defaultView={"month"} minDate={column.action === 'register' ? new Date(row.date) : column.type === 'rawMaterial' ? new Date(row.lot_raw_material.date) : new Date(row.lot_sub_material.date)} onClickDay={(e)=>{
                                       const selectDate = moment(e).format('YYYY-MM-DD')
                                       setSelectDate(selectDate)
                                       setRowData({...rowData, date: selectDate})
                                       setCalendarOpen(false)
                                   }}/>
                                  </div>
                                }
                            </HeaderTable>
                            <HeaderTable>
                                <HeaderTableTitle>사유</HeaderTableTitle>
                                <NotTableDropdown options={[
                                    {title:"반품", value:1},
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
                                <HeaderTable style={{height:"90px"}}>
                                    <HeaderTableTitle>내용</HeaderTableTitle>
                                    <ModalTextArea style={{borderRadius:"5px", border:"0.5px solid #B3B3B3", width: 390}} onBlur={(e) => {
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
                                    Notiflix.Report.warning("경고","0 이상 입력해야합니다.","확인")
                                    return
                                }
                                if(!rowData.export_type){
                                    rowData.export_type = 1
                                }else if(isNaN(Number(rowData.export_type))){
                                    rowData.export_type = TransferValueToCode(rowData.export_type, "export")
                                }
                                row.onClickReturnEvent(rowData, setIsOpen)
                            }} style={{background:POINT_COLOR}}>
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
    min-height:350px;
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
  padding: 0 8px;
  display: flex;
  align-items: center;
  width: 60px;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export {ExportButton};

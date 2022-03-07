import React, {useEffect, useState} from "react"
//@ts-ignore
import IcSearchButton from "../../../../public/images/ic_search.png";
import Modal from "react-modal";
//@ts-ignore
import IcX from "../../../../public/images/ic_x.png";
//@ts-ignore
import Search_icon from "../../../../public/images/btn_search.png";
import {ExcelTable} from "../../Excel/ExcelTable";
import styled from "styled-components";
import {columnlist} from "../../../common/columnInit";
import DefaultImageProfile from "../../ImageProfile/DefaultImageProfile";
// import {DailyInspection} from "../../../../../basic/src/container/BasicDailyInspectionInfo";
import {TransferCodeToValue} from "../../../common/TransferFunction";


interface IProps {
    isOpen:boolean
    setIsOpen:(value:boolean) => void
    basicRow:any
    setBasicRow:(value:any) => void
    modalSelectOption?: { seq?: number, legendary?: string, content?: string, }[]
}

const DailyInspectionModal = ({isOpen, setIsOpen, basicRow, setBasicRow, modalSelectOption}:IProps) => {
    const changeSelectOption = () => {
        let options = columnlist.dailyInspectionCheckList;
        if(modalSelectOption){
            options.map((column) => {

                if(column.key === "type"){
                    // console.log(basicRow.check_list)
                    // basicRow.check_list.map((check) => {
                    //     if(typeof check.type === "string") column.formatter = TextEditor
                    // })
                    let changedOption = [];
                    modalSelectOption.map(({legendary, content, seq}, index) => {
                        if(legendary && content){
                            changedOption.push({pk:index, name:legendary, content:content})
                        }
                    })
                    column.selectList = changedOption
                }
            })
        }
    }
    //[basicRow.machine]
    const prettyMachineData =  (machine:any) => {
        console.log("machine : ", machine)
        machine.type = TransferCodeToValue(machine?.type, "machine");
        return [machine]
    }
    useEffect(() => {
        if(isOpen) changeSelectOption()
        console.log(basicRow)
    },[isOpen])

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
                    <BorderBox>
                        <Title>일상 점검 리스트</Title>
                        <ContentBox>
                            <ExcelTable headerList={columnlist.dailyInspectionModal} row={prettyMachineData(basicRow.machine)}
                                        setRow={(e) => {
                                            console.log("e : " ,e, basicRow)
                                            setBasicRow({...basicRow, machine:e[0]})
                                        }}
                                        type={"searchModal"} width={"100%"} height={80}/>
                            <ImageTable>
                                <DefaultImageProfile  title={"타이틀"} image={
                                    "https://sizl-resource2.s3.ap-northeast-2.amazonaws.com/"+basicRow.inspection_photo.machinePicture?.uuid
                                } style={{width:592, height: 366,display:"flex", justifyContent:"center", alignItems:"center"}}/>
                                <ImageGrid>
                                    {Object.values(basicRow.inspection_photo).map((value, index) =>{
                                        console.log("value : ", value, index)
                                        if(index){
                                            return(
                                                <DefaultImageProfile title={`부위0${index}`} image={value.uuid ?
                                                    "https://sizl-resource2.s3.ap-northeast-2.amazonaws.com/"+value.uuid
                                                    :
                                                    ""
                                                } style={{width:168, height:119, display:"flex", justifyContent:"center", alignItems:"center"}}/>
                                            )
                                        }
                                        })}
                                </ImageGrid>
                                <NoteBox>
                                    <LegendaryBox>
                                        <div style={{width:"100%", height:40, fontWeight:"bold", background:"#F4F6FA", display:"flex",justifyContent:"center", alignItems:"center"}}>범례</div>
                                        <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                                            <div style={{width:"50%", marginLeft:"15px"}}>
                                                {Object.values(basicRow.legendary_list).map((value, index) => {
                                                    if (index <= 4 && value["legendary"] !== "" && value["content"] !== "") return <span style={{display: "block"}}>{value["legendary"]} : {value["content"]}</span>
                                                })}
                                            </div>
                                            <div style={{width:"50%", marginLeft:"15px"}}>
                                                {Object.values(basicRow.legendary_list).map((value, index) => {
                                                    if(index > 4 && value["legendary"] !== "" && value["content"] !== "") return <span style={{display: "block"}}>{value["legendary"]} : {value["content"]}</span>

                                                })}
                                            </div>
                                        </div>
                                    </LegendaryBox>
                                    <ETCBox>
                                        <div style={{width:"100%", height:40, fontWeight:"bold", background:"#F4F6FA", display:"flex",justifyContent:"center", alignItems:"center"}}>기타 사항</div>
                                        <div style={{width:"100%", overflow:"auto", height:"100%", textOverflow:"ellipsis"}}>
                                            {console.log(basicRow)}
                                            {basicRow?.etc[0]?.etc ?? "-"}
                                        </div>
                                    </ETCBox>
                                </NoteBox>
                            </ImageTable>
                            <div style={{display:"flex",}}>
                                <ExcelTable
                                    headerList={columnlist.dailyInspectionCheckList}
                                    row={basicRow.check_list}
                                    width={"1104px"}
                                    height={basicRow.check_list.length * 40 >= 40*18+56 ? 40*19 : basicRow.check_list.length * 40 + 40}
                                    setRow={(e) => {
                                        console.log("e : ", e)
                                        setBasicRow({...basicRow, check_list:e})

                                    }}
                                    type={"searchModal"}/>
                                <ExcelTable
                                    headerList={columnlist.dailyInspectionManagement}
                                    row={[basicRow]}
                                    height={basicRow.check_list.length * 40 >= 40*18+56 ? 40*19 : basicRow.check_list.length * 40 + 40}
                                    setRow={(e) => {
                                        console.log("YEAH !!! : ", e)
                                        console.log(basicRow)
                                        basicRow.writer= e[0].worker;
                                        setBasicRow(basicRow)
                                    }}
                                    width={"553px"}
                                    type={"searchModal"}
                                    scrollOnOff
                                />
                            </div>

                        </ContentBox>
                    </BorderBox>
                </div>
            </Modal>
        </SearchModalWrapper>
    )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`
const BorderBox = styled.div`
 display:flex;
 justify-content:center;
 flex-direction: column;
 align-items:center;
 border:1px solid #B3B3B3;
 margin:0 15px;
`

const Title = styled.text`
 font-size:40px;
 font-weight:bold;
 padding-top:23px;
`

const ContentBox = styled.div`
 width:95%;
`

const ImageTable = styled.div`
    display:flex;
    justify-content:space-between;
`

const ImageGrid = styled.div`
    width:720px;
    display:grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
`

const NoteBox = styled.div`

`
const LegendaryBox = styled.div`
    border:1px solid #B3B3B3;
    width:280px;
    height:185px;
    display:flex;
    flex-direction:column;
    align-items:center;
`
const ETCBox = styled.div`
    border:1px solid #B3B3B3;
    width:280px;
    height:185px;
`

export default DailyInspectionModal

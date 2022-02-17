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
import {columnlist} from "../../../common/columnInit";
import DefaultImageProfile from "../../ImageProfile/DefaultImageProfile";

interface IProps {
    // column: IExcelHeaderType
    // row: any
    // onRowChange: (e: any) => void
    isOpen:boolean
    setIsOpen:(value:boolean) => void
}

const dummy = {key1:"data1",key2:"data2",key3:"data3",key4:"data4",key5:"data5",}
const dummyETC = "더미 ETC야!"
const DailyInspectionModal = ({isOpen, setIsOpen}:IProps) => {


    // const ModalContents = () => {
    //     if(column.searchType === 'operation' && row.index !== 1){
    //         return <></>
    //     }
    //
    //     if(column.disableType === 'record' && row.osd_id){
    //         return <div style={{width: '100%', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    //             <p>{row[`${column.key}`]}</p>
    //         </div>
    //     }
    //
    //     return <>
    //         <div style={{width: '100%', height: 32}} onClick={() => {
    //         }}>
    //             {
    //                 column.type === 'Modal'
    //                     ? <LineBorderContainer row={row} column={column} setRow={() => {}}/>
    //                     : row[`${column.key}`]
    //             }
    //         </div>
    //         <div style={{
    //             display: 'flex',
    //             backgroundColor: POINT_COLOR,
    //             width: 30,
    //             height: 30,
    //             justifyContent: 'center',
    //             alignItems: 'center'
    //         }} onClick={() => {
    //             setIsOpen(true)
    //         }}>
    //             <img style={{width: 16.3, height: 16.3}} src={IcSearchButton}/>
    //         </div>
    //     </>
    // }
    return (
        <SearchModalWrapper >
            {/*{ ModalContents() }*/}
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
                            <ExcelTable headerList={columnlist.dailyInspectionModal} row={[""]} setRow={() => {}} type={"searchModal"} width={"100%"} height={80}/>
                            <ImageTable>
                                <DefaultImageProfile  title={"타이틀"} style={{border:"1px solid blue", width:516}}/>
                                <ImageGrid>
                                    {new Array(9).fill("1").map((value) => <DefaultImageProfile title={"Yes"} style={{width:168, height:119, border:"1px solid"}}/>)}
                                </ImageGrid>
                                <NoteBox>
                                    <LegendaryBox>
                                        <div style={{width:"100%", height:40, border:"1px solid red"}}>범례</div>
                                        <div>
                                            {Object.keys(dummy).map((key) => <span style={{display:"block"}}>{key} : {dummy[key]}</span>)}
                                        </div>
                                    </LegendaryBox>
                                    <ETCBox>
                                        <div style={{width:"100%", height:40, border:"1px solid red", display:"flex",justifyContent:"center", alignItems:"center"}}>기타 사항</div>
                                        <div>
                                            {dummyETC}
                                        </div>
                                    </ETCBox>
                                </NoteBox>
                            </ImageTable>
                            <div>
                                {/*<ExcelTable headerList={} row={} setRow={} />*/}
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
 border:1px solid;
 margin:0 15px;
`

const Title = styled.text`
 font-size:40px;
 font-weight:bold;
 padding-top:23px;
`

const ContentBox = styled.div`
 border:1px solid blue;
 width:95%;
`

const ImageTable = styled.div`
    display:flex;
    justify-content:space-between;
`

const ImageGrid = styled.div`
    width:720px;
    border:1px solid;
    display:grid;
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
`

const NoteBox = styled.div`
    
`
const LegendaryBox = styled.div`
    border:1px solid;
    width:280px;
    height:180px;
`
const ETCBox = styled.div`
    border:1px solid;
    width:280px;
    height:180px;
`

export default DailyInspectionModal

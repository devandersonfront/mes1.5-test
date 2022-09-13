import React, {useEffect, useState} from "react"
import styled from "styled-components"
import Notiflix from "notiflix";
import {RequestMethod} from "../../../common/RequestFunctions";
import {UploadButton} from "../../../styles/styledComponents";
import Modal from "react-modal";
//@ts-ignore
import IcX from "../../../../public/images/ic_x.png";
import {ExcelTable} from "../../Excel/ExcelTable";
import {searchModalList} from "../../../common/modalInit";
import {POINT_COLOR} from "../../../common/configset";
import {IExcelHeaderType} from "../../../@types/type";


interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}


const InputInfoModal = ({column, row, onRowChange,}: IProps) =>{
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('기계')
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [selectRow, setSelectRow] = useState<number>()
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [searchList, setSearchList] = useState<any[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        if(isOpen) {
        }
    }, [isOpen, searchKeyword])


    const saveSubFactory = async () => {
        onRowChange(searchList)
        setIsOpen(false)
    }

    const deleteSubFactory = async() => {

    }

    const ModalContents = () => {
        // if(row.subFactories && row.subFactories.length > 0)
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
                        setIsOpen(true)
                    }}>
                        <p style={{textDecoration: 'underline'}}>문제사항등록</p>
                    </UploadButton>
                </div>
            </>)
        // }else{
        //     return (<>
        //         <div style={{
        //             padding: '3.5px 0px 0px 3.5px',
        //             width: '100%'
        //         }}>
        //             <UploadButton onClick={() => {
        //                 setIsOpen(true)
        //             }}>
        //                 <p>세분화 등록</p>
        //             </UploadButton>
        //         </div>
        //     </>)
        //
        // }
    }

    const getSummaryInfo = (info) => {
        if(column.key.includes("problem")){
            if(row.machine){
                return row.machine[info.key] ?? '-'
            }else if(row.mold){
                return row.mold[info.key] ?? '-'
            }
        }else{
            return row[info.key] ?? "-"
        }
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
                    height: 816,
                    display:"flex",
                    flexDirection:"column",
                    justifyContent:"space-between"
                }}>
                    <div style={{
                        margin: '24px 16px 16px',
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <p style={{
                            color: 'black',
                            fontSize: 22,
                            fontWeight: 'bold',
                            margin: 0,
                        }}>{column.title}</p>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                                setIsOpen(false)
                            }}>
                                <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                        </div>
                    </div>
                    {
                        column.headerItems && column.headerItems.map((infos, index) => {
                            return (
                                <HeaderTable>
                                    {
                                        infos.map(info => {
                                            return (
                                                <>
                                                    <HeaderTableTitle>
                                                        <HeaderTableText style={{fontWeight: 'bold'}}>{info.title}</HeaderTableText>
                                                    </HeaderTableTitle>
                                                    <HeaderTableTextInput style={{width: info.infoWidth}}>
                                                        <HeaderTableText>
                                                            {getSummaryInfo(info)}
                                                        </HeaderTableText>
                                                        {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}
                                                    </HeaderTableTextInput>
                                                </>
                                            )
                                        })
                                    }
                                </HeaderTable>
                            )
                        })
                    }

                    <div style={{display: 'flex', justifyContent: 'space-between', margin: '24px 48px 8px 16px'}}>
                        <div style={{fontSize:"22px"}}>{column.subTitle}</div>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={searchModalList.dailyInspectionProblemInfo}
                            row={searchList ?? [{}]}
                            setRow={(e) => {
                                let tmp: Set<any> = selectList
                                e.map(v => {
                                    if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                                })
                                setSelectList(tmp)
                                setSearchList([...e])
                            }}
                            width={1746}
                            rowHeight={32}
                            height={568}
                            // onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
                            //   setSelectRow(e)
                            // }}
                            selectList={selectList}
                            setSelectList={(e) => {
                                setSelectList(e as Set<number>);
                            }}
                            onRowClick={(clicked) => {const rowIdx = searchList.indexOf(clicked)
                                if(!searchList[rowIdx]?.border){
                                    const newSearchList = searchList.map((v,i)=> ({
                                        ...v,
                                        border : i === rowIdx
                                    }))
                                    setSearchList(newSearchList)
                                    setSelectRow(rowIdx)
                                }
                            }}
                            type={'searchModal'}
                            headerAlign={'center'}
                        />
                    </div>
                    {/*<div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>*/}
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>확인</p>
                        {/*</div>*/}
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

const Button = styled.button`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    
`;

const HeaderTable = styled.div`
  width: 1744px;
  height: 32px;
  margin: 0 16px;
  background-color: #F4F6FA;
  border: 0.5px solid #B3B3B3;
  display: flex
`

const HeaderTableTextInput = styled.div`
  background-color: #ffffff;
  padding-left: 3px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  margin-right: 62px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export default InputInfoModal

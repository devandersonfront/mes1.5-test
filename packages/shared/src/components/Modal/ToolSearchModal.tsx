import React, {useState} from 'react';
import {POINT_COLOR} from "../../common/configset";
//@ts-ignore
import IcSearchButton from "../../../public/images/ic_search.png";
import Modal from "react-modal";
import {Select} from "@material-ui/core";
import {MoldRegisterModal} from "./MoldRegisterModal";
//@ts-ignore
import IcX from "../../../public/images/ic_x.png";
//@ts-ignore
import Search_icon from "../../../public/images/btn_search.png";
import {ExcelTable} from "../Excel/ExcelTable";
import {searchModalList} from "../../common/modalInit";
import {SearchModalResult} from "../../Functions/SearchResultSort";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const ToolSearchModal = ({column, row, onRowChange}: IProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([{}])
    const [tab, setTab] = useState<number>(0)
    const [searchModalInit, setSearchModalInit] = useState<any>()
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    return (
        <SearchModalWrapper >
            <div style={ column.modalType
                ? {width: 'calc(100% - 32px)', height: 32, paddingLeft:8, opacity: row[`${column.key}`] ? 1 : .3}
                : {width: 'calc(100% - 40px)', height: 40, paddingLeft:8, opacity: row[`${column.key}`] ? 1 : .3}
            } onClick={() => {
                if(row.first || !column.disableType){
                    setIsOpen(true)
                }
            }}>
                {/*{getContents()}*/}
            </div>
            {(row.first || !column.disableType) &&
            <div style={{
                display: 'flex',
                backgroundColor: POINT_COLOR,
                width: column.modalType ? 30 : 38,
                height: column.modalType ? 30 : 38,
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => {
                setIsOpen(true)
            }}>
                <img style={column.modalType ? {width: 16.3, height: 16.3} : {width: 20, height: 20}} src={IcSearchButton}/>
            </div>
            }
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
                    zIndex: 5
                }
            }}>
                <div style={{
                    width: 1776,
                    height: 816,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{
                            marginTop: 24,
                            marginLeft: 16,
                            marginRight: 16,
                            marginBottom: 12,
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{display: 'flex'}}>
                                <p style={{
                                    color: 'black',
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    margin: 0,
                                }}>{searchModalInit && searchModalInit.title}</p>
                                {
                                    column.type === 'bom' && <div style={{marginLeft: 20}}>
                                        <Select value={tab} onChange={(e) => {
                                            setTab(Number(e.target.value))
                                        }}>
                                            <option value={0}>원자재</option>
                                            <option value={1}>부자재</option>
                                            <option value={2}>제품</option>
                                        </Select>
                                    </div>
                                }
                            </div>
                            <div style={{display: 'flex'}}>
                                {
                                    column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {
                                        // LoadBasic();
                                    }}/>
                                }
                                <div style={{cursor: 'pointer', marginLeft: 22}} onClick={() => {
                                    setIsOpen(false)
                                }}>
                                    <img style={{width: 20, height: 20}} src={IcX}/>
                                </div>
                            </div>
                        </div>
                        {column.type !== "searchToolModal" &&
                        <div style={{
                            width: '100%', height: 32, margin: '16px 0 16px 16px',
                            display: 'flex',
                        }}>
                            <div style={{
                                width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
                                borderRight: 'none',
                            }}>

                            </div>
                            <input
                                value={keyword ?? ""}
                                type={"text"}
                                placeholder="검색어를 입력해주세요."
                                onChange={(e) => {
                                    setKeyword(e.target.value)
                                    // setPageInfo({...pageInfo, page:1});
                                }}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter'){
                                        // setPageInfo({...pageInfo, page:1});
                                        // LoadBasic(1);
                                    }
                                }}
                                style={{
                                    width:1592,
                                    height:"32px",
                                    paddingLeft:"10px",
                                    border:"0.5px solid #B3B3B3",
                                    backgroundColor: 'rgba(0,0,0,0)'
                                }}
                            />
                            <div
                                style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                                onClick={() => {
                                    // LoadBasic();
                                }}
                            >
                                <img src={Search_icon} style={{width:"16px",height:"16px"}} />
                            </div>
                        </div>
                        }
                        <ExcelTable
                            headerList={searchModalInit && searchModalList[`${searchModalInit.excelColumnType}Search`]}
                            row={searchList ?? []}
                            setRow={() => {}}
                            width={1744}
                            rowHeight={32}
                            height={640}
                            onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 

                            }}
                            type={'searchModal'}
                        />
                    </div>
                    <div style={{ height: 40, display: 'flex', alignItems: 'flex-end',}}>
                        <FooterButton

                            style={{backgroundColor: '#E7E9EB'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </FooterButton>
                        <FooterButton

                            style={{backgroundColor: POINT_COLOR}}
                        >
                            <p style={{color: '#0D0D0D'}}>등록하기</p>
                        </FooterButton>
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

export {ToolSearchModal}

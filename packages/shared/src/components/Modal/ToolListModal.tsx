import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import {ExcelTable} from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const headerItems: {title: string, infoWidth: number, key: string, unit?: string}[][] = [
    [
        {title: '지시 고유번호', infoWidth: 144, key: 'identification'},
        {title: 'LOT 번호', infoWidth: 144, key: 'lot_number'},
        {title: '거래처', infoWidth: 144, key: 'customer'},
        {title: '모델', infoWidth: 144, key: 'model'},
    ],
    [
        {title: 'CODE', infoWidth: 144, key: 'code'},
        {title: '품명', infoWidth: 144, key: 'name'},
        {title: '품목 종류', infoWidth: 144, key: 'type'},
        {title: '생산 공정', infoWidth: 144, key: 'process'},
    ],
    [
        {title: '단위', infoWidth: 144, key: 'unit'},
        {title: '목표 생산량', infoWidth: 144, key: 'goal'},
        {title: '작업자', infoWidth: 144, key: 'worker_name'},
        {title: '양품 수량', infoWidth: 144, key: 'good_quantity'},
        {title: '불량 수량', infoWidth: 144, key: 'poor_quantity'},
    ],
]

const ToolListModal = ({column, row, onRowChange}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('기계')
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        if(isOpen) {
            if(!!row.tools && row.tools.length){
                setSearchList([...row.tools.map(v => {
                    return {
                        ...v,
                        ...v.tool,
                        ...v.tool.tool,
                    }
                })])
            }else{
                setSearchList([])
            }
        }
    }, [isOpen, searchKeyword])

    const changeRow = (row: any, key?: string) => {
        let tmpData = {
            ...row,
            machine_id: row.name,
            machine_idPK: row.machine_id,
            manager: row.manager ? row.manager.name : null
        }

        return tmpData
    }


    const getSummaryInfo = (info) => {
        return row[info.key] ?? '-'
    }

    const ModalContents = () => {
        return <>
            <div style={{
                width: '100%'
            }}>
                <div style={{
                    fontSize: '15px',
                    margin: 0,
                    padding: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: column.type === 'Modal' && '#0D0D0D',
                    background:row.border ? "#19B9DF80" : column.type === 'Modal' ? "white" : '#0000',
                }} onClick={() => {
                    setIsOpen(true)
                }}>
                    <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>공구 보기</p>
                </div>
            </div>
        </>
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
                    height: 800
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
                        }}>공구 정보 (해당 제품을 만드는데 사용인 공구는 아래와 같습니다.)</p>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                                setIsOpen(false)
                            }}>
                                <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                        </div>
                    </div>
                    {
                        headerItems && headerItems.map((infos, index) => {
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
                    <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
                        <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                            <div style={{ display: 'flex', width: 1200}}>
                                <p style={{fontSize: 22, padding: 0, margin: 0}}>공구 리스트</p>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
                        </div>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={searchModalList.toolList}
                            row={searchList ?? [{}]}
                            setRow={(e) => setSearchList([...e])}
                            width={1746}
                            rowHeight={32}
                            height={552}
                            // setSelectRow={(e) => {
                            //   setSelectRow(e)
                            // }}
                            setSelectRow={(e) => {
                                if(!searchList[e].border){
                                    searchList.map((v,i)=>{
                                        v.border = false;
                                    })
                                    searchList[e].border = true
                                    setSearchList([...searchList])
                                }
                                setSelectRow(e)
                            }}
                            type={'searchModal'}
                            headerAlign={'center'}
                        />
                    </div>
                    <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{width: "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>확인</p>
                        </div>
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
  margin-right: 70px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
`

const HeaderTableTitle = styled.div`
  width: 110px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {ToolListModal}

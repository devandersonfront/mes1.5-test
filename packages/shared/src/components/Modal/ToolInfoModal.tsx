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
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
    modify: boolean
}


const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
    [{title: '거래처', infoWidth: 144, key: 'customer_id'}, {title: '모델', infoWidth: 144, key: 'model'},],
    // [
    //     {title: 'CODE', infoWidth: 144, key: 'code'},
    //     {title: '품명', infoWidth: 144, key: 'name'},
    //     {title: '품목 종류', infoWidth: 144, key: 'type'},
    //     {title: '생산 공정', infoWidth: 144, key: 'process_id'},
    // ],
    // [{title: '단위', infoWidth: 144, key: 'unit'},{title: '목표 생산량', infoWidth: 144, key: 'goal'},],
]

const ToolInfoModal = ({column, row, onRowChange, modify}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('기계')
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [summaryData, setSummaryData] = useState<any>({})
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        if(isOpen) {
            if(row?.tools && row?.tools.length > 0){
                setSearchList(row.tools.map((v,i) => {
                    return {
                        ...v,
                        ...v.tool,
                        seq: i+1
                    }
                }))
            }
        }
    }, [isOpen, searchKeyword])


    const ModalContents = () => {
        // if(row?.tools){
        if(row.tools?.length){
            return <div style={{
                padding: '3.5px 0px 0px 3.5px',
                width: 112
            }}>
                <Button onClick={() => {
                    setIsOpen(true)
                }}>
                    <p>공구 수정</p>
                </Button>
            </div>

        }else{
            return <div style={{
                padding: '3.5px 0px 0px 3.5px',
                width: '100%'
            }}>
                <UploadButton onClick={() => {
                    setIsOpen(true)
                }}>
                    <p>공구 등록</p>
                </UploadButton>
            </div>
        }
        // }
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
                        }}>공구 정보 (해당 제품을 만드는데 필요한 공구를 등록해주세요)</p>
                        <div style={{display: 'flex'}}>
                            {/*<Button>*/}
                            {/*  <p>엑셀로 받기</p>*/}
                            {/*</Button>*/}
                            <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                                setIsOpen(false)
                            }}>
                                <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                        </div>
                    </div>
                    {/*{*/}
                    {/*    headerItems && headerItems.map((infos, index) => {*/}
                    {/*        console.log("infos : ", infos)*/}
                    {/*        return (*/}
                    {/*            <HeaderTable>*/}
                    {/*                {*/}
                    {/*                    infos.map(info => {*/}
                    {/*                        return (*/}
                    {/*                            <>*/}
                    {/*                                <HeaderTableTitle>*/}
                    {/*                                    <HeaderTableText style={{fontWeight: 'bold'}}>{info.title ?? "-"}</HeaderTableText>*/}
                    {/*                                </HeaderTableTitle>*/}
                    {/*                                <HeaderTableTextInput style={{width: info.infoWidth}}>*/}
                    {/*                                    <HeaderTableText>*/}
                    {/*                                        {row[info.key] ?? "-"}*/}
                    {/*                                        /!*-*!/*/}
                    {/*                                    </HeaderTableText>*/}
                    {/*                                    {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}*/}
                    {/*                                </HeaderTableTextInput>*/}
                    {/*                            </>*/}
                    {/*                        )*/}
                    {/*                    })*/}
                    {/*                }*/}
                    {/*            </HeaderTable>*/}
                    {/*        )*/}
                    {/*    })*/}
                    {/*}*/}
                    <HeaderTable>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>고객사명</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.customerArray ? row.customerArray.name : "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.modelArray ? row.modelArray.model : "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                    </HeaderTable>
                    <HeaderTable>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.code ?? "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.name ?? "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.type ? TransferCodeToValue(row.type, 'material') : "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>생산 공정</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.process ? row.process.name : "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                    </HeaderTable>
                    <HeaderTable>
                        <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
                        </HeaderTableTitle>
                        <HeaderTableTextInput style={{width: 144}}>
                            <HeaderTableText>{row.unit ?? "-"}</HeaderTableText>
                        </HeaderTableTextInput>
                    </HeaderTable>
                    <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
                        <Button onClick={() => {
                            let tmp = searchList

                            setSearchList([
                                ...searchList,
                                {
                                    seq: searchList.length+1
                                }
                            ])
                        }}>
                            <p>행 추가</p>
                        </Button>
                        <Button style={{marginLeft: 16}} onClick={() => {
                            if(selectRow === 0){
                                return
                            }
                            let tmpRow = searchList

                            let tmp = tmpRow[selectRow]
                            tmpRow[selectRow] = tmpRow[selectRow - 1]
                            tmpRow[selectRow - 1] = tmp

                            setSearchList([...tmpRow.map((v, i) => {
                                return {
                                    ...v,
                                    seq: i+1
                                }
                            })])
                        }}>
                            <p>위로</p>
                        </Button>
                        <Button style={{marginLeft: 16}} onClick={() => {
                            if(selectRow === searchList.length-1){
                                return
                            }
                            let tmpRow = searchList

                            let tmp = tmpRow[selectRow]
                            tmpRow[selectRow] = tmpRow[selectRow + 1]
                            tmpRow[selectRow + 1] = tmp

                            setSearchList([...tmpRow.map((v, i) => {
                                return {
                                    ...v,
                                    seq: i+1
                                }
                            })])
                        }}>
                            <p>아래로</p>
                        </Button>
                        <Button style={{marginLeft: 16}} onClick={() => {
                            let tmpRow = [...searchList]

                            tmpRow.splice(selectRow, 1)

                            setSearchList([...tmpRow])
                        }}>
                            <p>삭제</p>
                        </Button>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={searchModalList.toolInfo}
                            row={searchList ?? [{}]}
                            setRow={(e) => {
                                setSearchList([...e])
                            }}
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
                    <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>취소</p>
                        </div>
                        <div
                            onClick={() => {
                                if(selectRow !== undefined && selectRow !== null){
                                    onRowChange({
                                        ...row,
                                        tools: searchList.map((v, i) => {
                                            return {
                                                sequence: i+1,
                                                tool: v
                                            }
                                        }),
                                        name: row.name,
                                        isChange: true
                                    })
                                }
                                setIsOpen(false)
                            }}
                            style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>등록하기</p>
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
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {ToolInfoModal}

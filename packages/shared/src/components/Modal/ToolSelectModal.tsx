import React, { useEffect, useState } from 'react'
import { IExcelHeaderType } from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import { POINT_COLOR } from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import { ExcelTable } from '../Excel/ExcelTable'
import { searchModalList } from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import { RequestMethod } from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import { MachineInfoModal } from './MachineInfoModal'
import { TransferCodeToValue } from "../../common/TransferFunction";
import { UploadButton } from "../../styles/styledComponents";
import { Data } from 'react-data-grid-addons'

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const optionList = ['제조번호', '제조사명', '기계명', '', '담당자명']

const headerItems: { title: string, infoWidth: number, key: string, unit?: string }[][] = [
    [
        { title: '지시 고유 번호', infoWidth: 144, key: 'identification' },
        { title: 'LOT 번호', infoWidth: 144, key: 'lot_number' },
        { title: '거래처', infoWidth: 144, key: 'customer' },
        { title: '모델', infoWidth: 144, key: 'model' },
    ],
    [
        { title: 'CODE', infoWidth: 144, key: 'code' },
        { title: '품명', infoWidth: 144, key: 'name' },
        { title: '품목 종류', infoWidth: 144, key: 'type' },
        { title: '생산 공정', infoWidth: 144, key: 'process' },
    ],
    [
        { title: '단위', infoWidth: 144, key: 'unit' },
        { title: '목표 생산량', infoWidth: 144, key: 'goal' },
        { title: '작업자', infoWidth: 144, key: 'worker_name' },
        { title: '양품 수량', infoWidth: 144, key: 'good_quantity' },
        { title: '불량 수량', infoWidth: 144, key: 'poor_quantity' },
    ],
]

const ToolSelectModal = ({ column, row, onRowChange }: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([])
    const [summaryData, setSummaryData] = useState<any>({})

    useEffect(() => {
        if (isOpen) {
            setSummaryData({
                // ...res.parent
                identification: row.identification,
                lot_number: row.lot_number ?? '-',
                customer: row.product?.customer?.name,
                model: row.product?.model?.model,
                code: row.product?.code,
                name: row.product?.name,
                process: row.product?.process?.name,
                type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'productType') : "-",
                unit: row.product?.unit,
                goal: row.goal,
                worker_name: row?.worker?.name ?? row?.worker ?? '-',
                good_quantity: row.good_quantity ?? 0,
                poor_quantity: row.poor_quantity ?? 0,
            })
            if (row?.tools) {
                const tools = []
                row.tools.map(({ tool }) => {
                    let toolObject: any = { ...tool.tool }
                    toolObject.sequence = tool?.sequence
                    toolObject.code = tool.tool?.code
                    toolObject.name = tool.tool?.name
                    toolObject.customer = tool.tool?.customer
                    toolObject.customerArray = tool.tool?.customerArray
                    toolObject.product_id = tool.tool?.product_id
                    toolObject.stock = tool.tool?.stock
                    toolObject.version = tool.tool?.version
                    tools.push(toolObject)
                })
                setSearchList(tools)
            } else {
                setSearchList([{ sequence: 1, product_id: row.productId }])
            }
        }
    }, [isOpen,])

    const ModalContents = () => (
        <UploadButton onClick={() => {
            setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
            <p>공구 보기</p>
        </UploadButton>
    )

    const getSummaryInfo = (info) => {
        return summaryData[info.key] ?? '-'
    }
    const confirmFunction = () => {
        if (searchList[0]?.name !== undefined) {
            onRowChange({
                ...row,
                tools: searchList.map((v, i) => {
                    return {
                        ...row.tools === undefined ? undefined : { ...row.tools[i] },
                        record_id: row.record_id,
                        tool: {
                            ...row.tools === undefined ? undefined : { ...row.tools[i]?.tool },
                            tool: { ...v }
                        },
                    }
                }),
                name: row.name,
                isChange: true
            })
        }
        // }
        setIsOpen(false)
    }

    return (
        <SearchModalWrapper >
            {ModalContents()}
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
                        }}>공구 정보 (해당 제품 생산하는데 사용한 공구를 입력해주세요. 11)</p>
                        <div style={{ display: 'flex' }}>
                            {/*<Button>*/}
                            {/*  <p>엑셀로 받기</p>*/}
                            {/*</Button>*/}
                            <div style={{ cursor: 'pointer', marginLeft: 20 }} onClick={() => {
                                setIsOpen(false)
                            }}>
                                <img style={{ width: 20, height: 20 }} src={IcX} />
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
                                                        <HeaderTableText style={{ fontWeight: 'bold' }}>{info.title}</HeaderTableText>
                                                    </HeaderTableTitle>
                                                    <HeaderTableTextInput style={{ width: info.infoWidth }}>
                                                        <HeaderTableText>
                                                            {getSummaryInfo(info)}
                                                            {/*-*/}
                                                        </HeaderTableText>
                                                        {info.unit && <div style={{ marginRight: 8, fontSize: 15 }}>{info.unit}</div>}
                                                    </HeaderTableTextInput>
                                                </>
                                            )
                                        })
                                    }
                                </HeaderTable>
                            )
                        })
                    }
                    <div style={{ display: 'flex', justifyContent: 'space-between', height: 64 }}>
                        <div style={{ height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16, }}>
                            <div style={{ display: 'flex', width: 1200 }}>
                                <p style={{ fontSize: 22, padding: 0, margin: 0 }}>사용 가능 공구 리스트</p>
                            </div>
                        </div>
                        <div style={{ width: "250px", display: "flex", justifyContent: "space-between", margin: "24px 48px 8px 0px" }}>
                            <Button onClick={() => {
                                setSearchList([
                                    ...searchList,
                                    {
                                        sequence: searchList.length + 1,
                                        product_id: row.productId
                                    }
                                ])
                            }}>
                                <p>행 추가</p>
                            </Button>
                            <Button onClick={() => {
                                let tmp = searchList
                                tmp.splice(tmp.length - 1, 1)
                                setSearchList([
                                    ...tmp
                                ])
                            }}>
                                <p>행 삭제</p>
                            </Button>
                        </div>
                    </div>
                    <div style={{ padding: '0 16px', width: 1776 }}>

                        123411
                        <ExcelTable
                            headerList={searchModalList.toolUse}
                            row={searchList ?? []}
                            setRow={(e) => {
                                console.log("e 111111 : ", e);

                                if (e[0].stock === 0) {
                                    return Notiflix.Report.warning("경고", "재고량이 없습니다.", "확인",);
                                }

                                // hyun 1111
                                const update = e.map((data, index) => {
                                    return { ...data, sequence: index + 1, productId: row.productId }
                                });

                                // {  
                                //     data.sequence = index + 1
                                //     data.product_id = row.productId
                                // }

                                setSearchList(prev => [...update])
                            }}
                            width={1746}
                            rowHeight={32}
                            height={552}
                            // setSelectRow={(e) => {
                            //   setSelectRow(e)
                            // }}
                            setSelectRow={(e) => {
                                if (!searchList[e].border) {

                                    searchList.map((v, i) => {
                                        v.border = false;
                                    })
                                    searchList[e].border = true
                                    setSearchList([...searchList])
                                }
                                setSearchList([...searchList.map((row, index) => {
                                    if (index === e) {
                                        row.doubleClick = confirmFunction
                                        return row
                                    }
                                    else return row
                                })])
                                setSelectRow(e)
                            }}
                            type={'searchModal'}
                            headerAlign={'center'}
                        />
                    </div>
                    <div style={{ height: 45, display: 'flex', alignItems: 'flex-end' }}>
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{ width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <p style={{ color: '#717C90' }}>취소</p>
                        </div>
                        <div
                            onClick={() => confirmFunction()}
                            style={{ width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            <p>선택 완료</p>
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

export { ToolSelectModal }

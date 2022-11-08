import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
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
import Notiflix from 'notiflix'
import {TransferCodeToValue} from "../../common/TransferFunction";
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import { alertMsg } from '../../common/AlertMsg'
import { RequestMethod } from '../../common/RequestFunctions'
import { useRouter } from 'next/router'

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
    [
        {title: '지시 고유 번호', infoWidth: 144, key: 'identification'},
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

const ToolSelectModal = ({column, row, onRowChange}: IProps) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([])
    const [summaryData, setSummaryData] = useState<any>({})
    const isModify = !!row.record_id

    useEffect(() => {
        if(isOpen) {
            setSummaryData({
                // ...res.parent
                identification: row.identification,
                lot_number: row.lot_number ?? '-',
                customer: row.product?.customer?.name,
                model: row.product?.model?.model,
                code: row.product?.code,
                name: row.product?.name,
                process: row.product?.process?.name,
                type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'product') : "-",
                unit: row.product?.unit,
                goal: row.goal,
                worker_name: row?.worker?.name ?? row?.worker ?? '-',
                good_quantity: row.good_quantity ?? 0,
                poor_quantity: row.poor_quantity ?? 0,
            })
            if(!!row?.tools?.length){
                const tools = row.tools.map((tool, idx) => {
                    return{
                        ...tool.tool.tool,
                        tool: tool.tool.tool,
                        record_tool_id: tool.record_tool_id,
                        record_tool_version: tool.version,
                        customer: tool.tool.tool.customer?.name,
                        border: false,
                        product_id: row.productId,
                        used: tool.tool.used ?? undefined,
                        sequence: tool.tool.sequence,
                        setting: tool.tool.setting,
                        isModify,
                    }})
                setSearchList(tools)
            }else{
                setSearchList([{sequence: 1, product_id:row.productId, isModify}])
            }
        }
    }, [isOpen, ])


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
        try{
            const tools = searchList.map((tool,toolIdx) => {
                if(!!!tool.tool?.tool_id) {
                    throw ('데이터를 선택해 주세요.')
                }else if(!!!tool.used)
                {
                    throw ('생산량을 입력해 주세요.')
                }
                return {
                    record_id: row.record_id,
                    record_tool_id: tool.record_tool_id,
                    tool: {
                        ...tool,
                        tool: tool.tool,
                        used: tool.used
                    },
                    version: tool.record_tool_version
                }
            })
            onRowChange({
                ...row,
                tools,
                name: row.name,
                isChange: true
            })
            onClose()
        }catch(errMsg) {
            Notiflix.Report.warning('경고', errMsg,'확인')
        }
    }

    const onClose = () => {
        setIsOpen(false)
        setSelectRow(undefined)
        setSearchList([{sequence: 1, product_id:row.productId}])
    }

    const filterDeleted = () => {
        let tmp = searchList.slice()
        tmp.splice(selectRow, 1)
        tmp = tmp.map((row, idx) => ({...row, sequence: idx + 1}))
        setSearchList(tmp)
        setSelectRow(undefined)
    }

    const onDelete = async (selectedRow) => {
        const toolToDelete = {
            record_id: row.record_id,
            record_tool_id: selectedRow.record_tool_id,
            tool: {
                sequence: selectedRow.sequence,
                setting: selectedRow.setting,
                used: selectedRow.used,
                tool: selectedRow.tool
            },
            version: selectedRow.record_tool_version
        }
        const res = await RequestMethod('delete','cncRecordToolDelete', toolToDelete)
        if(res){
            Notiflix.Report.success('삭제되었습니다.','','확인', () => {
                router.reload()
            })
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
                        }}>공구 정보 (해당 제품 생산하는 데 사용한 공구를 입력해주세요.)</p>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', marginLeft: 20}} onClick={onClose}>
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
                                                        <Tooltip placement={'rightTop'}
                                                                 overlay={
                                                                     <div style={{fontWeight : 'bold'}}>
                                                                         {getSummaryInfo(info)}
                                                                     </div>
                                                                 } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                                            <HeaderTableText>{getSummaryInfo(info)}</HeaderTableText>
                                                        </Tooltip>
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
                                <p style={{fontSize: 22, padding: 0, margin: 0}}>사용 가능 공구 리스트</p>
                            </div>
                        </div>
                        <div style={{width:"250px", display: "flex", justifyContent: "space-between", margin: "24px 48px 8px 0px"}}>
                            <Button onClick={() => {
                                setSearchList([
                                    ...searchList,
                                    {
                                        sequence: searchList.length + 1,
                                        product_id:row.productId,
                                        isModify
                                    }
                                ])
                            }}>
                                <p>행 추가</p>
                            </Button>
                            <Button onClick={() => {
                                try {
                                    if(selectRow === undefined) throw(alertMsg.noSelectedData)
                                    if(searchList?.[selectRow]?.record_tool_id)
                                    {
                                        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 새로고침하여 페이지가 갱신됩니다.)","확인","취소",
                                          () => onDelete(searchList?.[selectRow]))
                                    }else {
                                        filterDeleted()
                                    }
                                } catch(errMsg){
                                    Notiflix.Report.warning('경고', errMsg, '확인')
                                }

                            }}>
                                <p>행 삭제</p>
                            </Button>
                        </div>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={searchModalList.toolUse(searchList)}
                            row={searchList ?? [{}]}
                            setRow={(e) => {
                                if(e[selectRow].stock <= 0 ){
                                    return Notiflix.Report.warning("경고", "재고량이 없습니다.", "확인",  );
                                }
                                const update = e.map((data, index) => {
                                    return { ...data, sequence: index + 1, product_id: row.productId, isModify }
                                })
                                setSearchList(update)
                            }}
                            width={1746}
                            rowHeight={32}
                            height={552}
                            onRowClick={(clicked) => {
                                const rowIdx = searchList.indexOf(clicked)
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
                    <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={onClose}
                            style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </div>
                        <div
                            onClick={confirmFunction}
                            style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
`

const HeaderTableTitle = styled.div`
  width: 110px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {ToolSelectModal}

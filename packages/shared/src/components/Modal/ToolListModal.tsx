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
import {TransferCodeToValue} from "../../common/TransferFunction";
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import Notiflix from "notiflix";
import {DropDownEditor} from "../Dropdown/ExcelBasicDropdown";
interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

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
    const [summaryData, setSummaryData] = useState<any>({})
    const [searchList, setSearchList] = useState<any[]>([])

    const [forSelectColumn, setForSelectColumn] = useState<any[]>(searchModalList.toolList)

    useEffect(() => {
        if(isOpen) {
            if(!!row.tools && row.tools.length){
                const newSearchList = row.tools.map((tool, idx) => ({
                    ...tool.tool.tool,
                    used: tool.tool.used,
                    customer: tool.tool.tool.customer?.name ?? '-',
                    sequence: idx+1,
                    setting:tool.tool.setting,
                  })
                )
                setSearchList(newSearchList)
            }
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
                worker_name: row.worker.name ?? row.worker ?? '-',
                good_quantity: row.good_quantity ?? 0,
                poor_quantity: row.poor_quantity ?? 0,
            })
        }
    }, [isOpen])

    useEffect(() => {
        if(column.theme == "aiModal"){
            setForSelectColumn([...forSelectColumn,
                {key: 'spare', name: '기본/스페어 설정', width: 160, formatter: DropDownEditor,selectList: [
                        {pk: 'basic', name: '기본'},
                        {pk: 'spare', name: '스페어'},
                    ], type: 'Modal'},])
        }
    },[])
    const getSummaryInfo = (info) => {
        return summaryData[info.key] ?? '-'
    }

    const ModalContents = () => (
        <UploadButton onClick={() => {
            setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId status={column.modalType ? "modal" : "table"}>
            <p>공구 보기</p>
        </UploadButton>
    )

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
                        }}>공구 정보 (해당 제품을 만드는 데 사용한 공구는 아래와 같습니다.)</p>
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
                                <p style={{fontSize: 22, padding: 0, margin: 0}}>공구 리스트</p>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
                        </div>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={forSelectColumn}
                            row={searchList ?? [{}]}
                            setRow={(e) => setSearchList([...e])}
                            width={1746}
                            rowHeight={32}
                            height={552}
                            onRowClick={(clicked) => {const rowIdx = searchList.indexOf(clicked)
                                if(!searchList[rowIdx]?.border){
                                    const newSearchList = searchList.map((v,i)=> ({
                                        ...v,
                                        border : i === rowIdx
                                    }))
                                    setSearchList(newSearchList)
                                }
                            }}
                            type={'searchModal'}
                            headerAlign={'center'}
                        />
                    </div>
                    {column.theme == "aiModal" ?
                        <div style={{height: 40, display: 'flex', alignItems: 'flex-end'}}>
                            <div
                                onClick={() => setIsOpen(false)}
                                style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <p>취소</p>
                            </div>
                            <div
                                onClick={async () => {
                                    try{
                                        const toolResult = {
                                            ...row,
                                            tools: row.tools.map((tool, index) => {
                                                tool.tool.setting = searchList[index].setting
                                                return tool
                                            }),
                                            isChange:true
                                        }
                                        const defaultSettingCount = searchList.filter(row => row.setting === 1).length
                                        if (defaultSettingCount !== 1) {
                                            throw("기본설정은 한 개여야 합니다.")
                                        }
                                        setIsOpen(false)

                                        onRowChange(toolResult)
                                    } catch(errMsg){
                                        Notiflix.Report.warning('경고', errMsg, '확인')
                                    }

                                }}
                                style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                            >
                                <p>등록하기</p>
                            </div>
                        </div>
                        :
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{width: "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>확인</p>
                        </div>
                    }
                </div>
            </Modal>
        </SearchModalWrapper>
    )
}

const SearchModalWrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
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
  text-overflow: ellipsis;
  white-space: nowrap;
`

const HeaderTableTitle = styled.div`
  width: 110px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {ToolListModal}

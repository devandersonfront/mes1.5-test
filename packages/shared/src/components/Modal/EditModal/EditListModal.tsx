import React, {useEffect, useState} from "react"
import styled from "styled-components"
import Notiflix from "notiflix";
import {RequestMethod} from "../../../common/RequestFunctions";
import Modal from "react-modal";
//@ts-ignore
import IcX from "../../../../public/images/ic_x.png";
import {ExcelTable} from "../../Excel/ExcelTable";
import {searchModalList} from "../../../common/modalInit";
import {POINT_COLOR} from "../../../common/configset";
import 'rc-tooltip/assets/bootstrap_white.css';
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {transTypeProduct} from "../../../common/Util";
import {PaginationComponent} from "../../Pagination/PaginationComponent";

interface IProps {
    open:boolean
    setOpen:(value:boolean) => void
    row?: any
    onRowChange?: (e?: any) => void
}


const EditListModal = ({ open, setOpen, onRowChange,}: IProps) =>{
    const [selectRow, setSelectRow] = useState<number>()
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [searchList, setSearchList] = useState<any[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })
    const cleanUpData = (data:any) => {
        const {product_id, code,name,type,unit,amount, safetyStock, currentGoal} = data.product
        let tmpData:any = {}
        tmpData.id = product_id
        tmpData.code = code
        tmpData.name = name
        tmpData.type = transTypeProduct(type)
        tmpData.unit = unit
        tmpData.contract_amount = data.contract_amount
        tmpData.deadline = new Intl.DateTimeFormat("fr-CA", {year: "numeric", month: "2-digit", day: "2-digit"}).format(Date.now())
        tmpData.safetyStock = safetyStock
        tmpData.currentGoal = data.currentGoal
        tmpData.stock = data.stock
        tmpData.amount = amount
        tmpData.total = data.total
        tmpData.goal = Math.abs(data.total)
        tmpData.date = new Intl.DateTimeFormat("fr-CA", {year: "numeric", month: "2-digit", day: "2-digit"}).format(Date.now())
        return tmpData
    }

    const forSaveCleanData = (data:any[]) => {
        const result = []
        data.forEach((row) => {
            const oneRow:any = {}
            oneRow.product_id = row.id
            oneRow.goal = Number(row.goal)
            oneRow.deadline = row.deadline
            result.push(oneRow)
        })

        return result
    }

    const getData = async() => {
        const res = await RequestMethod("get", "sheetInsufficient",
            {
                path:{
                    page:pageInfo.page,
                    total:18
                }
            })
        if(res){
            const resultData = res.info_list.map((row) => cleanUpData(row))
            setPageInfo({page:res.page, total:res.totalPages})
            setSearchList(resultData)
        }else{
            Notiflix.Report.warning("Error","서버 에러가 발생하였습니다.","확인", () => {
                setOpen(false)
            })
        }
    }

    useEffect(() => {
        if(open) {
            getData()
        }
    }, [open , searchKeyword, pageInfo.page])


    return (
        <SearchModalWrapper >
            <Modal isOpen={open} style={{
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
                        }}>추천 작업지시서</p>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                                setOpen(false)
                            }}>
                                <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                        </div>
                    </div>
                    <div style={{padding: '0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={[SelectColumn,...searchModalList.aiOperationList]}
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
                            height={650}
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
                    <PaginationComponent
                        currentPage={pageInfo.page}
                        totalPage={pageInfo.total}
                        setPage={(page) => {
                            setPageInfo({...pageInfo, page: page})
                        }}
                        themeType={"modal"}
                    />
                    <div style={{ height: 40, width: "100%", display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setSearchList([])
                                setSelectList(new Set())
                                setOpen(false)
                            }}
                            style={{height: 40, backgroundColor:"#b3b3b3" , width:"50%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>취소</p>
                        </div>
                        <div
                            onClick={() => {
                                RequestMethod("post", "serialSave", forSaveCleanData(searchList.filter((row) => selectList.has(row.id))))
                                    .then((res) => {
                                        Notiflix.Report.success("저장되었습니다.","","확인", () => {
                                            onRowChange()
                                            setSearchList([])
                                            setSelectList(new Set())
                                            setOpen(false)
                                        })
                                    })
                            }}
                            style={{height: 40, backgroundColor: POINT_COLOR, width:"50%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}
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

export default EditListModal

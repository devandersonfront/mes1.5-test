import React, {useEffect, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../public/images/ic_x.png'
import ExcelTable from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
//@ts-ignore
import Calendar_icon from "../../public/images/calendar_icon_black.png";
import Calendar from "react-calendar";
import moment from "moment";
import MonthSelectCalendar from "../Header/MonthSelectCalendar";

//@ts-ignore
import Notiflix from "notiflix";
//@ts-ignore
import {SelectColumn} from "react-data-grid";


interface IProps {
    // column: IExcelHeaderType
    // row: any
    // onRowChange: (e: any) => void
    onDataLoadModal:boolean
    setOnDataLoadModal:(value:boolean) => void
    onChangeSelectDate?:(from:string, to:string) => void
    setModalResult?:(value:any) => void
    setState?:(value:"local" | "select") => void
    changeSelectMonth?:(value:string) => void
}

// const optionList = ['고객사명','대표자명','담당자명', '', '', '주소', '사업자 번호']
//{column, row, onRowChange}: IProps
const StockSearchModal = ({onDataLoadModal, setOnDataLoadModal, onChangeSelectDate, setModalResult, setState, changeSelectMonth}:IProps) => {

    const [title, setTitle] = useState<string>('고객사')
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([])

    const [onCalendar, setOnCalendar] = useState<boolean>(false);

    const [selectDate, setSelectDate]= React.useState<string>(moment(new Date()).format("yyyy.MM"));

    const [selectDate_total, setSelectDate_total] = useState<{ from: string, to: string }>({
        from: moment(new Date()).startOf("month").format('YYYY-MM-DD'),
        to: moment(new Date()).endOf("month").format('YYYY-MM-DD')
    })

    const [deleteSelect, setDeleteSelect] = useState<number[]>([]);

    useEffect(() => {
         SearchBasic(keyword, 0).then(() => {
             Notiflix.Loading.remove()
         })
    }, [selectDate_total])

    const changeRow = (row: any, key?: string) => {
        let tmpData = {
            ...row,
            name: row.name,
            from: row.from,
            to: row.to,
            id: row.summary_id
        }

        return tmpData
    }

    const SearchBasic = async (keyword: any, option: number) => {
        Notiflix.Loading.circle()
        setKeyword(keyword)
        setOptionIndex(option)
        const res = await RequestMethod('get', "stockSummaryList", {
            path: {
                page:1,
                renderItem:19
            },
            params:{
                keyword:keyword,
                from:selectDate_total.from,
                to:selectDate_total.to,
            }
        });

        if(res && res.status === 200){
            Notiflix.Loading.remove(300);
            let searchList = res.results.info_list.map((row:any, index:number)=>{
                return changeRow(row);
            })
            setSearchList([...searchList])
        }else{
            Notiflix.Loading.remove(3000);
            Notiflix.Report.warning("에러가 발생하였습니다.","관리자에게 문의하세요.", "확인");
        }
    }

    const DeleteSummaryList = async(result:number[]) => {
        const res = await RequestMethod("delete", "stockSummaryDelete", {
            summaries:result
        })

        if(res && res.status === 200){
            Notiflix.Report.success("삭제되었습니다.", "", "확인");
            SearchBasic(keyword, 0)
        }
    }

    return (
            <Modal isOpen={onDataLoadModal} style={{
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
                    width: 888,
                    height: 480
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
                        }}>{title} 검색</p>
                        <div style={{cursor: 'pointer'}} onClick={() => {
                            setOnDataLoadModal(false)
                        }}>
                            <img style={{width: 20, height: 20}} src={IcX}/>
                        </div>
                    </div>
                    {/*<div style={{margin:16}}>*/}
                    {/*    <MonthSelectCalendar selectDate={selectDate} setSelectDate={setSelectDate} onChangeSelectDate={onChangeSelectDate} setState={setState} />*/}
                    {/*</div>*/}

                    <div style={{
                        width: 856, height: 32, margin: '16px 0 16px 16px',
                        display: 'flex',
                        justifyContent:"space-between"
                    }}>
                        <div style={{background:"#B3B3B3", width:215, height:32, display:"flex",  justifyContent:"space-between", alignItems:"center", padding:"0 10px", fontWeight:550, borderRadius:6 }} onClick={()=>{
                            setOnCalendar(!onCalendar);
                        }}>
                            기간선택
                            <p style={{display:"flex", alignItems:"center"}}>
                                <SelectDateText>{selectDate}</SelectDateText>
                                <img src={Calendar_icon} style={{width:32,height:32,fill:"black", marginLeft:6}}/>
                            </p>
                            {
                                onCalendar &&
                                <div style={{position:"absolute", top:50, zIndex:10}}>
                                    <Calendar defaultView={"year"} value={new Date(new Date(selectDate))} onClickMonth={(e)=>{ //value={new Date(new Date(selectDate).getMonth())}
                                        setSelectDate(moment(e).format("YYYY.MM"));
                                        setSelectDate_total({from:moment(e).startOf("month").format('YYYY-MM-DD'), to:moment(e).endOf("month").format('YYYY-MM-DD')})
                                        // onChangeSelectDate(moment(e).startOf("month").format('YYYY-MM-DD'), moment(e).endOf("month").format('YYYY-MM-DD'))
                                        // onChangeSelectDate(moment(e).format("YYYY.MM"));
                                        setSelectRow(undefined);
                                        setOnCalendar(false);
                                    }}
                                              maxDate={new Date()}
                                    />
                                </div>
                            }
                        </div>

                        <Button style={{}} onClick={()=>{
                            let resultDelete = [];
                            deleteSelect.map((v)=>{
                                resultDelete.push(searchList[v].summary_id)
                            })
                            DeleteSummaryList(resultDelete);
                        }}>삭제</Button>

                    </div>

                    <div style={{
                        width: 856, height: 32, margin: '16px 0 16px 16px',
                        display: 'flex'
                    }}>
                        <input
                            value={keyword ?? ""}
                            type={"text"}
                            placeholder="검색어를 입력해주세요."
                            onChange={(e) => {setKeyword(e.target.value)}}
                            onKeyDown={(e) => {
                                if(e.key === 'Enter'){
                                    SearchBasic(keyword, optionIndex).then(() => {
                                        Notiflix.Loading.remove()
                                    })
                                }
                            }}
                            style={{
                                width:"825px",
                                height:"32px",
                                paddingLeft:"10px",
                                border:"0.5px solid #B3B3B3",
                                backgroundColor: 'rgba(0,0,0,0)'
                            }}
                        />
                        <div
                            style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                            onClick={() => {
                                SearchBasic(keyword, optionIndex).then(() => {
                                    Notiflix.Loading.remove()
                                })
                            }}
                        >
                            <img src={Search_icon} style={{width:"16px",height:"16px"}} />
                        </div>
                    </div>
                    <div style={{padding: '0 16px 0 16px', width: 856}}>
                        <ExcelTable
                            headerList={[
                                SelectColumn,
                                ...searchModalList.stockSummary
                            ]}
                            row={searchList ?? []}
                            setRow={() => {}}
                            width={856}
                            rowHeight={32}
                            height={268}
                            setSelectRow={(e) => {
                                setDeleteSelect([...deleteSelect, e]);
                                setSelectRow(e)
                            }}
                            type={'searchModal'}
                        />
                    </div>
                    <div style={{ height: 70, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setOnDataLoadModal(false)
                            }}
                            style={{width: 444, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>취소</p>
                        </div>
                        <div
                            onClick={() => {
                                if(selectRow !== undefined){
                                    setState("select");
                                    onChangeSelectDate(searchList[selectRow].from, searchList[selectRow].to);
                                    setModalResult(searchList[selectRow]);
                                    changeSelectMonth(selectDate);
                                    setOnDataLoadModal(false)
                                }else{
                                    Notiflix.Report.warning('선택한 데이터가 없습니다.',"","확인");
                                }
                            }}
                            style={{width: 444, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>불러오기</p>
                        </div>
                    </div>
                </div>
            </Modal>
    )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

const SelectDateText = styled.span`
    width:70px;
    height:32px;
    display:flex;
    justify-content:center;
    align-items:center;
    &:hover{
        background:#cdcdcd;
    }
    cursor:pointer;
`;

const Button = styled.button`
    width:100px;
    height:30px;
    background:#b3b3b3;
    font-size:16px;
    font-weight:bold;
    border:none;
    cursor:pointer;
    border-radius:6px;
`;

export default StockSearchModal;

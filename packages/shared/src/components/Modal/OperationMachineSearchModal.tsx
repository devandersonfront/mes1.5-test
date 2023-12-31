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
import {RequestMethod} from '../../common/RequestFunctions'
import {PaginationComponent} from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {RootState} from "../../reducer";
import {useDispatch, useSelector} from "react-redux";
import {insert_machine_list, selectMachineList} from "../../reducer/machineSelect";

interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const OperationMachineSearchModal = ({column, row, onRowChange}: IProps) => {

    const selector = useSelector(selectMachineList);
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('기계')
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [keyword, setKeyword] = useState<string>('')
    const [selectRow, setSelectRow] = useState<number>()
    const [searchList, setSearchList] = useState<any[]>([])
    const [searchKeyword, setSearchKeyword] = useState<string>('')
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        if(isOpen) SearchBasic(searchKeyword, optionIndex, 1).then(() => {
            Notiflix.Loading.remove()
        })

    }, [isOpen, searchKeyword])

    useEffect(() => {
        if(pageInfo.total > 1){
            SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [pageInfo.page])

    const changeRow = (row: any, key?: string) => {
        let tmpData = {
            ...row,
            machine_id: row.name,
            machine_idPK: row.machine_id,
            manager: row.manager ? row.manager.name : null,
        }
        return tmpData
    }

    const SearchBasic = async (keyword: any, option: number, page: number) => {
        Notiflix.Loading.circle()
        setKeyword(keyword)
        setOptionIndex(option)
        const res = await RequestMethod('get', `machineSearch`,{
            path: {
                page: page,
                renderItem: 18,
            },
            params: {
                keyword: keyword ?? '',
                opt: option ?? 0
            }
        })

        if(res && res.status === 200){
            let searchList = res.results.info_list.map((row: any, index: number) => {
                return changeRow(row)
            })

            setPageInfo({
                ...pageInfo,
                page: res.results.page,
                total: res.results.totalPages,
            })

            setSearchList([...searchList])
        }
    }

    const ModalContents = () => {
        if(column.searchType === 'operation' && row.index !== 1){
            return <></>
        }

        if(column.disableType === 'record' && row.osd_id){
            return <div style={{width: '100%', height: 40, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <p>{row[`${column.key}`]}</p>
            </div>
        }

        return <>
            <div style={{width: 'calc(100% - 40px)', height: 40}} onClick={() => {
                setIsOpen(true)
            }}>
                { row[`${column.key}`]}
            </div>
            <div style={{
                display: 'flex',
                backgroundColor: POINT_COLOR,
                width: 38,
                height: 38,
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => {
                setIsOpen(true)
            }}>
                <img style={{width: 20, height: 20}} src={IcSearchButton}/>
            </div>
        </>
    }

    const result = () => {
        let tmp_data = [];
        selector.machineList.map((v, i) => {
            searchList.map((value) => {
                if (value.machine_idPK === v.machine_idPK ) {
                    tmp_data.push({...value,index:i+1})
                }
            })
            if(v.machine_idPK === null){
                tmp_data.push({index:i+1})
            }
        })
        // setSelectMachines(tmp_data);
        // selector.machineList.map((v,i)=>{
        //     if(tmp_data.length < selector.machineList.length){
        //         tmp_data.push({...v,name:"",machine_id:-1,machine_idPK:-1 })
        //     }
        // })


            return tmp_data;
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
                        }}>{title} 검색</p>
                        <div style={{cursor: 'pointer'}} onClick={() => {
                            setIsOpen(false)
                        }}>
                            <img style={{width: 20, height: 20}} src={IcX}/>
                        </div>
                    </div>

                    <div style={{padding: '0 16px 0 16px'}}>
                        <div style={{display:"flex", justifyContent:"space-between", width:"1750px"}}>
                            <div>
                                <div style={{
                                    width: 850, height: 32, margin: '16px 0 16px 0px',
                                    display: 'flex', justifyContent:"space-between"
                                }}>
                                    <div style={{
                                        width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
                                        borderRight: 'none'
                                    }}>
                                        <select
                                            defaultValue={'-'}
                                            onChange={(e) => {
                                                setOptionIndex(Number(e.target.value))
                                            }}
                                            style={{
                                                color: 'black',
                                                backgroundColor: '#00000000',
                                                border: 0,
                                                height: 32,
                                                width: 120,
                                                fontSize:15,
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {
                                                optionList && optionList.map((v, i) => {
                                                    if(v){
                                                        return <option value={i}>{v}</option>
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                    <input
                                        value={keyword ?? ""}
                                        type={"text"}
                                        placeholder="검색어를 입력해주세요."
                                        onChange={(e) => {setKeyword(e.target.value)}}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter'){
                                                setSearchKeyword(keyword)
                                            }
                                        }}
                                        style={{
                                            width:"850px",
                                            height:"32px",
                                            paddingLeft:"0px",
                                            border:"0.5px solid #B3B3B3",
                                            backgroundColor: 'rgba(0,0,0,0)'
                                        }}
                                    />
                                    <div
                                        style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                                        onClick={() => {
                                            setSearchKeyword(keyword)
                                        }}
                                    >
                                        <img src={Search_icon} style={{width:"16px",height:"16px"}} />
                                    </div>
                                </div>
                                <ExcelTable
                                    headerList={searchModalList.machine}
                                    row={searchList ?? []}
                                    setRow={() => {}}
                                    width={850}
                                    rowHeight={32}
                                    height={576}
                                    onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                                        if(selectRow !== undefined){
                                            selector.machineList[selectRow].machine_id = searchList[e].machine_id;
                                            selector.machineList[selectRow].machine_idPK = searchList[e].machine_idPK;
                                            dispatch(insert_machine_list({...selector}))
                                        }
                                    }}
                                    type={'searchModal'}
                                />
                                <PaginationComponent
                                    currentPage={pageInfo.page}
                                    totalPage={pageInfo.total}
                                    themeType={'modal'}
                                    setPage={(page) => {
                                        SearchBasic(searchKeyword, optionIndex, page).then(() => {
                                            Notiflix.Loading.remove()
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ fontSize:"20px", margin:"-2px 0 ", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                                    <p>등록할 기계 리스트 </p>
                                    <div>
                                        <Button onClick={()=>{
                                            selector.machineList[selectRow].machine_id = null;
                                            selector.machineList[selectRow].machine_idPK = null;

                                            // if(selector.process_length <= selector.machineList.length){
                                            //     Notiflix.Report.warning("공정 수 보다 많습니다.","","확인");
                                            // }else{
                                            //     selector.machineList.push({});
                                            // }

                                        }}>삭제</Button>
                                    </div>
                                </div>
                                <ExcelTable
                                    headerList={searchModalList.select_machine}
                                    row={
                                        result()
                                        // selector.machineList
                                        // selectMachines
                                    }
                                    setRow={() => {}}
                                    width={850}
                                    rowHeight={32}
                                    height={576}
                                    onRowClick={(clicked) => {const e = searchList.indexOf(clicked) 
                                        setSelectRow(e)
                                    }}
                                    type={'searchModal'}
                                />
                            </div>

                        </div>

                    </div>
                    <div style={{ height: 84, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={() => {
                                setIsOpen(false)
                            }}
                            style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>취소</p>
                        </div>
                        <div
                            onClick={() => {
                                if(selectRow !== undefined && selectRow !== null){
                                    onRowChange({
                                        ...row,
                                        ...searchList[selectRow],
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
    display:flex;
    justify-content:center;
    align-items:center;
    font-size: 16px;
    background:#B3B3B3;
    width:100px;
    height:30px;
    border:none;
`;

export {OperationMachineSearchModal}

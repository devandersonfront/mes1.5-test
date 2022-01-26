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
import {PaginationComponent} from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'

interface IProps {
    onChangeManger: (manager: {
        additional: []
        appointment: string
        authority: number
        ca_id: {ca_id: number, name: string, factor: number, authorities: [], version: number}
        company: string
        email: string
        id: string
        name: string
        password: string
        profile: null | string
        serviceAddress: string
        sync: string
        telephone: string
        token: null | string
        user_id: number
        version: number
    }) => void
    value: string
}

const optionList = {
    member: ['성명', '직책', '권한'],
}

const MidrangeMemberSearchModal = ({onChangeManger,value}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('작성자')
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


    const SearchBasic = async (keyword: any, option: number, page: number) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod('get', `memberSearch`,{
            path: {
                page: page,
                renderItem: 18,
            },
            params: {
                keyword: keyword ?? '',
                opt: option ?? 0
            }
        })

        if(res){
            let searchList = res.info_list.map((row: any, index: number) => {
                return {...row, ca_name: row.ca_id.name}
            })

            setPageInfo({
                ...pageInfo,
                page: res.page,
                total: res.totalPages,
            })

            setSearchList([...searchList])
        }
    }

    return (
        <SearchModalWrapper >
            <div style={{width: 'calc(100% - 40px)', height: 40, display: "flex", justifyContent: "center", alignItems: "center"}} onClick={() => {
                setIsOpen(true)
            }}>
                {value}
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
            <Modal isOpen={isOpen} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 0,
                    overflow:"hidden"
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
                    <div style={{
                        width: 1776, height: 32, margin: '16px 0 16px 16px',
                        display: 'flex'
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
                                    optionList && optionList.member.map((v, i) => {
                                        return (<option value={i}>{v}</option>)
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
                                width:"1594px",
                                height:"32px",
                                paddingLeft:"10px",
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
                    <div style={{padding: '0 16px 0 16px', width: 1776}}>
                        <ExcelTable
                            headerList={searchModalList.userSearch}
                            row={searchList ?? []}
                            setRow={() => {}}
                            width={1750}
                            rowHeight={32}
                            height={576}
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
                                    onChangeManger(searchList[selectRow])
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
  z-index: 5;
`

export {MidrangeMemberSearchModal}

import React, {useEffect, useState} from "react"
import {ExcelTable} from "../Excel/ExcelTable";
import {POINT_COLOR, SF_AI_ADDRESS, SF_ENDPOINT} from "../../common/configset";
import {searchModalList} from "../../common/modalInit"
import Modal from "react-modal";
import {CellButton} from "../../styles/styledComponents";
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";
import axios from "axios";
import cookie from "react-cookies";
import {RequestMethod} from "../../common/RequestFunctions";
import Notiflix from "notiflix"
import {Select} from "@material-ui/core";
import {MoldRegisterModal} from "./MoldRegisterModal";
//@ts-ignore
import IcX from "../../../public/images/ic_x.png";
import {LineBorderContainer} from "../Formatter/LineBorderContainer";
import {columnlist} from "../../common/columnInit";
//@ts-ignore
import Search_icon from "../../../public/images/btn_search.png";
import {SearchInit} from "./SearchModalTest/SearchModalInit";

interface IProps {
    row: any
    column: IExcelHeaderType
    setRow: (row: any) => void
}

const AiCompareModal =  ({row, column, setRow}: IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [basic, setBasic] = useState<any[]>([])
    const [subBasic, setSubBasic] = useState<any[]>([])
    const [selectRow, setSelectRow] = useState<number>(null)

    const [selectState, setSelectState] = useState<"basic" | "sub">("basic")
    const searchModalInit = ['', '모델', '코드', '품명']
    const [keyword, setKeyword] = useState<string>("")
    const [option, setOption] = useState<number>(1)
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:1, total:1})

    useEffect(() => {
        if(isOpen){
            alert("?@??@??@?@?")
            setSelectRow(null)
            Notiflix.Loading.standard()
            axios.get(`${SF_AI_ADDRESS}/api/product_info/pair/${row.product_id}`,
                {'headers': {'Authorization': cookie.load('userInfo').token},}
            )
                .then((res) => {
                    console.log("S?DS?DS?DSD??SD : ", row)
                    if(row.has_pair){
                        RequestMethod("get", "aipProductLoad",{
                            params:{product_ids:[res.data.product_id, res.data.pair_product_id]}
                        })
                            .then((res) => {
                                if(res){
                                    let tmpBasic = res?.map((product, index) => {
                                        return (
                                            {
                                                id: product.product_id,
                                                confirm_product:product.product_id,
                                                aor_id:row.ai_operation_record_id,
                                                predictionModel: product?.model?.model ?? "-",
                                                predictionCode: product.code,
                                                predictionName: product.name,
                                                predictionProcess: product.process.name,
                                                ranking:index+1,
                                                border:product.product_id == row.product_id
                                            }
                                        )
                                    })
                                    setBasic(tmpBasic)
                                    Notiflix.Loading.remove()
                                }
                            })
                    }
                    getProductDatas("basic")
                })
        }
    }, [isOpen])

    const getProductDatas = (type:"basic" | "sub", scrollEnd?:boolean) => {
        RequestMethod("get", "productSearch" ,{
            path: {
                page: scrollEnd ? pageInfo.page : 1,
                renderItem: 18,
            },
            params:{keyword, opt:option}
        })
            .then((res) => {
                if(res){
                    // setSubBasic(res.info_list)
                    let tmpBasic = res?.info_list?.map((product, index) => {
                        return (
                            {
                                id: product.product_id,
                                confirm_product:product.product_id,
                                aor_id:row.ai_operation_record_id,
                                predictionModel: product?.model?.model ?? "-",
                                predictionCode: product.code,
                                predictionName: product.name,
                                predictionProcess: product.process.name,
                                ranking:index+1,
                                border:product.product_id == row.product_id
                            }
                        )
                    })

                    setSubBasic(scrollEnd ? subBasic.concat(tmpBasic) : tmpBasic)
                    Notiflix.Loading.remove()
                }
            })
    }


    const SearchBox = () => {

        return <div style={{
            height: 32, margin: '16px 0 16px 16px',
            display: 'flex',
        }}>
            <div style={{
                width: 120, display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: '#F4F6FA', border: '0.5px solid #B3B3B3',
                borderRight: 'none',
            }}>
                <select key={searchModalInit[0]}
                        defaultValue={searchModalInit[0]}
                        onChange={(e) => {
                            const option = Number(e.target.value)
                            setOption(option)
                            // setPageInfo({total:1, page:1});
                            // SearchBasic('', Number(e.target.value))
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
                        searchModalInit.map((v, i) => {
                            if(v !== ""){
                                return (<option key={i.toString()} value={i}>{v}</option>)
                            }
                        })
                    }
                </select>
            </div>
            <input
                value={keyword ?? ""}
                type={"text"}
                placeholder="검색어를 입력해주세요."
                onChange={(e) => {
                    setKeyword(e.target.value)
                    setPageInfo({total:1, page:1});
                }}
                onKeyDown={(e) => {
                    if(e.key === 'Enter'){
                        console.log("option : ", option, "  keyword : ", keyword)
                        getProductDatas(selectState)
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
                className={'img_wrapper unprintable'}
                style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center", cursor: 'pointer'}}
                onClick={() => {
                    console.log("option : ", option, "  keyword : ", keyword)
                    getProductDatas(selectState)
                    // LoadBasic(1);
                }}
            >
                <img src={Search_icon} style={{width:"16px",height:"16px"}} />
            </div>
        </div>
    }

    const content = () => {
        return (
                <CellButton style={{width:"100%", height:"100%"}}  onClick={() => {
                    // if(row.has_pair){
                        setIsOpen(true)
                        row.setModalOpen()
                    // }
                }}>
                    예측 품목 변경
                </CellButton>
        )
    }

    const ContentHeader = () => {
        return <div id={'content-header'} style={{
            marginTop: 24,
            marginLeft: 16,
            marginRight: 16,
            marginBottom: 12,
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div id={'content-title'} style={{display: 'flex'}}>
                <p style={{
                    color: 'black',
                    fontSize: 22,
                    fontWeight: 'bold',
                    margin: 0,
                }}>변경 제품</p>

            </div>
            <div id={'content-close-button'} style={{display: 'flex'}}>
                {/*{*/}
                {/*    column.type === 'mold' && <MoldRegisterModal column={column} row={row} onRowChange={onRowChange} register={() => {*/}
                {/*        LoadBasic(1)*/}
                {/*    }}/>*/}
                {/*}*/}
                <div className={'img_wrapper unprintable'} style={{cursor: 'pointer', marginLeft: 22}} onClick={() => {
                    setIsOpen(false)
                }}>
                    <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
            </div>
        </div>
    }

    const confirmFunction = () => {
        const data = selectState == "basic" ? basic : subBasic

        if(selectRow !== null && row.product_id !== data[selectRow].product_id){
            Notiflix.Loading.standard()
            RequestMethod("post", "aiRecordConfirm", {aor_id:data[selectRow].aor_id, confirm_product:data[selectRow].confirm_product})
                .then((res) => {
                    Notiflix.Loading.remove()
                    Notiflix.Report.success("저장됐습니다.","","확인", () => {
                        row.setModalOpen()
                        setIsOpen(false)
                    })
                })
            return
        }

        row.setModalOpen()
        setIsOpen(false)

    }

    const onClickEvent = (type:"basic" | "sub", clicked:any) => {
        const datas = {basic, sub:subBasic}
        const e = datas[type].indexOf(clicked)
        const update = datas[type].map(
            (row, index) => {
                return {
                    ...row,
                    border: index === e
                }
            }
        );
        const unset = datas[type == "basic" ? "sub" : "basic"].map(
            (row, index) => {
                return {
                    ...row,
                    border: false
                }
            }
        );
        if(type == "basic"){
            setBasic(update)
            setSubBasic(unset)
        }else{
            setSubBasic(update)
            setBasic(unset)
        }
        setSelectRow(e)
        setSelectState(type)

    }

    return (
        <div>
            {content()}
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
                    zIndex: 5,
                }
            }}>
                <div style={{
                    width: 1776,
                    height: 816,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}>
                <div id={'content-root'}>
                    {ContentHeader()}
                    {SearchBox()}
                    {/*{*/}
                    {/*    (column.type == "product" && column.theme == "aiModal") &&*/}
                    <div>
                        <div style={{marginBottom:10}}>
                            <ExcelTable
                                type={'searchModal'}
                                headerList={searchModalList.aiPredictionProduct}
                                row={basic}
                                onRowClick={(clicked) => {
                                    onClickEvent("basic", clicked)
                                }}
                                width={1744}
                                height={160}
                            />
                        </div>
                    {/*}*/}
                        <ExcelTable
                            // resizable
                            type={'searchModal'}
                            headerList={searchModalList.simpleProduct}
                            row={subBasic}
                            width={1744}
                            rowHeight={32}
                            height={480}
                            onRowClick={(clicked) => {
                                onClickEvent("sub", clicked)
                            }}
                            scrollEnd={(value) => {
                                if(value){
                                    setPageInfo({...pageInfo, page:pageInfo.page+1})
                                    getProductDatas(selectState, true)
                                }
                            }}
                        />

                    </div>
                </div>
                    <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
                        <FooterButton
                            onClick={() => {
                                setIsOpen(false)
                                row.setModalOpen()
                            }}
                            style={{backgroundColor: '#E7E9EB'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </FooterButton>
                        <FooterButton
                            onClick={confirmFunction}
                            style={{backgroundColor: POINT_COLOR}}
                        >
                            <p style={{color: '#0D0D0D'}}>등록하기</p>
                        </FooterButton>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

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


export {AiCompareModal}

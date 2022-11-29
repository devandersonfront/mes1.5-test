import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    PaginationComponent,
    RequestMethod, SF_ENDPOINT,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import {useDispatch} from "react-redux";
import {Stomp} from "@stomp/stompjs"
//@ts-ignore
import SockJS from "sockjs-client"
import cookie from "react-cookies";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import axios from "axios";
import moment from "moment";
import ErrorList from "shared/src/common/ErrorList";
import {TransferCodeToValue, TransferValueToCode} from "shared/src/common/TransferFunction";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const HomeAiProductionLog = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInfo = cookie.load('userInfo')
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ page, setPage ] = React.useState<{ current_page: number, totalPages: number }>({
        current_page: 1,
        totalPages : 1
    });

    useEffect(() => {
        // if(userInfo?.ca_id?.authorities?.some(auth => ['ROLE_PROD_02', 'ROLE_PROD_06'].includes(auth))){
            Notiflix.Loading.circle()
            LoadBasic()
            const dashboard = setInterval(()=>{
                LoadBasic()
            },30000)
            return () => {
                clearInterval(dashboard)
            }
        // }
    },[])

    const predictCheckList = (value) => {

        const codeCheck = value.predictionCode === value.code
        const modelCheck = value.predictionModel === value.model
        const nameCheck = value.predictionName === value.product_name
        const processCheck = value.predictionProcess === value.process

        return codeCheck && modelCheck && nameCheck && processCheck
    }

    const convertData = (results) => {
        return results.map((result)=>
            !predictCheckList(result) ?
                {...result , machine_type : TransferCodeToValue(result.machine_type, "machine"), color : 'red'}
                : {...result , machine_type : TransferCodeToValue(result.machine_type, "machine")}
        )
    }

    const LoadBasic = async (pages : number = 1) => {
        try {
            const tokenData = userInfo?.token;
            const res = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
                params : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'},
                headers : { Authorization : tokenData }
            })
            if(res.status === 200){
                Notiflix.Loading.remove()
                const {info_list , page, totalPages, menus} = res.data
                const newData = convertData(info_list)
                setBasicRow(newData)
                setPage({current_page : page , totalPages : totalPages})
            }
        }catch (error) {
            if(error?.response?.status){
                const errorNum : number = error?.response?.status
                const message : string = error?.response?.data?.message
                const [errorHeader,errorMessage] = ErrorList({errorNum , message})
                Notiflix.Report.failure(errorHeader, errorMessage ,'확인')
                Notiflix.Loading.remove()
            }
        }
    }


    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "HOME", sub: router.pathname })
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);


    return (
        <div>
            <PageHeader
                title={"AI 생산 제품 현황"}
            />
            <ExcelTable
                editable
                headerList={column}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
                height={'100%'}
            />
        </div>
    );
}

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            page: ctx.query.page ?? 1,
            keyword: ctx.query.keyword ?? "",
            option: ctx.query.opt ?? 0,
        }
    }
}

export {HomeAiProductionLog};
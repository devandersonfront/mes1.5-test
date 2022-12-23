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
import {SF_ENDPOINT_PMS} from "shared/src/common/configset";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}
const userInfo = cookie.load('userInfo')

const HomeAiProductionLog = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ page, setPage ] = React.useState<{ current_page: number, totalPages: number }>({
        current_page: 1,
        totalPages : 1
    });

    useEffect(()=>{
        userInfo?.company === '4XX21Z' && setColumn(columnlist["aiProductLogDS"])
    },[])

    useEffect(() => {
        // if(userInfo?.ca_id?.authorities?.some(auth => ['ROLE_PROD_02', 'ROLE_PROD_06'].includes(auth))){
        Notiflix.Loading.circle()
        getApi()
        const dashboard = setInterval(()=>{
            getApi()
        },30000)
        return () => {
            clearInterval(dashboard)
        }
        // }
    },[])

    const predictCheckList = (value) => {

        if(!value.code || value.code === '-'){
            return true
        }

        const codeCheck = value.predictionCode === value.code
        const modelCheck = value.predictionModel === value.model
        const nameCheck = value.predictionName === value.product_name
        const processCheck = value.predictionProcess === value.process

        return codeCheck && modelCheck && nameCheck && processCheck
    }

    const convertData = (results) => {
        return results.map((result)=>
            !predictCheckList(result) ?
                {...result , predictionConfidence : `${(result?.predictionConfidence * 100).toFixed(2)}%` , machine_type : TransferCodeToValue(result.machine_type, "machine"), color : 'red'}
                : {...result , predictionConfidence : `${(result?.predictionConfidence * 100).toFixed(2)}%`,machine_type : TransferCodeToValue(result.machine_type, "machine")}
        )
    }

    const getPressList = async () => {
        const tokenData = userInfo?.token;
        return await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/simple`,{
            headers : { Authorization : tokenData }
        })
    }
    const LoadBasic = async (pages : number = 1) => {
        const tokenData = userInfo?.token;
        const params  = userInfo?.company === '4XX21Z'
                ? { rangeNeeded : true , distinct : 'mfrCode'}
                : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'}

        return await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
            params : params,
            headers : { Authorization : tokenData }
        })
    }

    const mappingData = (lists, results) => {
        let map = new Map()
        lists?.forEach((list)=>{
            map?.set(list.productDetails.machineDetail.mfrCode, list.pressStatus)
        })
        const newData = results?.map((result)=>{
            if(map.get(result.machine_code)){
                return {...result , pressStatus : map.get(result.machine_code)}
            }else{
                return result
            }
        })
        return newData
    }

    const getApi = async () => {
        try {
            const pressList = await getPressList()
            const result = await LoadBasic()
            Notiflix.Loading.remove()
            const newData = mappingData(pressList.data.results.content , result.data.info_list)
            const data = convertData(newData)
            setBasicRow(data)
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
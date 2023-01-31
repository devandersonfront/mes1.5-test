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
import {SF_AI_ADDRESS, SF_ENDPOINT_PMS} from "shared/src/common/configset";
import {haveDistinct} from "shared/src/common/haveDistinct";

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
    const [ column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [ list, setList] = useState<any[]>()
    const [ predictAi , setPredictAi ] = React.useState<any[]>()

    useEffect(()=>{
        userInfo?.company === '4XX21Z' && setColumn(columnlist["aiProductLogDS"])
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
        return results?.map((result)=>
            !predictCheckList(result) ?
                {...result , predictionConfidence : result.predictionConfidence ? `${(result.predictionConfidence * 100).toFixed(2)}%` : '' , machine_type : TransferCodeToValue(result.machine_type, "machine"), color : 'red'}
                : {...result , predictionConfidence : result.predictionConfidence ?`${(result.predictionConfidence * 100).toFixed(2)}%` : '',machine_type : TransferCodeToValue(result.machine_type, "machine")}
        )
    }

    const getPressList = async () => {

        const tokenData = userInfo?.token;
        const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/simple`,{
            headers : { Authorization : tokenData }
        }).catch(()=>{
            Notiflix.Report.warning("경고",'실패한 요청이 있어, 특정 데이터만 나올 수 있습니다.',"확인");
        })
        if (res) {
            Notiflix.Loading.remove()
            const content = res?.data?.results?.content
            setList(content)
            return true
        }else {
            Notiflix.Loading.remove()
            return false
        }
    }

    const LoadBasic = async (pages : number = 1) => {
        const tokenData = userInfo?.token;
        const params  = haveDistinct(userInfo?.company)
            ? { rangeNeeded : true , distinct : 'mfrCode', from : "2023-01-01" , to : '9999-12-31'}
            : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'}

        // const params  ={ rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'}

        const result  = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
            params : params,
            headers : { Authorization : tokenData }
        }).catch(()=>{
            Notiflix.Report.warning("경고",'실패한 요청이 있어, 특정 데이터만 나올 수 있습니다.',"확인");
        })

        if(result){
            Notiflix.Loading.remove()
            setPredictAi(await checkTrained(result?.data?.info_list))
            return true
        }else{

            Notiflix.Loading.remove()
            return false
        }
    }

    const getIsTrained = async (machine_codes : string[]) => {
        const tokenData = userInfo?.token;
        const result = await axios.post(`${SF_AI_ADDRESS}/api/train/isTrained`, {
            company_code: userInfo?.company, machine_codes: machine_codes
        },{ headers : { Authorization : tokenData }}).catch(()=>{
            Notiflix.Report.warning("경고",'실패한 요청이 있어, 특정 데이터만 나올 수 있습니다.',"확인");
        })

        if(result){
            Notiflix.Loading.remove()
            return result
        }
    }

    const checkTrained = async (results) => {

        const map = new Map()
        const competeStr = '예측 DATA 생성중'
        const listToCheck = results?.filter((result)=> result.predictionCode === competeStr)
        const lists = await getIsTrained(listToCheck.map((list)=>(list.machine_code)))

        results?.forEach((result)=> map.set(result.machine_code, result))

        if(listToCheck?.length < 0){
            return results
        }

        lists.data.forEach((list) => (
             map.set(list.machine_code, {
                ...map.get(list.machine_code)
                , predictionCode: list.is_trained ? competeStr : ''
                , predictionModel: list.is_trained ? competeStr : ''
                , predictionName :  list.is_trained ? competeStr : ''
                , predictionProcess: list.is_trained ? competeStr : ''
                , predictionConfidence : list.is_trained ? competeStr : ''
            })
        ))

        return Array.from(map.values())
    }

    const mappingData = (lists, results) => {

        if(lists && results){
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
            return convertData(newData)
        }else if(lists){
            return lists
        }else{
            return convertData(results)
        }
    }

    useEffect(() => {
        Notiflix.Loading.circle()
        let pressInterval;
        let loadInteval

        getPressList()
        LoadBasic()

        pressInterval = setInterval(async () => {
            const result = await getPressList()
            if (!result) {
                clearTimeout(pressInterval)
            }
        }, 2500)

        loadInteval = setInterval(async () => {
            const result = await LoadBasic()
            if (!result) {
                clearTimeout(loadInteval)
            }
        }, 30000)

        return () => {
            clearTimeout(pressInterval)
            clearTimeout(loadInteval)
        }

    }, [])

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
                // row={mappingData(list,predictAi)}
                row={[{}]}
                setRow={()=>{}}
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

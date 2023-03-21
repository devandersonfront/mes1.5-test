import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelTable,
    Header as PageHeader, IExcelHeaderType, requestApi, SF_ENDPOINT,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
//@ts-ignore
import SockJS from "sockjs-client"
import cookie from "react-cookies";
import {haveDistinct} from "shared/src/common/haveDistinct";
import moment from "moment";
import axios from "axios";
import Notiflix from "notiflix";
import {SF_AI_ADDRESS, SF_ENDPOINT_PMS} from "shared/src/common/configset";
import {useInterval} from "usehooks-ts";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

let aiLimitNum = 0;
let pressLimitNum = 0;

const HomeAiProductionLog = ({}: IProps) => {
    const userInfo = cookie.load('userInfo')
    const [ai , setAi] = useState<any>()
    const [pressList , setPressList] = useState<any[]>([])
    const [isAiRequest , setIsAiRequest] = useState<boolean>(false)
    const [isPressRequest , setIsPressRequest] = useState<boolean>(false)
    const [allStop , setAllStop] = useState<boolean>(false)
    const [pressStop, setPressStop] = useState<boolean>(false)
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [data ,setData] = useState<any[]>([])
    const [timeout , setTimeout] = useState<number>(3000)
    const [modalOpen, setModalOpen] = useState<boolean>(false)


    console.log(timeout,'timeouttimeout')
    const changeModalState = () => {
        setModalOpen(value => !value)
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

    const predictCheckList = (value) => {
        if(!value.code || value.code === '-'){
            return true
        }
        const codeCheck = value.prediction_code === value.code
        const modelCheck = value.prediction_model === value.model
        const nameCheck = value.prediction_name === value.product_name
        const processCheck = value.prediction_process === value.process

        return codeCheck && modelCheck && nameCheck && processCheck
    }

    const checkTrained = async (results) => {

        const map = new Map()
        const competeStr = '예측 DATA 생성중'
        const listToCheck = results?.filter((result)=> result.prediction_code === competeStr)
        const lists = await getIsTrained(listToCheck.map((list)=>(list.machine_code)))

        results?.forEach((result)=> map.set(result.machine_code, result))

        if(listToCheck?.length < 1){
            return results
        }

        lists.data.forEach((list) => (
            map.set(list.machine_code, {
                ...map.get(list.machine_code)
                , prediction_code: list.is_trained ? competeStr : ''
                , prediction_model: list.is_trained ? competeStr : ''
                , prediction_name :  list.is_trained ? competeStr : ''
                , prediction_process: list.is_trained ? competeStr : ''
                , prediction_confidence : list.is_trained ? competeStr : ''
            })
        ))

        return Array.from(map.values())
    }

    const getAi = async (pages : number = 1) => {
        const tokenData = userInfo?.token;
        const params  = haveDistinct(userInfo?.company)
            ? { rangeNeeded : true , distinct : 'mfrCode',}
            : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'}

        const result  = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
            params : params,
            headers : { Authorization : tokenData },
        })

        if(result) {
            const data = result?.data?.info_list
            Notiflix.Loading.remove()
            if (data.length) {
                setIsAiRequest(true)
                setAi(await checkTrained(data))
                return await checkTrained(data)
            }
        }else{
            aiLimitNum++
            setIsAiRequest(false)
            Notiflix.Loading.remove()
            setPressList([])
            return false
        }
    }

    const getPressList = async (mfrCodes : string) => {
        const tokenData = userInfo?.token;
        try {
            const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/statement`,{
                params : { page : 1 , size : 20 , mfrCodes },
                headers : { Authorization : tokenData },
                timeout : timeout
            })

            if (res) {
                Notiflix.Loading.remove()
                setIsPressRequest(true)
                setPressList(res?.data?.results?.content)
                return res?.data?.results?.content
            }

        }catch (e) {
            if(timeout === 10000){
                pressLimitNum++
                Notiflix.Loading.remove()
                setIsPressRequest(false)
                setTimeout(2000)
                return Notiflix.Report.warning('경고' , '잠시후 다시 시도해 주세요' , '확인')
            }
            setIsPressRequest(true)
            setTimeout((prev) => prev + 1000);
            setPressList([])
        }
    }

    useInterval(async () => {
        if(isAiRequest){
            const result = await getAi()
            setData(mappingData(result,pressList))
        }
    }, !allStop && isAiRequest && !modalOpen ? 35000 : null);

    useInterval(async () => {
        const codes = ai.map((result)=>result.machine_code)
        if(ai && isAiRequest && isPressRequest){
            const result = await getPressList(codes.join(','))
            setData(mappingData(ai,result))
        }
    }, !allStop && isAiRequest && isPressRequest && !modalOpen ? timeout : null);

    useInterval(()=>{
        setIsPressRequest(true)
    },(!allStop && !pressStop && !isPressRequest) ? 60000 : null)

    useInterval(()=>{
        setIsAiRequest(true)
    },(!allStop && !isAiRequest && aiLimitNum <= 5) ? 60000 : null)

    const convertPredictionConfidence = (confidence) => {
        if(!confidence) return ''
        if(typeof confidence === 'number') return `${(confidence * 100).toFixed(2)}%`
        else return confidence
    }

    const mappingData = (aiResults : any[] , pressResults : any []) => {
        return aiResults.map((result, index)=>(
            {
                ...result ,
                pressStatus : pressResults && pressResults[index]?.pressStatus ,
                prediction_confidence : convertPredictionConfidence(result.prediction_confidence) ,
                machine_type : TransferCodeToValue(result.machine_type, "machine"),
                color : !predictCheckList(result) ? 'red' : undefined,
                setModalOpen:changeModalState
            }
        ))
    }

    const getApi = async () => {
        const aiResults = await getAi()
        const codes = aiResults.map((result)=>result.machine_code)
        const pressResults = await getPressList(codes.join(','))
        setData(mappingData(aiResults,pressResults))
    }

    useEffect(()=>{
        getApi()
    },[])

    useEffect(() => {
        if (aiLimitNum === 3) {
            setAllStop(true)
        }
    }, [aiLimitNum]);

    useEffect(() => {
        if (pressLimitNum === 3) {
            setPressStop(true)
        }
    }, [pressLimitNum]);

    useEffect(()=>{
        userInfo?.company === '4XX21Z' && setColumn(columnlist["aiProductLogDS"])
    },[])

    return (
        <div>
            <PageHeader
                title={"AI 생산 제품 현황"}
            />
            <ExcelTable
                editable
                headerList={column}
                row={data}
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

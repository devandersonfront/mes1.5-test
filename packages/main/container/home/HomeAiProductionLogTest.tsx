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
let aiIntervalTime = 60000
let pressInterval = 3000
let pressIntervalLimit = pressInterval + 1000

const HomeAiProductionLog = ({}: IProps) => {
    const userInfo = cookie.load('userInfo')
    const [ai , setAi] = useState<any>()
    const [aiTime , setAiTime] = useState<number>(0)
    const [pressList , setPressList] = useState<any[]>([])
    const [pressTime , setPressTime] = useState<number>(0)
    const [allStop , setAllStop] = useState<boolean>(false)
    const [pressStop, setPressStop] = useState<boolean>(false)
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [data ,setData] = useState<any[]>([])
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    useInterval(async () => {
        await getAi()
    }, aiTime);

    useInterval(async () => {
        if(ai){
            const codes = ai.map((result)=>result.machine_code)
            await getPressList(codes.join(','))
        }
    }, pressTime);

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
        try {
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
                setAiTime(aiIntervalTime)
                Notiflix.Loading.remove()
                if (!!data.length) {
                    setAi(await checkTrained(data))
                    setData(ai)
                }
            }
        }catch(e){
            Notiflix.Loading.remove()
            aiLimitNum++
        }
    }

    const getPressList = async (mfrCodes : string) => {
        const tokenData = userInfo?.token;
        try {
            const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/statement`,{
                params : { page : 1 , size : 20 , mfrCodes },
                headers : { Authorization : tokenData },
                timeout : pressTime
            })
            if (res) {
                Notiflix.Loading.remove()
                const press = res?.data?.results?.content
                setPressTime(pressInterval)
                setPressList(press)
                setData(mappingData(ai,press))
            }
        }catch (e) {
            if(pressTime === pressIntervalLimit){
                pressLimitNum++
                Notiflix.Loading.remove()
                setPressTime(pressInterval)
                return Notiflix.Report.warning('경고' , '잠시후 다시 시도해 주세요' , '확인')
            }
            setPressTime(prevTime => prevTime + 1000)
            setPressList([])
        }
    }


    const convertPredictionConfidence = (confidence) => {
        if(!confidence) return ''
        if(typeof confidence === 'number') return `${(confidence * 100).toFixed(2)}%`
        else return confidence
    }

    const mappingData = (aiResults : any[] , pressResults ?: any []) => {
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

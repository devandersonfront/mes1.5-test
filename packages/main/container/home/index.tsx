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

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const userInfo = cookie.load('userInfo')

const Test = ({}: IProps) => {


    const [ai , setAi] = useState<any>()
    const [aiRequest , setIsAiRequest] = useState<boolean>(false)
    const [pressRequest , setPressRequest] = useState<boolean>(false)
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [data ,setData] = useState<any[]>([])

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
            headers : { Authorization : tokenData }
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
            setIsAiRequest(true)
            Notiflix.Loading.remove()
            return false
        }
    }

    const getPressList = async (mfrCodes : string) => {
        const tokenData = userInfo?.token;
        const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/statement`,{
            params : { page : 1 , size : 20 , mfrCodes },
            headers : { Authorization : tokenData }
        }).catch(()=>{
            Notiflix.Report.warning("경고",'실패한 요청이 있어, 특정 데이터만 나올 수 있습니다.',"확인");
        })
        if (res) {
            Notiflix.Loading.remove()
            setPressRequest(true)
            return res?.data?.results?.content
        }else {
            Notiflix.Loading.remove()
            return false
        }
    }

    const aiInterval = useInterval(() => {
        getAi()
    }, aiRequest ? 35000 : null);

    const pressInterval = useInterval(() => {

        const codes = ai.map((result)=>result.machine_code)
        ai && aiRequest && pressRequest && getPressList(codes.join(','))

    }, aiRequest && pressRequest ? 5000 : null);


    // const monitorOneMinuteInterval = useInterval(()=>{}, 60000)

    const getApi = async () => {
        const aiResults = await getAi()
        const codes = aiResults.map((result)=>result.machine_code)
        const pressResults = await getPressList(codes.join(','))
        const mappingData = aiResults.map((results, index)=>(
            {...results , pressStatus : pressResults[index].pressStatus}
        ))
        setData(mappingData)
    }

    useEffect(()=>{
        getApi()
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

export {Test};

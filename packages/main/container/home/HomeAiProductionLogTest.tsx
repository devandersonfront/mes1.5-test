import React, { useState, useEffect } from "react";
import {useInterval} from "usehooks-ts";
import axios from "axios";
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, SF_ENDPOINT} from "shared";
import cookie from "react-cookies";
import {SF_AI_ADDRESS, SF_ENDPOINT_PMS} from "shared/src/common/configset";
import Notiflix from "notiflix";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";

let refreshTime = 10000
let aiInitTime = 35000
let pressLimitTime = 7000
let pressInitTime = 3000
let limitCount = 3

const HomeAiProductionLogTestTest = () => {

    const userInfo = cookie.load('userInfo')

    const [ai, setAi] = useState(null); // AI 데이터 상태
    const [aiRetryCount , setAiRetryCount] = useState(0)
    const [aiIntervalTime , setAiIntervalTime] = useState(aiInitTime)

    const [pressList, setPressList] = useState(null)
    const [pressRetryCount, setPressRetryCount] = useState(0)
    const [pressIntervalTime, setPressIntervalTime] = useState(pressInitTime)

    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [data ,setData] = useState<any[]>([])
    const [modalOpen, setModalOpen] = useState<boolean>(false)

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

    const changeModalState = () => {
        setModalOpen(value => !value)
    }

    const convertPredictionConfidence = (confidence) => {
        if(!confidence) return ''
        if(typeof confidence === 'number') return `${(confidence * 100).toFixed(2)}%`
        else return confidence
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

    const getAi = async (pages : number = 1) => {
        const tokenData = userInfo?.token;
        try {
            const result  = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
                params : { rangeNeeded : true , distinct : 'mfrCode'},
                headers : { Authorization : tokenData },
            })
            const InfoList = result?.data?.info_list
            const trainedAi = await checkTrained(InfoList)
            setAi(trainedAi)
            setAiRetryCount(0);
            return trainedAi

        }catch (e) {
            if(aiRetryCount === limitCount){
                setPressIntervalTime(null)
                setAiIntervalTime(null)
                return Notiflix.Report.warning('경고' , '잠시후 다시 시도해 주세요' , '확인')
            }
            setAiIntervalTime(null)
            setTimeout(() => {
                setAiRetryCount((prevRetry) => prevRetry + 1);
                setAiIntervalTime(aiInitTime);
            }, refreshTime);
        }
    }

    const getPress = async (mfrCodes : string) => {

        const tokenData = userInfo?.token;
        try {
            const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/status`,{
                params : { page : 1 , size : 20 },
                headers : { Authorization : tokenData , mfrCodes},
                timeout : pressIntervalTime
            })
            const content = res?.data?.results?.content
            setPressList(content);
            setPressRetryCount(0);
            return content
        } catch (error) {
            if(pressRetryCount === limitCount) return setPressIntervalTime(null)
            if(pressIntervalTime < pressLimitTime) {
                setTimeout(() => {
                    setPressIntervalTime((prevTime) => prevTime + 1000);
                }, 1000);
            } else {
                setPressIntervalTime(null)
                setTimeout(() => {
                    setPressRetryCount((prevRetry) => prevRetry + 1);
                    setPressIntervalTime(pressInitTime);
                }, refreshTime);
            }
        }
    };

    const getApi = async () => {
        const aiResults = await getAi()
        const codes = aiResults.map((result)=>result.machine_code)
        const pressResults = await getPress(codes.join(','))
        setData(mappingData(aiResults,pressResults))
    }

    useInterval(async () => {
        const result = await getAi()
        setData(mappingData(result,pressList))
    },  !modalOpen ? aiIntervalTime : null);

    useInterval(async () => {
        if(ai){
            const codes = ai.map((result)=>result.machine_code)
            const result = await getPress(codes.join(','))
            setData(mappingData(ai,result))
        }
    },  !modalOpen ? pressIntervalTime : null);

    useEffect(() => {
        getApi()
    }, [modalOpen]);

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
    )
}

export default HomeAiProductionLogTestTest
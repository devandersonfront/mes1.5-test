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

const HomeAiProductionLog = () => {

    const userInfo = cookie.load('userInfo')

    const [machineData, setMachineData] = useState(null); // AI 데이터 상태
    const [machineRetryCount , setMachineRetryCount] = useState(0)
    const [machineIntervalTime , setMachineIntervalTime] = useState(aiInitTime)

    const [statusData, setStatusData] = useState(null)
    const [statusRetryCount, setStatusRetryCount] = useState(0)
    const [statusIntervalTime, setStatusIntervalTime] = useState(pressInitTime)

    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [data ,setData] = useState<any[]>([])
    const [modalOpen, setModalOpen] = useState<boolean>(false)

    const isTrainedMachine = async (machine_codes : string[]) => {
        const tokenData = userInfo?.token;
        const trainedMachine = await axios.post(`${SF_AI_ADDRESS}/api/train/isTrained`, {
            company_code: userInfo?.company, machine_codes: machine_codes
        },{ headers : { Authorization : tokenData }}).catch(()=>{
            Notiflix.Report.warning("경고",'실패한 요청이 있어, 특정 데이터만 나올 수 있습니다.',"확인");
        })

        if(trainedMachine){
            Notiflix.Loading.remove()
            return trainedMachine
        }
    }

    const checkTrainedMachine = async (machineData) => {

        const map = new Map();
        const competeStr = '예측 DATA 생성중';
        const listToCheck = machineData?.filter(data => data.prediction_code === competeStr);
        const machineCodes = listToCheck.map(list => list.machine_code);
        const lists = await isTrainedMachine(machineCodes);

        machineData?.forEach(result => map.set(result.machine_code, result));

        if (listToCheck.length < 1) {
            return machineData;
        }

        lists.data.forEach(list => {
            const initValue = list.is_trained ? competeStr : ''
            const machineCode = list.machine_code;
            const result = map.get(machineCode);
            map.set(machineCode, {
                ...result,
                prediction_code: initValue,
                prediction_model: initValue,
                prediction_name: initValue,
                prediction_process: initValue,
                prediction_confidence: initValue
            });
        })

        return Array.from(map.values());
    }

    const mappingData = (machines : any[] , status ?: any []) => {
        return machines?.map((result, index)=>(
            {
                ...result ,
                pressStatus : status && status[index]?.pressStatus ,
                prediction_confidence : convertPredictionConfidence(result.prediction_confidence) ,
                machine_type : TransferCodeToValue(result.machine_type, "machine"),
                color : !comparePredictionResult(result) ? 'red' : undefined,
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

    const comparePredictionResult = (value) => {
        if(!value.code || value.code === '-'){
            return true
        }
        // const codeCheck = value.prediction_code === value.code
        // const modelCheck = value.prediction_model === value.model
        // const nameCheck = value.prediction_name === value.product_name
        const processCheck = value.prediction_process === value.process

        return processCheck
    }

    const getMachineData = async (pages : number = 1) => {

        const tokenData = userInfo?.token;
        try {
            const result  = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
                params : { rangeNeeded : true , distinct : 'mfrCode'},
                headers : { Authorization : tokenData },
            })
            const machineData = result?.data?.info_list
            const trainedMachine = await checkTrainedMachine(machineData)
            setMachineData(trainedMachine)
            setMachineRetryCount(0);
            return trainedMachine

        }catch (e) {
            if(machineRetryCount === limitCount){
                setStatusIntervalTime(null)
                setMachineIntervalTime(null)
                return Notiflix.Report.warning('경고' , '잠시후 다시 시도해 주세요' , '확인')
            }
            setMachineIntervalTime(null)
            setTimeout(() => {
                setMachineRetryCount((prevRetry) => prevRetry + 1);
                setMachineIntervalTime(aiInitTime);
            }, refreshTime);
        }
    }

    const getStatusData = async (mfrCodes : string) => {
        const tokenData = userInfo?.token;
        try {
            const res =  await axios.get(`${SF_ENDPOINT_PMS}/api/v2/monitoring/presses/status`,{
                params : { page : 1 , size : 20 , mfrCodes},
                headers : { Authorization : tokenData},
                timeout : statusIntervalTime
            })
            const content = res?.data?.results?.content
            setStatusData(content);
            setStatusRetryCount(0);
            return content
        } catch (error) {
            if(statusRetryCount === limitCount) return setStatusIntervalTime(null)
            if(statusIntervalTime < pressLimitTime) {
                setTimeout(() => {
                    setStatusIntervalTime((prevTime) => prevTime + 1000);
                }, 1000);
            } else {
                setStatusIntervalTime(null)
                setTimeout(() => {
                    setStatusRetryCount((prevRetry) => prevRetry + 1);
                    setStatusIntervalTime(pressInitTime);
                }, refreshTime);
            }
        }
    };

    const requestInitApi = async () => {
        const machineData = await getMachineData()
        const codes = machineData?.map((result) => result.machine_code)
        const statusData = await getStatusData(codes?.join(','))
        setData(mappingData(machineData,statusData))
    }

    useInterval(async () => {
        const result = await getMachineData()
        setData(mappingData(result,statusData))
    },  !modalOpen ? machineIntervalTime : null);

    useInterval(async () => {
        if(machineData){
            const codes = machineData.map((result)=>result.machine_code)
            const statusData = await getStatusData(codes.join(','))
            setData(mappingData(machineData,statusData))
        }
    },  !modalOpen ? statusIntervalTime : null);

    useEffect(() => {
        requestInitApi()
    }, [modalOpen]);


    return (
        <div>
            <PageHeader
                title={"AI 생산 제품 현황"}
            />
            <ExcelTable
                resizable
                editable
                headerList={column}
                row={data}
                width={1576}
                height={'100%'}
            />
        </div>
    )
}

export default HomeAiProductionLog

import React, {useEffect, useState} from 'react'
import {
    BarcodeModal,
    ExcelTable,
    Header as PageHeader, RequestMethod,
} from 'shared'
import {NextPageContext} from 'next'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import styled from "styled-components";
import moment from "moment";
import BasicModal from "shared/src/components/Modal/BasicModal";
import {MesOperationList as MesOperationDetailList} from '../../Operation/MesOperationList'
import { MultiSelect } from '@mantine/core';
import axios from "axios";
import {SF_ENDPOINT_SERVERLESS} from "shared/src/common/configset";
import {useSelector} from "react-redux";
import {selectUserInfo} from "shared/src/reducer/userInfo";
import cookie from "react-cookies";
import Notiflix from "notiflix";
import {MesRecordList} from "../MesRecordList";
import {AiMesRecord} from "../AiMesRecord";
import {convertIsoTimeToMMSSHH, convertToDateTime, convertToISODate} from "shared/src/common/convertIsoDate";


type RecordType = {
    date : string
    customerModelName : string
    machineName : string
    machineCode : string
    productCode : string
    productName : string
    recordQuantity : string
    timeString : string
}

type MachineType = {
    machineId: number,
    mfrCode: string,
    type: string,
    mfrName?: string,
    name?: string
}

const AiMesRecordListForDs = () => {

    const column = [
        {key : 'date' , name : '작업일자'},
        {key : 'machineName' , name : '기계'},
        {key : 'machineCode' , name : '기계CODE'},
        {key : 'customerModelName' , name : '모델'},
        {key : 'productName' , name : '품목명'},
        {key : 'productCode' , name : '품목CODE'},
        {key : 'recordQuantity' , name : '수량'},
        {key : 'timeString' , name : '시간'},
        {key : 'detail' , name : '상세보기', formatter : ({row, onRowChange}) => {

                return (
                    <>
                        <ModalInfoButton onClick={()=> onRowChange({...row , isVisible : true})}>클릭</ModalInfoButton>
                        {
                            row.isVisible &&
                            <BasicModal
                                backgroundColor={'DARKBLUE'}
                                isOpen={row.isVisible}
                                onClose={() => onRowChange({...row, isVisible : false})}
                            >
                                <AiMesRecord isModal option={1} search={row.sheetCode} date={{from : selectDate.from , to : selectDate.to}}/>
                            </BasicModal>
                        }
                    </>
                )
            }}
    ]
    const userInfo = cookie.load('userInfo')

    const [recordDate , setRecordDate] = useState<string[]>([])
    const [selectRecordDate , setSelectRecordDate] = useState<string[]>([])
    const [machineList , setMachineList] = useState<MachineType[]>([])
    const [selectMachineName , setSelectMachineName] = useState<string[]>([])
    const [recordList, setRecordList] = useState<RecordType[]>([])
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    const getAiOperationDateApi = async () => {
        const tokenData = userInfo?.token;
        const result = await axios.get(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_record/ai/active_date`, {
            params : { start :convertToISODate(selectDate.from) , end : convertToISODate(selectDate.to) },
            headers : { Authorization : tokenData }
        })

        if(result.status === 200) {
            const operationDateList = result.data.response
            setRecordDate(operationDateList.map((list)=> convertToDateTime(list.date)))
        }
    }

    const getAiMachinesApi = async () => {
        const tokenData = userInfo?.token;
        const result = await axios.get(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_record/ai/machine`, {
            headers : { Authorization : tokenData }
        })

        result.status === 200 && setMachineList(result.data.response)
    }

    const getAiRecordListAPi= async (selectedMachineList : string[], selectedDateList :  string[] ) => {

        try {
            Notiflix.Loading.circle()
            const tokenData = userInfo?.token;
            const machineNameList = machineList.filter((machine) => selectedMachineList.includes(machine.name))
            const machineCodeList = machineNameList.map((machine) => machine.mfrCode);
            const result = await axios.post(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_record/ai/list`,{
                    start : convertToISODate(selectDate.from),
                    end : convertToISODate(selectDate.to),
                    machineCode : machineCodeList,
                    date : selectedDateList.map((date)=> convertToISODate(date)),
                    sorts : null,
                    orders : null
                },
                {
                    headers : { Authorization : tokenData }
                }
            )
            if(result.status === 200) {
                Notiflix.Loading.remove()
                setRecordList(result.data.response.map((result)=>({
                    ...result ,
                    date : convertToDateTime(result.date),
                    timeString : (result.start && result.end) ? `${convertIsoTimeToMMSSHH(result.start)} ~ ${convertIsoTimeToMMSSHH(result.end)}` : ''
                })))
            }
        }catch (e) {
            Notiflix.Loading.remove()
        }

    }

    useEffect(()=>{
        getAiMachinesApi()
    },[])

    useEffect(()=>{
        getAiOperationDateApi()
    },[selectDate])

    useEffect(()=>{
        getAiRecordListAPi(selectMachineName,selectRecordDate)
    },[selectDate,selectMachineName,selectRecordDate])

    return (
        <>
            <PageHeader
                isCalendar
                calendarTitle={'작업 기한'}
                calendarType={'period'}
                title={'작업일보 Ai 리스트 - 2'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={setSelectDate}
            />
            <MultiSelectContainer>
                <MultiSelect
                    data={recordDate}
                    onChange={setSelectRecordDate}
                    label="작업일자"
                    placeholder="검색할 작업일자를 선택해주세요"
                    styles={{
                        root : {
                            backgroundColor : 'inherit',
                            marginRight : 10,
                            minWidth : 300,
                        },
                        label : {
                            color : '#FFFFFF'
                        },
                        input : {
                            backgroundColor : 'inherit',
                            color : '#FFFFFF'
                        }
                    }}
                    clearButtonProps={{ 'aria-label': 'Clear selection' }}
                    clearable
                />
                <MultiSelect
                    data={machineList.map((machine)=>machine.name)}
                    onChange={setSelectMachineName}
                    label="기계"
                    placeholder="검색할 기계를 선택해주세요"
                    styles={{
                        root : {
                            backgroundColor : 'inherit',
                            marginRight : 10,
                            minWidth : 300,
                        },
                        label : {
                            color : '#FFFFFF'
                        },
                        input : {
                            backgroundColor : 'inherit',
                            color : '#FFFFFF'
                        }
                    }}
                    clearButtonProps={{ 'aria-label': 'Clear selection' }}
                    clearable
                />
            </MultiSelectContainer>
            <ExcelTable
                width={'100%'}
                headerList={column}
                setRow={setRecordList}
                row={recordList}
            />
        </>
    )

}

export {AiMesRecordListForDs};

const MultiSelectContainer = styled.div`
    display : flex;
    margin-bottom : 10px;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
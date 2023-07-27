import React, {useEffect, useState} from 'react'
import {
    BarcodeModal,
    ExcelTable,
    Header as PageHeader, RequestMethod, UnitContainer,
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
        {key : 'customerModelName' , name : '모델'},
        {key : 'productCode' , name : 'CODE'},
        {key : 'productName' , name : '품목명'},
        {key : 'recordQuantity' , name : '수량'},
        {key : 'timeString' , name : '시간'},
        {key : 'confidence' , name : '유사도', formatter : ({row,column,onRowChange}) => {
            return <UnitContainer row={{...row , confidence : row?.confidence ? row.confidence.toFixed(4) * 100 : 0 }} column={{...column , unitData: "%"}} onRowChange={onRowChange}/>
        }},
        {key : 'detail' , name : '상세보기', formatter : ({row, onRowChange}) => {
                return (
                    <>
                        {
                            row.ai_record_id && <ModalInfoButton onClick={()=> onRowChange({...row , isVisible : true})}>클릭</ModalInfoButton>
                        }
                        {
                            row.isVisible &&
                            <BasicModal
                                backgroundColor={'DARKBLUE'}
                                isOpen={row.isVisible}
                                onClose={() => onRowChange({...row, isVisible : false})}
                            >
                                <AiMesRecord isModal option={6} search={row.ai_record_id} date={{from : selectDate.from , to : selectDate.to}}/>
                            </BasicModal>
                        }
                    </>
                )
            }}
    ]
    const userInfo = cookie.load('userInfo')

    const [recordDate , setRecordDate] = useState<string[]>([])
    const [selectRecordDate , setSelectRecordDate] = useState<{date : string , color ?: string}>()
    const [machineList , setMachineList] = useState<MachineType[]>([])
    const [selectMachineName , setSelectMachineName] = useState<{machineName : string , color?:string}>()
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
            const convertedOperationList = operationDateList.map((list)=> convertToDateTime(list.date))
            setRecordDate(convertedOperationList.map((result)=>({date : result})))
        }
    }

    const getAiMachinesApi = async () => {
        const tokenData = userInfo?.token;
        const result = await axios.get(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_record/ai/machine`, {
            headers : { Authorization : tokenData }
        })

        if(result.status === 200){
            const convertedMachines = result.data.response
            setMachineList(convertedMachines.map((machine)=>({machineName : machine.name , mfrCode : machine.mfrCode})))
        }
    }

    const getAiRecordListAPi= async (selectedMachineList : any, selectedDateList :  any ) => {

        try {
            Notiflix.Loading.circle()
            const tokenData = userInfo?.token;
            const result = await axios.post(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_record/ai/list`,{
                    start : convertToISODate(selectedDateList.date),
                    end : convertToISODate(selectedDateList.date),
                    machineCode : [selectedMachineList.mfrCode],
                    date : [convertToISODate(selectedDateList.date)],
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
        getAiOperationDateApi()
    },[selectDate])

    useEffect(()=>{
        getAiMachinesApi()
    },[selectRecordDate])

    useEffect(()=>{
        getAiRecordListAPi(selectMachineName,selectRecordDate)
    },[selectMachineName,selectRecordDate])

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
            <TableSection>
                <WorkDateTableContainer>
                    <ExcelTable
                        showColorOnClick
                        width={'100%'}
                        headerList={[{key : 'date' , name : '작업일자'}]}
                        row={recordDate}
                        onRowClick={(selectDate)=>{
                            setSelectRecordDate(selectDate)
                            setSelectMachineName(undefined)
                        }}
                    />
                </WorkDateTableContainer>
                {
                    selectRecordDate &&
                    <>
                        <MachineTableContainer>
                            <ExcelTable
                                showColorOnClick
                                width={'100%'}
                                headerList={[{key : 'machineName' , name : '기계'},]}
                                row={machineList}
                                onRowClick={setSelectMachineName}
                            />
                        </MachineTableContainer>
                        {
                            selectMachineName &&
                            <RecordTableContainer>
                                <ExcelTable
                                    showColorOnClick
                                    width={'100%'}
                                    headerList={column}
                                    setRow={setRecordList}
                                    row={recordList}
                                />
                            </RecordTableContainer>
                        }
                    </>
                }
            </TableSection>
        </>
    )

}

export {AiMesRecordListForDs};

const MultiSelectContainer = styled.div`
    display : flex;
    margin-bottom : 10px;
`

const TableSection = styled.div`
    width: 100%;
    display : flex;
    gap : 20px;
`

const WorkDateTableContainer = styled.div`
    flex : 0 0 15%;
`
const MachineTableContainer = styled.div`
    flex : 0 0 15%;
`
const RecordTableContainer = styled.div`
    flex : 0 0 65%;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
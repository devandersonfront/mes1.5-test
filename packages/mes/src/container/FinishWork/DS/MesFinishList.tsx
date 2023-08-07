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
import {MesFinishList} from "../MesFinishList";

import {
    convertIsoTimeToMMSSHH,
    convertToDateTime,
    convertToISODate
} from "shared/src/common/convertIsoDate";


type FinishType = {
    date : string
    customerModelName : string
    machineName : string
    machineCode : string
    productCode : string
    productName : string
    FinishQuantity : string
    timeString : string
}

type MachineType = {
    machineId: number,
    mfrCode: string,
    type: string,
    mfrName?: string,
    name?: string
}
const MesFinishListDS = () => {

    const column = [
        {key : 'customerModelName' , name : '모델'},
        {key : 'productCode' , name : 'CODE'},
        {key : 'productName' , name : '품목명'},
        {key : 'FinishQuantity' , name : '수량'},
        {key : 'timeString' , name : '시간'},
        {key : 'detail' , name : '상세보기', formatter : ({row, onRowChange}) => {
                return (
                    <>
                        {
                            row.os_id && <ModalInfoButton onClick={()=> onRowChange({...row , isVisible : true})}>클릭</ModalInfoButton>
                        }
                        {
                            row.isVisible &&
                            <BasicModal
                                backgroundColor={'DARKBLUE'}
                                isOpen={row.isVisible}
                                onClose={() => onRowChange({...row, isVisible : false})}
                            >
                                <MesFinishList isModal option={7} search={row.os_id} date={{from : selectDate.from , to : selectDate.to}}/>
                            </BasicModal>
                        }
                    </>
                )
            }}
    ]
    const userInfo = cookie.load('userInfo')

    const [finishDate , setFinishDate] = useState<string[]>([])
    const [selectFinishDate , setSelectFinishDate] = useState<{date : string , color ?: string}>()
    const [machineList , setMachineList] = useState<MachineType[]>([])
    const [selectMachineName , setSelectMachineName] = useState<{machineName : string , color?:string}>()
    const [finishList, setFinishList] = useState<FinishType[]>([])
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    const getOperationDateApi = async () => {
        const tokenData = userInfo?.token;
        const result = await axios.get(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_sheet/all/active_date`, {
            params : { start :convertToISODate(selectDate.from) , end : convertToISODate(selectDate.to) , fin : true},
            headers : { Authorization : tokenData }
        })

        if(result.status === 200) {
            const operationDateList = result.data.response
            const convertedOperationList = operationDateList.map((list)=> convertToDateTime(list.date))
            setFinishDate(convertedOperationList.map((result)=>({date : result})))
        }
    }

    const getMachinesApi = async () => {
        const tokenData = userInfo?.token;
        const result = await axios.get(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_sheet/all/machine`, {
            headers : { Authorization : tokenData }
        })

        if(result.status === 200){
            const convertedMachines = result.data.response
            setMachineList(convertedMachines.map((machine)=>({machineName : machine.name , mfrCode : machine.mfrCode})))
        }
    }

    const getFinishListAPi= async (selectedMachineList : any, selectedDateList : any ) => {
        try {
            Notiflix.Loading.circle()
            const tokenData = userInfo?.token;
            const result = await axios.post(`${SF_ENDPOINT_SERVERLESS}/mes15/operation_sheet/all/list`,{
                    start : convertToISODate(selectedDateList.date),
                    end : convertToISODate(selectedDateList.date),
                    machineCode : selectedMachineList ? [selectedMachineList.mfrCode] : undefined,
                    date : [convertToISODate(selectedDateList.date)],
                    sorts : "sortIndex",
                    orders : "ASC",
                    fin : true
                },
                {
                    headers : { Authorization : tokenData }
                }
            )
            if(result.status === 200) {
                Notiflix.Loading.remove()
                setFinishList(result.data.response.filter((record)=>record.os_id).map((result)=>({
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
        getOperationDateApi()
    },[selectDate])

    useEffect(()=>{
        getMachinesApi()
    },[selectFinishDate])

    useEffect(()=>{
        getFinishListAPi(selectMachineName,selectFinishDate)
    },[selectMachineName,selectFinishDate])

    return (
        <>
            <PageHeader
                isCalendar
                calendarTitle={'작업 기한'}
                calendarType={'period'}
                title={'작업 완료 리스트-2'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={(selectDate : {from:string, to:string})=>{
                    setSelectDate(selectDate)
                    setSelectFinishDate(null)
                }}
            />
            <TableSection>
                <WorkDateTableContainer>
                    <ExcelTable
                        showColorOnClick
                        width={'100%'}
                        headerList={[{key : 'date' , name : '작업일자'}]}
                        row={finishDate}
                        onRowClick={(selectDate)=>{
                            setSelectFinishDate(selectDate)
                            setSelectMachineName(undefined)
                        }}
                    />
                </WorkDateTableContainer>
                {
                    selectFinishDate &&
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
                        <FinishTableContainer>
                            <ExcelTable
                                showColorOnClick
                                width={'100%'}
                                headerList={column}
                                setRow={setFinishList}
                                row={finishList}
                            />
                        </FinishTableContainer>
                    </>
                }
            </TableSection>
        </>
    )

}

export {MesFinishListDS};

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
const FinishTableContainer = styled.div`
    flex : 0 0 65%;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
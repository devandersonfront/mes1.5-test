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
import BasicModal from "../../../../../shared/src/components/Modal/BasicModal";
import {MesOperationList as MesOperationDetailList} from '../MesOperationList'
import { MultiSelect } from '@mantine/core';


type RecordType = {
    model : string
    code : string
    product_name : string
    quantity : string
    time : string
}

type MachineType = {
    machineId: number,
    mfrCode: string,
    type: string,
    mfrName?: string,
    name?: string
}

const MesOperationList = () => {

    const column = [
        {key : 'date' , name : '작업일자'},
        {key : 'machine' , name : '기계'},
        {key : 'model' , name : '모델'},
        {key : 'code' , name : 'CODE'},
        {key : 'product_name' , name : '품목명'},
        {key : 'quantity' , name : '수량'},
        {key : 'time' , name : '시간'},
        {key : 'detail' , name : '상세보기', formatter : ({row, onRowChange}) => {
            return (
                <>
                    <ModalInfoButton onClick={onClickInfoButton}>클릭</ModalInfoButton>
                    {
                        row.isVisible &&
                        <BasicModal
                            backgroundColor={'DARKBLUE'}
                            isOpen={row.isVisible}
                            onClose={() => onRowChange({...row, isVisible : false})}
                        >
                            <MesOperationDetailList row={row} isDetail />
                        </BasicModal>
                    }
                </>
            )
        }}
    ]

    const [recordDate , setRecordDate] = useState<string[]>([])
    const [selectRecordDate , setSelectRecordDate] = useState<string[]>([])
    const [machineList , setMachineList] = useState<MachineType[]>([])
    const [selectMachineName , setSelectMachineName] = useState<string[]>([])
    const [recordList, setRecordList] = useState<RecordType[]>([])
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    const getOperationDateApi = async () => {
        const result = await RequestMethod('get','operationDate',{
            params : {date : {from : selectDate.from , to : selectDate.to}}
        })
        if(result) setRecordDate(result)
    }

    const getMachinesApi = async () => {
        const result = await RequestMethod('get','operationMachines')
        if(result) {
            setMachineList(result)
        }
    }

    const getRecordListAPi= async (selectedMachineList : string[], selectedDateList :  string[] ) => {

        const machineNameList = machineList.filter((machine) => selectedMachineList.includes(machine.name))
        const machineCodeList = machineNameList.map((machine) => machine.mfrCode);

        const result = await RequestMethod('get','operationRecords',{
            params : {
                start : selectDate.from,
                end : selectDate.to,
                machineCode : machineCodeList,
                date : selectedDateList,
                page : 1,
                renderItem : 18,
                sorts : null,
                orders : null
            }
        })

        if(result) setRecordList(result)
    }

    const onClickInfoButton = () => {
        setRecordList((row)=>({...row , isVisible : true}))
    }

    useEffect(()=>{
        getMachinesApi()
    },[])

    useEffect(()=>{
        getOperationDateApi()
    },[selectDate])

    useEffect(()=>{
        getRecordListAPi(selectMachineName,selectRecordDate)
    },[selectMachineName,selectRecordDate])

    return (
        <>
            <PageHeader
                isCalendar
                calendarTitle={'작업 기한'}
                calendarType={'period'}
                title={'작업지시서 리스트 - 2'}
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

export {MesOperationList};

const MultiSelectContainer = styled.div`
    display : flex;
    margin-bottom : 10px;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
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


const MesOperationList = () => {

    const column = [
        {key : 'date' , name : '작업일자'},
        {key : 'machine' , name : '기계'},
        {key : 'model' , name : '모델'},
        {key : 'code' , name : 'CODE'},
        {key : 'product_name' , name : '품목명'},
        {key : 'quantity' , name : '수량'},
        {key : 'time' , name : '시간'},
        {key : 'detail' , name : '상세보기', formatter : ({row}) => {
            return (
                <ModalInfoButton onClick={onClickInfoButton}>클릭</ModalInfoButton>
            )
        }}
    ]

    const [recordDate] = useState<string[]>(['React', 'Angular', 'Svelte', 'Vue', 'Riot', 'Next.js', 'Blitz.js'])
    const [selectRecordDate , setSelectRecordDate] = useState<string[]>([])
    const [machine] = useState<string[]>(['A','B','C','D','E'])
    const [selectMachine , setSelectMachine] = useState<string[]>([])

    const [recordList, setRecordList] = useState<RecordType[]>([
        {model : 'NQ' , code : '65-wt', product_name : '브라켓 1차' , quantity : '1000' , time :'08:30 ~ 11:30'},
        {model : 'SQ' , code : '85-wt', product_name : '브라켓 2차' , quantity : '2000' , time :'09:30 ~ 12:30'}
    ])

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    const [isVisible , setIsVisible] = useState<boolean>(false)

    const getOperationDateApi = async () => {
        const result = RequestMethod('get','operationDate',{
            params : {date : {from : selectDate.from , to : selectDate.to}}
        })
        if(result){
            // setRecordDate()
        }
    }

    const getMachinesApi = (operationDateId : number) => {
        // const result = RequestMethod('get','operationMachines',{
        //     params : {operationDateId : operationDateId}
        // })
    }
    const getRecordListAPi= () => {
        // const result = RequestMethod('get','operationRecords',{
        //     params : {machineId : machineId}
        // })
    }

    const onClickInfoButton = () => {
        setIsVisible(true)
    }

    useEffect(()=>{
        getRecordListAPi()
    },[])


    return (
        <>
            <PageHeader
                isCalendar
                calendarTitle={'작업 기한'}
                calendarType={'period'}
                title={'작업일보 리스트 - 2'}
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
                            minWidth : 300,
                        },
                        label : {
                            color : '#FFFFFF'
                    }}}
                    clearButtonProps={{ 'aria-label': 'Clear selection' }}
                    clearable
                />
                <MultiSelect
                    data={machine}
                    onChange={setSelectMachine}
                    label="기계"
                    placeholder="검색할 기계를 선택해주세요"
                    styles={{
                        root : {
                            minWidth : 300,
                        },
                        label : {
                            color : '#FFFFFF'
                    }}}
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
            <BasicModal backgroundColor={'DARKBLUE'} isOpen={isVisible} onClose={()=>{setIsVisible(false)}}>
                <MesOperationDetailList isDetail/>
            </BasicModal>
        </>
    )

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

export {MesOperationList};

const MultiSelectContainer = styled.div`
    margin-bottom : 10px;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
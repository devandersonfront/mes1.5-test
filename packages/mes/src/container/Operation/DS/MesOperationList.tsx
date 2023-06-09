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


type RecordType = {
    model : string
    code : string
    product_name : string
    quantity : string
    time : string
}


const MesOperationList = () => {

    const recordColumn = [
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

    const [operationDate , setOperationDate] = useState<Array<{date : string , id : number}>>([
        {date : '2023-05-14' , id : 1},
        {date : '2023-05-15' , id : 2},
        {date : '2023-05-15' , id : 3},
        {date : '2023-05-15' , id : 4},
        {date : '2023-05-15' , id : 5},
        {date : '2023-05-15' , id : 6},
    ])

    const [machines , setMachines] = useState<Array<{machine_name : string , id : number}>>([
        {machine_name : '400ton 피더 프레스' , id : 1},
        {machine_name : '250ton 피더 프레스' , id : 2},
        {machine_name : '250ton 피더 프레스' , id : 3},
        {machine_name : '250ton 피더 프레스' , id : 4},
        {machine_name : '250ton 피더 프레스' , id : 5},
    ])

    const [record, setRecord] = useState<RecordType[]>([
        {model : 'NQ' , code : '65-wt', product_name : '브라켓 1차' , quantity : '1000' , time :'08:30 ~ 11:30'},
        {model : 'SQ' , code : '85-wt', product_name : '브라켓 2차' , quantity : '2000' , time :'09:30 ~ 12:30'}
    ])

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment().subtract(1,'month').format('YYYY-MM-DD'),
        to: moment().format('YYYY-MM-DD')
    })

    const [isVisible , setIsVisible] = useState<boolean>(false)

    const getOperationDate = async () => {
        const result = RequestMethod('get','operationDate',{
            params : {date : {from : selectDate.from , to : selectDate.to}}
        })
    }

    const getMachinesApi = (operationDateId : number) => {
        // const result = RequestMethod('get','operationMachines',{
        //     params : {operationDateId : operationDateId}
        // })
    }
    const getRecordApi = (machineId : number) => {
        // const result = RequestMethod('get','operationRecords',{
        //     params : {machineId : machineId}
        // })
    }

    const buttonsOnclick = async (index : number) => {
        switch (index) {
            case 0 : {
                return await getOperationDate()
            }
        }
    }

    const onClickInfoButton = () => {
        setIsVisible(true)
    }

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
                buttons={['조회']}
                buttonsOnclick={buttonsOnclick}
            />
            <MesOperationContainer>
                <DateTableSection>
                    <ExcelTable
                        width={'100%'}
                        showColorOnClick
                        headerList={[{key : 'date' , name : '작업일자'}]}
                        row={operationDate}
                        onRowClick={(selectedRow) => {
                            const operationDateId = selectedRow.id
                            getMachinesApi(operationDateId)
                        }}
                    />
                </DateTableSection>
                <MachineTableSection>
                    <ExcelTable
                        width={'100%'}
                        showColorOnClick
                        headerList={[{key : 'machine_name' , name : '기계'}]}
                        row={machines}
                        onRowClick={(selectedRow) => {
                            const machineId = selectedRow.id
                            getRecordApi(machineId)
                        }}
                    />
                </MachineTableSection>
                <RecordTableSection>
                    <ExcelTable
                        width={'100%'}
                        showColorOnClick
                        headerList={recordColumn}
                        row={record}
                    />
                </RecordTableSection>
            </MesOperationContainer>
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

const MesOperationContainer = styled.div`
    display : flex;
    width : 1500px;
    gap : 3%;
`

const DateTableSection = styled.div`
    flex : 1 0 15%;   
`
const MachineTableSection = styled.div`
    flex : 1 0 20%;
`
const RecordTableSection = styled.div`
    flex : 1 0 55%;
`

const ModalInfoButton = styled.div`
    text-decoration-line: underline;
`
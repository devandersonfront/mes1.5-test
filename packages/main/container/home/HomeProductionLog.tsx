import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    PaginationComponent,
    RequestMethod, SF_ENDPOINT,
    TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {NextPageContext} from 'next'
import moment from "moment"
import axios from "axios";
import cookie from "react-cookies";
import ErrorList from "shared/src/common/ErrorList";
import {setExcelTableHeight} from "shared/src/common/Util";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const HomeProductionLog = ({}: IProps) => {
    const [ basicRow, setBasicRow ] = useState<Array<any>>([])
    const [ column, setColumn ] = useState<Array<IExcelHeaderType>>(columnlist["productionLog"])
    const [ page, setPage ] = React.useState<{ current_page: number, totalPages: number }>({
        current_page: 1,
        totalPages : 1
    });
    const userInfo = cookie.load('userInfo')
    useEffect(() => {
        if(userInfo?.ca_id?.authorities?.some(auth => ['ROLE_PROD_02', 'ROLE_PROD_06'].includes(auth))){
            Notiflix.Loading.circle()
            LoadBasic()
            const dashboard = setInterval(()=>{
                LoadBasic()
            },30000)
            return () => {
                clearInterval(dashboard)
            }
        }
    },[])

    const LoadBasic = async (pages : number = 1) => {
        try {
            const tokenData = userInfo?.token;
            const res = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/monitoring/list/${pages}/20`,{
                params : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'},
                headers : { Authorization : tokenData }
            })
            if(res.status === 200){
                Notiflix.Loading.remove()
                const {info_list , page, totalPages, menus} = res.data
                const renewalColumn = convertColumn(menus)
                const renewalData = convertData(info_list)
                setBasicRow(renewalData)
                setColumn(renewalColumn)
                setPage({current_page : page , totalPages : totalPages})
            }
        }catch (error) {
            if(error?.response?.status){
                const errorNum : number = error?.response?.status
                const message : string = error?.response?.data?.message
                const [errorHeader,errorMessage] = ErrorList({errorNum , message})
                Notiflix.Report.failure(errorHeader, errorMessage ,'확인')
                Notiflix.Loading.remove()
            }
        }
    }

    const convertColumn = (columns : any) => {
        let renewalColumn : any = []
        column.map((v, i) => {
            columns.map((column) => {
                if(!column.hide){
                    if (column.colName === v.key) {
                        renewalColumn.push({ ...columnlist['productionLog'][i], key: column.colName, name: column.title })
                    }
                }
            })
        })
        return renewalColumn
    }

    const convertData = (data : any) => {
        return data.map((list,index)=>({...list , order : index + 1}))
    }

    return (
        <div>
            <PageHeader
                title={"생산 현황"}
                isCalendar
                calendarType={"current"}
            />
            <ExcelTable
                editable
                headerList={column}
                row={basicRow}
                setRow={setBasicRow}
                width={1576}
                height={setExcelTableHeight(basicRow.length)}
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

export {HomeProductionLog};

import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
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
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import {useDispatch} from "react-redux";
import {Stomp} from "@stomp/stompjs"
//@ts-ignore
import SockJS from "sockjs-client"
import cookie from "react-cookies";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import axios from "axios";
import moment from "moment";
import ErrorList from "shared/src/common/ErrorList";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const dummyData = [
    {
        state:"ready",
        machine_name:"세척기-1호",
        machine_type:"코팅기",
        identification:"20210401-01",
        deadline:"2022-05-18",
        customer:'안녕',
        model:'하이',
        code : '123',
        product_name: '이름',
        process:"코팅",
        prediction_model:"-",
        prediction_code:"-",
        prediction_name:"-",
        goal:"0",
        total_good_quantity:"0",
        achievement:"0",
        predict : true,
    },
    {
        state:"ready",
        machine_name:"세척기-1호",
        machine_type:"코팅기",
        identification:"20210401-01",
        deadline:"2022-05-18",
        customer:'안녕',
        model:'하이',
        code : '123',
        product_name: '이름',
        process:"코팅",
        prediction_model:"-",
        prediction_code:"-",
        prediction_name:"-",
        goal:"0",
        total_good_quantity:"0",
        achievement:"0",
        predict : false,
        color : 'red'
    }
]


const HomeAiProductionLog = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const userInfo = cookie.load('userInfo')
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductLog"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ page, setPage ] = React.useState<{ current_page: number, totalPages: number }>({
        current_page: 1,
        totalPages : 1
    });


    useEffect(() => {
        // if(userInfo?.ca_id?.authorities?.some(auth => ['ROLE_PROD_02', 'ROLE_PROD_06'].includes(auth))){
            Notiflix.Loading.circle()
            LoadBasic()
            const dashboard = setInterval(()=>{
                LoadBasic()
            },30000)
            return () => {
                clearInterval(dashboard)
            }
        // }
    },[])

    const LoadBasic = async (pages : number = 1) => {
        try {
            const tokenData = userInfo?.token;
            const res = await axios.get(`${SF_ENDPOINT}/api/v1/sheet/ai/monitoring/list/${pages}/20`,{
                params : { rangeNeeded : true , from : moment().format('YYYY-MM-DD') , to : '9999-12-31'},
                headers : { Authorization : tokenData }
            })
            if(res.status === 200){
                Notiflix.Loading.remove()
                const {info_list , page, totalPages, menus} = res.data



                setBasicRow(info_list)
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


    useEffect(() => {
        dispatch(
            setMenuSelectState({ main: "HOME", sub: router.pathname })
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);


    return (
        <div>
            <PageHeader
                title={"AI 생산 제품 현황"}
            />
            <ExcelTable
                editable
                headerList={column}
                row={dummyData}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
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

export {HomeAiProductionLog};
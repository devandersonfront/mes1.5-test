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
    RequestMethod,
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

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const HomeAiProductionLog = ({page, keyword, option}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["aiProductState"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    // 통신
    useEffect(() => {
        const tokenData = cookie.load('userInfo').token
        const sockJs = new SockJS(`http://192.168.0.12:8445/out-websocket?token=${tokenData}`)
        const stomp = Stomp.over(sockJs)

        stomp.connect({}, (res) =>{
            stomp.subscribe(`/topic/private/record/${res.headers["user-name"]}`, (sub) => {
                const dataBody = JSON.parse(sub.body)

            },)
        })
        return () => {
            stomp.disconnect()
        }
    },[])

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
                row={basicRow}
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
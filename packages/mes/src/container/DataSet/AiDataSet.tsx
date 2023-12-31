import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {columnlist, ExcelTable, Header as PageHeader, PaginationComponent, RequestMethod, SF_ENDPOINT} from "shared";
import {PointColorButton} from "../../../../main/styles/styledComponents";
import {TableSortingOptionType} from "shared/src/@types/type";
import Notiflix from "notiflix";
import cookie from "react-cookies"
import {AI_ADDRESS} from "shared/src/common/configset";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";

const AiDataSet = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [column, setColumn] = useState(columnlist.dataSet)
    const [basicRow, setBasicRow] = useState<any[]>([])
    const [f1_score, setF1_Score] = useState<string>("0")
    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });
    const onclick = (download, fileName:string) => {
        let aTag = document.createElement("a")
        aTag.download = fileName+".csv"
        aTag.href = `https://sizl-ai.s3.amazonaws.com/${download.slice(13)}`
        aTag.click()
    }

    const downloadButton =  (row) => {
        return (
            <div style={{height:"40px",display:"flex",justifyContent:"center",alignItems:"center",}}>
                <PointColorButton onClick={() => {
                    onclick(row.row.path, row.row.product_info.product_name)
                }} style={{
                    width:"80%",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    height:35,
                }}>
                    파일 다운로드
                </PointColorButton>
            </div>
        )
    }

    const ScoreBoard = () => {
        return (
            <div style={{display:"flex",justifyContent:"right", color:"white",fontSize:"1.2em", alignItems:"flex-end", height:"100%"}}>
                금일 학습모델 F1 Score : {f1_score}
            </div>
        )
    }

    const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();

        const useInfo = cookie.load("userInfo")

        const res = await RequestMethod("get", 'datasetList', {
            params: {
                page: page,
                pageSize: 18,
                company_code:useInfo.company
            },
        });

        const f1Res = await RequestMethod("get", "f1Score", {
            params:{company_code:useInfo.company}
        })

        dataSetting(res)
        setF1_Score(f1Res.f1_score ?? "-")
        setColumn([...column.map((v) => {
            if(v.key == "download") return {...v, formatter:downloadButton}
            return v
        })])

        Notiflix.Loading.remove()
    };
    const dataSetting = (data:any) => {
        const result = data?.rows?.map((row) =>{
            return {
                ...row,
                name:row?.product_info?.product_name,
                code:row?.product_info?.product_code,
                machine_name:row?.machine_name,
                start:row.start,
                end:row.end,
                valid_data:row.count,
                download:row.path,
            }
        })
        setBasicRow(result)
        setPageInfo({page:data.page, total:data.totalPages})
    }
    useEffect(() => {
        getData()
    },[])
    useEffect(() => {
        dispatch(setMenuSelectState({ main: "AI 데이터셋", sub: "/mes/ai/dataset" }));
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);
    return (
        <div>
            <PageHeader
                title={"AI 데이터셋"}
                score={ScoreBoard()}
            />
            <ExcelTable
                editable
                resizable
                headerList={column}
                row={basicRow}
                width={1576}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    getData(page)
                    setPageInfo({...pageInfo, page: page})
                }}
            />
        </div>
    )
}

export {AiDataSet}

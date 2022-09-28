import React, {useEffect, useState} from 'react'
import {useRef} from "react";
import {ExcelTable} from "../Excel/ExcelTable";
import {RequestMethod} from "../../common/RequestFunctions";
import axios from "axios";
import {SF_ENDPOINT} from "../../common/configset";
import cookie from "react-cookies";
import {columnlist} from "../../common/columnInit";
import Notiflix from "notiflix";
import ErrorList from "../../common/ErrorList";
import {TransferCodeToValue} from "../../common/TransferFunction";

export interface DataGridHandle {
    element: HTMLDivElement | null;
    scrollToColumn: (colIdx: number) => void;
    scrollToRow: (rowIdx: number) => void;
    selectCell: (position: any, enableEditor?: boolean) => void;
}

type MaterialType = {
    type : '원자재' | '부자재' | '제품'
    productType ?: string | number
    customer_name : string
    customer_model ?: string
    code : string
    stock : number
    totalWeight ?: string
}

const StockDetailGrid = ({product}) => {

    const userInfo = cookie.load('userInfo')
    const tokenData = userInfo?.token;
    const [material , setMaterial] = useState<MaterialType[]>([])

    const getStockDetailApi = async () => {
        Notiflix.Loading.circle()
        try {
            const res = await axios.post(`${SF_ENDPOINT}/api/v1/stock/bom/load`,
                [product], {headers: {'Authorization': tokenData}}
            )
            if(res){
                const {data} = res
                const newData = convertData(data[0]?.bom_stock)
                setMaterial(newData)
                Notiflix.Loading.remove()
            }

        }catch (error) {
            const errorNum : number = error?.response?.status
            const message : string = error?.response?.data?.message
            const [errorHeader,errorMessage] = ErrorList({errorNum , message})
            Notiflix.Report.failure(errorHeader, errorMessage ,'확인')
            Notiflix.Loading.remove()
        }
    }

    const classifyData = (data) : MaterialType => {
        switch (data.type){
            case 0 :
                return {
                    type : '원자재',
                    customer_name : data.rawMaterial.customer?.name ?? '-',
                    productType : '-',
                    customer_model : '-',
                    code : data.rawMaterial.code,
                    stock : data.rawMaterial.stock,
                    totalWeight :`${data.totalWeight}${data.rawMaterial.unit ? '장' : 'kg'}`
                }
            case 1 :
                return {
                    type : '부자재',
                    customer_name : data.subMaterial.customer?.name ?? '-',
                    productType : '-',
                    customer_model : '-',
                    code : data.subMaterial.code,
                    stock : data.subMaterial.stock,
                    totalWeight : `${data.totalWeight}${data.subMaterial.unit}`
                }
            case 2 :
                return {
                    type : '제품',
                    customer_name : data.product.customer?.name ?? '-',
                    productType : !Number.isNaN(data.product.type) ? TransferCodeToValue(data.product.type, "product") : "-",
                    customer_model : data.product.model?.name ?? '-',
                    code : data.product.code,
                    stock : data.product.stock,
                    totalWeight : '-'
                    // totalWeight : `${data.totalWeight}${data.product.unit}`
                }
        }
    }


    const convertData = (bomStock) => {
        return bomStock.map((data)=> classifyData(data))
    }

    useEffect(()=>{
        getStockDetailApi()
    },[])

    function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
        if (event.isDefaultPrevented()) {
            event.stopPropagation();
        }
    }

    return (
        <div onKeyDown={onKeyDown} style={{height : '100%'}}>
            <ExcelTable
                row={material}
                headerList={columnlist['stockV2Detail']}
                height={'100%'}
            />
        </div>
    );
}

export default StockDetailGrid

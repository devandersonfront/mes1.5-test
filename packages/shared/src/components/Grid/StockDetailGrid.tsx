import React, {useEffect, useState} from 'react'
import {ExcelTable} from "../Excel/ExcelTable";
import {columnlist} from "../../common/columnInit";
import {TransferCodeToValue} from "../../common/TransferFunction";

type MaterialType = {
    type : '원자재' | '부자재' | string | number
    productType ?: string | number
    customer_name : string
    customer_model ?: string
    code : string
    stock : number
    totalWeight ?: string
}

const StockDetailGrid = ({data}) => {
    const [material , setMaterial] = useState<MaterialType[]>([])
    useEffect(()=>{
        getStockDetailApi()
    },[])

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
                    totalWeight :`${data.totalWeight}${TransferCodeToValue(data.rawMaterial.unit, 'rawMaterialUnit')}`
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
                    type : TransferCodeToValue(data.product.type, "product"),
                    customer_name : data.product.customer?.name ?? '-',
                    productType : TransferCodeToValue(data.product.type, "productType"),
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

    const getStockDetailApi = () => {
        if(data){
            const newData = convertData(data?.[0]?.bom_stock)
            setMaterial(newData)
        }
    }

    return (
        <div style={{height : '100%', width: '100%'}}>
            <ExcelTable
                row={material}
                headerList={columnlist['stockDetail']}
                height={'100%'}
                width={'100%'}
            />
        </div>
    );
}

export default StockDetailGrid

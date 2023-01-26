import {BarcodeSettingType} from "./type";

const materialTypeKor = (type) => {
    switch (type) {
        case '완제품' :
            return 6
        case '반제품':
        case '재공품':
            return 7
        default :
            return 2
    }
}

const materialTypeNum = (type) => {
    switch (type) {
        //완제품
        case 2:
            return 6
        //반제품,제공품
        case 1:
        case 0:
            return 7
        default :
            return 5
    }
}

export const barcodeOfCompany = (companyCode : string , data ?: any) : BarcodeSettingType => {

    const basicDefault = {
        //원자재 기준정보 , 재고현황
        rm_tab : true,
        rm_materialType : 2,
        rm_drawBitMap : 800,
        rm_safetyStock : false,
        //제품 등록 관리
        pm_tab : true,
        pm_materialType : 2,
        pm_drawBitMap : 800,
        //원자재 입고 현황
        ri_tab : true,
        ri_drawBitMap : 800,
        ri_materialType : 3,
        ri_materialSize : `${data?.depth} * ${data?.width}`,
        //작업 이력
        op_tab : true,
        op_materialType : 5,
        op_drawBitMap : 800,
        op_material_bom_lot : null,
        companyCode : null
    }

    switch(companyCode){
        case '2SZ57L' :
            return {
                ...basicDefault,
                rm_tab : false,
                pm_materialType : materialTypeKor(data?.type),
                pm_drawBitMap :  materialTypeKor(data?.type) === 7 ? 895 : 800,
                ri_materialType : 8,
                ri_drawBitMap : 895,
                op_materialType : materialTypeNum(data?.product?.type),
                op_drawBitMap : 895,
                companyCode : companyCode

            }
        case '4XX21Z' :
            return {
                ...basicDefault,
                companyCode : companyCode,
                rm_safetyStock : true
            }
        case 'OGU84E' :
            return {
                ...basicDefault,
                rm_tab : false,
                companyCode : companyCode
            }
        case '4MN60H' :
            return {
                ...basicDefault,
                ri_materialSize : `${data?.depth} * ${data?.width} * ${data?.height}`,
                op_material_bom_lot : data?.bom?.map((v)=>{
                    if(v.lot.child_lot_rm){
                        return v.lot.child_lot_rm.lot_number
                    }else if(v.lot.child_lot_sm){
                        return v.lot.child_lot_sm.lot_number
                    }else if(v.lot.child_lot_record){
                        return v.lot.child_lot_record.lot_number
                    }else if(v.lot.child_lot_outsourcing){
                        return v.lot.child_lot_outsourcing.lot_number
                    }
                })?.join(','),
                companyCode : companyCode
            }
        default : return basicDefault
    }
}



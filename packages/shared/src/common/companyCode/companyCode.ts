// export const companyCode = ['4XX21Z','2SZ57L','OGU84E','4MN60H']
// export const unUsedCompanyCode = ['2SZ57L','OGU84E']

const materialTypeOne = (data ?: any) => {
    switch (data.type) {
        case '완제품' :
            return 6
        case '반제품':
        case '재공품':
            return 7
        default :
            return 2
    }
}

const materialTypeTwo = (data) => {
    switch (data.type) {
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

const initSetting : BarcodeSettingType = {
    rawMgmtTab : true,
    rawMgmt_materialType : 2,
    productMgmtTab : true,
    productMgmt_materialType : 2,
    rawInputListTab : true,
    rawInputList_materialType : 3,
    opComListTab : true,
    opComListTab_materialType : 5
}


export const companyCode = (code : string , data ?: any) => {
    switch (code) {
        case '2SZ57L' :
            return {...initSetting ,
                    rawMgmtTab : false ,
                    productMgmt_materialType : materialTypeOne(data.type) ,
                    drawBitmap : '895'
                    }
        default : return {...initSetting}
    }
}


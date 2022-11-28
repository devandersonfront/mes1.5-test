export const companyCode = ['4XX21Z','2SZ57L','OGU84E','4MN60H']
export const unUsedCompanyCode = ['2SZ57L','OGU84E']

export const customBarcodeCompanyCode = (code : string) => {
    return companyCode.includes(code) ? code : null
}

//
// const defaultSetting = {rawMgmtTab : true , productMgmtTab : true , }
//
// const companyBarCode = [
//     {companyCode : '2SZ57L' , rawMgmtTab : false , productMgmtTab : true}
//
// ]


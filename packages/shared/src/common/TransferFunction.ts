type TransferType = "productType" | "material" | "rawMaterialType"

interface CodeType {
  code: number
  value: string
}
const PRODUCT_TYPE : Array<CodeType> = [
  {code: 2, value: '완제품'},
  {code: 0, value: '반제품'},
  {code: 1, value: '재공품'},
]
const MATERIAL_CODE: Array<CodeType> = [
  {code: 0, value: "원자재"},
  {code: 1, value: "부자재"},
  {code: 2, value: "완제품"},
]

const RAW_MATERIAL_TYPE_CODE: Array<CodeType> = [
  {code: 0, value: "반제품"},
  {code: 1, value: "COIL"},
  {code: 2, value: "SHEET"},
]


export const TransferCodeToValue = (code: number, type:TransferType) => {
  let value = "";
  switch (type) {
    case "productType": {
      PRODUCT_TYPE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      break;
    }

    case 'material': {
      MATERIAL_CODE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })

      break;
    }
    case 'rawMaterialType': {
      RAW_MATERIAL_TYPE_CODE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      break;
    }
  }

  return value
}

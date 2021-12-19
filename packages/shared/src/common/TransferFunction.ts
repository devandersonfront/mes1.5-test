type TransferType = "productType" | "material" | "rawMaterialType" | "workStatus" | 'machine'

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

const WORK_STATUS: Array<CodeType> = [
  {code: 0, value: '작업 중'},
  {code: 1, value: '시작 전'},
  {code: 2, value: '작업 종료'},
]

const MACHINE_TYPE: Array<CodeType> = [
  {code: 0, value: "선택없음"},
  {code: 1, value: "프레스"},
  {code: 2, value: "로봇"},
  {code: 3, value: "용접기"},
  {code: 4, value: "밀링"},
  {code: 5, value: "선반"},
  {code: 6, value: "탭핑기"},
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
    case 'workStatus': {
      WORK_STATUS.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
    }
    case 'machine': {
      MACHINE_TYPE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
    }
  }

  if(value === ""){
    return code
  }else{
    return value
  }
}

import { TransferType } from '../@types/type'

interface CodeType {
  code: number
  value: string
}
const PRODUCT_TYPE : Array<CodeType> = [
  {code: 2, value: '완제품'},
  {code: 0, value: '반제품'},
  {code: 1, value: '재공품'},
  {code: 3, value: '반제품'},
  {code: 4, value: '완제품'},
]
const MATERIAL_CODE: Array<CodeType> = [
  {code: 0, value: "원자재"},
  {code: 1, value: "부자재"},
  {code: 2, value: "완제품"},
]

const RAW_MATERIAL_TYPE_CODE: Array<CodeType> = [
  {code: 0, value: "NONE"},
  {code: 1, value: "COIL"},
  {code: 2, value: "SHEET"},
]

export const RAW_MATERIAL_UNIT_CODE: Array<CodeType> = [
  {code: 0, value: 'kg'},
  {code: 1, value: '장'},
  {code: 2, value: 'mm'},
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
const WELDING_TYPE : Array<CodeType> = [
  {code: 0, value: '선택없음'},
  {code: 1, value: '아르곤'},
  {code: 2, value: '스팟'},
  {code: 3, value: '통합'},
]

const EXPORT_TYPE : Array<CodeType> = [
  {code:0, value:"생산"},
  {code:1, value:"반품"},
  {code:2, value:"판매"},
  {code:3, value:"기타"},
]

export const TransferCodeToValue = (code: number, type:TransferType) => {
  let value = "";

  switch (type) {
    case "productType": {
      value = code === undefined ? '(선택 없음)' : code < 3 ? '생산품' : '외주품'
      break;
    }
    case "product": {
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
    case 'rawMaterial': {
      value = "원자재"
      // RAW_MATERIAL_TYPE_CODE.map(v => {
      //   if(v.code === code){
      //     value = v.value;
      //   }
      // })
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
    case 'rawMaterialUnit': {
      RAW_MATERIAL_UNIT_CODE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      if(value === '') value = 'kg'
      break;
    }
    case "subMaterial" :{
      value = "부자재"
      break;
    }
    case 'workStatus': {
      WORK_STATUS.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      break
    }
    case 'machine': {
      MACHINE_TYPE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      break
    }
    case 'welding': {
      WELDING_TYPE.map(v => {
        if(v.code === code){
          value = v.value;
        }
      })
      break
    }
    case 'export':{
      EXPORT_TYPE.map(v => {
        if(v.code === code){
          value = v.value
        }
      })
      break
    }
    case null : {
      return "-"
    }
  }

  if(value === ""){
    return code
  }else{
    return value
  }
}

export const TransferEngToKor = (value:string) => {
  switch(value){
    case 'rawMaterial': return '원자재'
    case 'subMaterial': return '부자재'
  }
}


export const TransferValueToCode = (value: string, type:TransferType) => {
  let code = 0;
  switch (type) {
    case "productType": {
      PRODUCT_TYPE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break;
    }
    case "product": {
      PRODUCT_TYPE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break;
    }
    case 'material': {
      MATERIAL_CODE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break;
    }
    case 'rawMaterial': {
      value = "원자재"
      // RAW_MATERIAL_TYPE_CODE.map(v => {
      //   if(v.code === code){
      //     value = v.value;
      //   }
      // })
      break;
    }
    case 'rawMaterialType': {
      RAW_MATERIAL_TYPE_CODE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break;
    }
    case 'rawMaterialUnit': {
      RAW_MATERIAL_UNIT_CODE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break;
    }
    case "subMaterial" :{
      value = "부자재"
      break;
    }
    case 'workStatus': {
      WORK_STATUS.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break
    }
    case 'machine': {
      MACHINE_TYPE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break
    }
    case 'welding': {
      WELDING_TYPE.map(v => {
        if(v.value === value){
          code = v.code;
        }
      })
      break
    }
    case 'export':{
      EXPORT_TYPE.map(v => {
        if(v.value === value){
          code = v.code
        }
      })
      break
    }
    case null : {
      return "-"
    }
  }

  if(value === ""){
    return value
  }else{
    return code
  }
}

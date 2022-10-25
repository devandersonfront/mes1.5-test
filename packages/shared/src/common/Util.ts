import {BomObjectType, BomType, TableSortingOptionType} from '../@types/type'
import { TransferCodeToValue } from './TransferFunction'

export const ParseResponse = (res: any | string | any[]) : any[] => {
  if (typeof res === 'string') {
    const rows = res.split('\n')
    const filteredRows = rows.filter(v => v !== "").map(v => JSON.parse(v))
    return filteredRows
  } else if(Array.isArray(res)){
    return res
  } else if(res?.info_list && Array.isArray(res.info_list)) {
    return res?.info_list
  } else {
    return [res]
  }
}

export const checkInteger = (value :string) => {
  let toDigit =value.replace(/[^\d|^-]/g, '')
  toDigit = RemoveFirstZero(toDigit)
  return RemoveSecondMinus(toDigit)
}

export const RemoveFirstZero = (value: number | string | null) => {
    const toString = String(value)
    return toString.startsWith('0') && toString.length > 1 ? toString.charAt(1) === '.' ? toString : toString.substring(1) : toString.startsWith('-0') ? toString.substring(0,1) : toString
}

export const RemoveSecondMinus = (value: number | string | null) => {
    const toString = String(value)
    const lastIndexOfMinus = toString.lastIndexOf('-')
    return lastIndexOfMinus > 0 ? toString.substring(0,lastIndexOfMinus) : toString
}

export const getMaterialType = (type: number) => {
  return type === 0 ? "rawMaterial" : type === 1 ? "subMaterial" : "product"
}

export const getUsageType = (setting: number) => {
  return setting === 1 ? "기본" : "스페어"
}

export const getBomObject : (bom: BomType) => (BomObjectType)  = (bom: BomType) => {
  switch(bom.type){
    case 0:
      return {
      ...bom,
      typeName: 'rawMaterial',
      bomKey: `rm${bom.childRmId}`,
      id: bom.childRmId,
      detail: {...bom.child_rm, unit: TransferCodeToValue(bom.child_rm?.unit, 'rawMaterialUnit')},
      // detail: bom.child_rm,
      }
    case 1: return {
      ...bom,
      typeName: 'subMaterial',
      bomKey: `sm${bom.childSmId}`,
      id: bom.childSmId,
      detail: {...bom.child_sm}
    }
    case 2:
      return {
      ...bom,
      typeName: 'product',
      bomKey: `p${bom.childProductId}`,
      id: bom.childProductId,
      detail: bom.child_product
    }
  }
}

export const setExcelTableHeight = (length:number) => {
  return length === 0 ? 90 : length * 40 >= 40*18+48? 40 *19 + 48 : length * 40 + 48
}

export const getTableSortingOptions = (key, order, sortingOptions:TableSortingOptionType) => {
    const index = sortingOptions.sorts.findIndex((sort) => sort == key)
    if(order == "none"){
      sortingOptions.sorts.splice(index,1)
      sortingOptions.orders.splice(index,1)
    }else if(sortingOptions.sorts.includes(key)){
      sortingOptions.sorts.splice(index,1)
      sortingOptions.orders.splice(index,1)
      sortingOptions.sorts.push(key)
      sortingOptions.orders.push(order)
    }else{
      sortingOptions.sorts.push(key)
      sortingOptions.orders.push(order)
    }
    return {...sortingOptions}
}

export const decideKoreanSuffix = (word: string, existCoda: string, notExistCoda: string): String => {
  const charCode = word.charCodeAt(word.length - 1);
  const consonantCode = (charCode - 44032) % 28;
  const markingParticle = consonantCode === 0 ? notExistCoda : existCoda

  return word+markingParticle
}

export const CheckRecordLotNumber = (lotNumber:string) : boolean => {
  const basicStockRegex = new RegExp(/^basicstock-\d+$/)
  const stockAdjustRegex = new RegExp(/^adjuststock-\d{3}-\d{13}$/)
  return basicStockRegex.test(lotNumber) || stockAdjustRegex.test(lotNumber)
}

export const TransferType = (type:"COIL" | "SHEET" | string) => {
  switch(type){
    case "COIL" :
      return "KG"
    case "SHEET" :
      return "장"
    default:
      return type
  }

// export const TypeCheck = (type:0 | 1 | 2 | "") => {
//   switch(type){
//     case 0 :
//       return ""
//     case 1 :
//       return "장"
//     case 2 :
//       return "장"
//     default:
//       return type
//   }
// }
}

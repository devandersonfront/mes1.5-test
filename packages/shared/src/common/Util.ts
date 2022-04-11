import { BomObjectType, BomType } from '../@types/type'

export const ParseResponse = (res: {info_list: any[]} | string | any[]) : any[] => {
  if (typeof res === 'string') {
    const rows = res.split('\n')
    const filteredRows = rows.filter(v => v !== "").map(v => JSON.parse(v))
    return filteredRows
  } else if(Array.isArray(res)){
    return res
  } else {
    return res?.info_list
  }
}

export const RemoveFirstZero = (value: number | string | null) => {
  if(typeof value === 'number'){
    const toString = String(value)
    return toString.replace(/(^0\d+)/,toString.substr(1,1))
  } else if(typeof value === 'string'){
  return value.replace(/(^0\d+)/, value.substr(1,1))
  }
}

export const getRawMaterialUnit = (type: string) => {
  return type == "1" ? "kg" : type == "2" ? "장" : "-";
}

export const getMaterialType = (type: number) => {
  return type === 0 ? "rawmaterial" : type === 1 ? "submaterial" : "product"
}

export const getUsageType = (setting: number) => {
  return setting === 1 ? "기본" : "스페어"
}

export const getBomObject : (bom: BomType) => (BomObjectType)  = (bom: BomType) => {
  switch(bom.type){
    case 0:
      return {
      ...bom,
      typeName: 'rawmaterial',
      bomKey: `rm${bom.childRmId}`,
      id: bom.childRmId,
      object: {...bom.child_rm, unit: getRawMaterialUnit(bom.child_rm.type)},
      }
    case 1: return {
      ...bom,
      typeName: 'submaterial',
      bomKey: `sm${bom.childSmId}`,
      id: bom.childSmId,
      object: bom.child_sm
    }
    case 2: return {
      ...bom,
      typeName: 'product',
      bomKey: `p${bom.childProductId}`,
      id: bom.childProductId,
      object: bom.child_product
    }
  }
}
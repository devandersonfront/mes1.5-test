import {BomObjectType, BomType, IExcelHeaderType, LoadItemTypes, TableSortingOptionType} from '../@types/type'
import { TransferCodeToValue } from './TransferFunction'
import {PlaceholderBox} from "../components/Formatter/PlaceholderBox";
import {TextEditor} from "../components/InputBox/ExcelBasicInputBox";

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
  switch (type) {
    case "COIL" :
      return "KG"
    case "SHEET" :
      return "장"
    default:
      return type
  }
}

export const isNil = (value) => {
    return isUndefined(value) && isNull(value)
}
export const isUndefined = (value) => {
    return value === undefined
}
export const isNull = (value) => {
    return value === null
}

export const getBomKey = (bom:any) => {
  switch(bom.type) {
    case 0: return 'rm' + bom.childRmId
    case 1: return 'sm' + bom.childSmId
    case 2: return 'p' + bom.childProductId
    default: return undefined
  }
}

export const columnsSort = (columns:any[]) => {
  return columns.sort((prev, next) => {
    if(prev.sequence > next.sequence) return 1
    if(prev.sequence < next.sequence) return -1
    return 0
  });
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

export const transTypeProduct = (type:string | number) => {
  switch(type){
    case 0:
      return "반제품"
    case 1:
      return "재공품"
    case 2:
      return "완제품"
    case "완제품":
      return 2
    case "반제품":
      return 0
    case "재공품":
      return 1
    default:
      return null

  }
}

export const duplicateCheckWithArray = (array:Array<any>, keys:Array<string>, nullCheck?:boolean):boolean => {
  try{
    if(nullCheck && array.length <= 0) return false
    keys.map((key) => {
      array.map((_, index1) => {
        const standard = _[key]
        if(!standard) throw false
        array.map((row, index2) => {
          if(index1 !== index2){
            if(row[key] == standard) throw false
          }
        })
      })

    })
    return true
  }
  catch (err){
    return false
  }
}

export const loadAllSelectItems = async ({column, sortingOptions, setSortingOptions, reload, setColumn, changeSetTypesState, date}: LoadItemTypes) => {
  const changeOrder = (sort:string, order:string) => {
    const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
    setSortingOptions(_sortingOptions)
    reload(null, _sortingOptions, date && date,)
  }

  let tmpColumn = columnsSort(column).map((v: any) => {
    const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
    return {
      ...v,
      pk: v?.unit_id,
      sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
      sorts: v.sorts ? sortingOptions : null,
      result: v.sortOption ? changeOrder : v.headerRenderer ? changeSetTypesState : null,
    }
  });

  Promise.all(tmpColumn).then(res => {
    setColumn([...res.map(v=> {
      return {
        ...v,
        name: v.moddable ? v.name+'(필수)' : v.name
      }
    })])
  })
}

export const additionalMenus:(tmpColumn:any[], res:any) => any[] = (tmpColumn, res) => {
  tmpColumn = tmpColumn
        .map((column: any) => {
          let menuData: object | undefined;
          res.menus &&
          res.menus.map((menu: any) => {
            if (!menu.hide) {
              if (menu.colName === column.key) {
                menuData = {
                  id: menu.id,
                  mi_id: menu.mi_id,
                  name: menu.title,
                  width: menu.width,
                  tab: menu.tab,
                  unit: menu.unit,
                  sequence:menu.sequence,
                  hide:menu.hide,
                  version: menu?.version ?? null
                };
              }
            }
          });
          if (menuData) {
            return {
              ...column,
              ...menuData,
            };
          }
        }).filter(value=> value)

  return tmpColumn.concat(res.menus
      .map((menu: any) => {
        if (menu.colName === null && !menu.hide) {
          return {
            id: menu.mi_id,
            name: menu.title,
            width: menu.width,
            // key: menu.title,
            key: menu.mi_id,
            mi_id: menu.mi_id,
            formatter: PlaceholderBox,
            editor: TextEditor,
            type: "additional",
            unit: menu.unit,
            tab: menu.tab,
            version: menu.version,
            colName: menu.mi_id,
            sequence: menu.sequence,
          };
        }
      })
      .filter((v: any) => v))

}

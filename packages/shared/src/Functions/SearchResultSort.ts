import {TransferCodeToValue} from '../common/TransferFunction'
import {LineBorderContainer} from "../components/Formatter/LineBorderContainer";
import { searchModalList } from '../common/modalInit'
import { getUsageType } from '../common/Util'

export const SearchResultSort = (infoList, type: string) => {
  const noneSelected = '(선택 없음)'
  switch(type) {
    case 'user': {
      const columnKeys = searchModalList.userSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          ca_name: v?.ca_id?.name === undefined ? noneSelected : v?.ca_id?.name,
        }
      })
    }
    case 'customer': {
      const columnKeys = searchModalList.customerSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customer_id: v?.name,
          customer: v?.customer_id,
          customerArray: v
        }
      })
    }
    case 'model': {
      const columnKeys = searchModalList.modelSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customer_id: v?.customer?.name,
          customer: v?.customer?.name === undefined ? noneSelected : v?.customer?.name,
          customerArray: v?.customer,
          rep: v?.customer?.rep === undefined ? noneSelected : v?.customer?.rep,
          crn: v?.customer?.crn === undefined ? noneSelected : v?.customer?.crn
        }
      })
    }
    case 'product': {
      const columnKeys = searchModalList.productSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          product_type: TransferCodeToValue(v.type, 'productType'),
          customer_name: v.customer ? v.customer.name : "",
          model_name: v.model ? v.model.model : "",
          type_name: TransferCodeToValue(v.type, 'product'),
          type_id:v.type
        }
      })
    }
    case 'rawMaterial': {
      const columnKeys = searchModalList.rawMaterialSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customerArray: v.customer,
          customer: v.customer?.name ?? "",
          rawName: v.name,
          type: v.type === 2 ? "SHEET" : "COIL",
          type_id:v.type,
          type_name : v.type === 2 ? "SHEET" : "COIL",
        }
      })
    }
    case 'subMaterial': {
      const columnKeys = searchModalList.subMaterialSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customerArray: v.customer,
          customer: v.customer ? v.customer.name : "",
          subName: v.name,
        }
      })
    }
    case 'subFactory': {
      const columnKeys = searchModalList.subFactorySearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          manager_info : v.manager,
          manager : v.manager?.name === undefined ? noneSelected : v.manager?.name,
          telephone : v.manager?.telephone === undefined ? noneSelected : v.manager?.telephone
        }
      })
    }
    case 'factory': {
      const columnKeys = searchModalList.factorySearch.map(columns => columns.key)
      return infoList ? infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          managerArray: v?.manager,
          manager: v?.manager?.name === undefined && !!!v.factory_id ? noneSelected : v?.manager?.name,
        }
      }) : []
    }
    case 'contract': {
      const columnKeys = searchModalList.contractSearch.map(columns => columns.key)
      return infoList ? infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customer_name: v.product?.customer?.name,
          model_name: v.product?.model?.model,
          product_code: v.product?.code,
          product_name: v.product?.name,
          product_type: TransferCodeToValue(v.product?.type, 'product'),
          product_unit: v.product?.unit,
          stock: v.product?.stock,
        }
      }) : []
    }
    case 'receiveContract': {
      const columnKeys = searchModalList.contractSearch.map(columns => columns.key)
      return infoList ? infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customer_name: v.product.customer?.name,
          model_name: v.product.model?.model,
          product_code: v.product.code,
          product_name: v.product.name,
          product_type: TransferCodeToValue(v.product.type, 'product'),
          product_unit: v.product.unit,
        }
      }) : []
    }
    case 'machine': {
      const columnKeys = searchModalList.machineSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          factory_id: v.factory?.name,
          affiliated_id: v.subFactory?.name,
          type_id : v.type,
          type:TransferCodeToValue(v.type, "machine"),
          weldingType_id:v.weldingType,
          weldingType:TransferCodeToValue(v.weldingType, "welding")
        }
      })
    }
    case 'tool' : {
      const columnKeys = searchModalList.toolSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          customer: v.customer?.name,
          customerArray: v.customer,
        }
      })
    }

    case 'toolProduct' : {
      const columnKeys = searchModalList.toolProductSearch.map(columns => columns.key)
      return infoList.map((v) => {
        const tool = v.tool
        let obj = {}
        columnKeys.map(column => obj[column] = tool[column] === undefined ? noneSelected : tool[column])
        return {
          ...tool,
          ...obj,
          customer: tool.customer?.name,
          customerArray: tool.customer,
          isDefault: getUsageType(v.setting)
        }
      })
    }
    case 'outsourcingOrder' : {
      const columnKeys = searchModalList.outsourcingOrderSearch.map(columns => columns.key)
      return infoList.map((v) => {
        let obj = {}
        //데이터와 내가 지정한 키가 같을경우에는 바인딩 시켜주고 없을경우에는 선택없음으로 나오게
        columnKeys.map(column => obj[column] = v[column] === undefined ? noneSelected : v[column])
        return {
          ...v,
          ...obj,
          identification: v.identification,
          name: v.product?.name,
          product_id: v.product?.code,
          current : v.current,
          order_quantity : v.order_quantity,
          order_date : v.order_date,
          bom: v.bom,
          customer_id : v.product.customer?.name,
          user: v.worker?.name
        }
      })

    }

    default :
      return infoList

  }
}

export const SearchModalResult = (selectData:any, type: string , staticCalendar?: boolean, usedInModal?: boolean, columnType?: string) => {
  switch(type) {
    case 'user': {
      return {
        ...selectData,
        appointment: selectData.appointment,
        telephone: selectData.telephone,
        manager: selectData.name,
        worker_name: selectData.name,
        managerPk: selectData.user_id,
        user: selectData,
        worker: selectData,
        border: usedInModal
        // name: selectData.name
      }
    }
    case 'model': {
      return {
        ...selectData,
        cm_id: selectData.model,
        customer: selectData.customerArray,
        model : {
          ...selectData,
          customer: selectData.customerArray
        },
        modelArray: {
          ...selectData,
          customer: selectData.customerArray
        },
        border: usedInModal
      }
    }
    case 'product': {
      const result = {
        ...selectData,
        code: selectData.code,
        name: selectData.name,
        type: TransferCodeToValue(selectData.type, 'product'),
        customer: selectData.customer ? selectData.customer.name : '',
        customer_id: selectData.customer?.name,
        cm_id: selectData.model?.model,
        product_id: selectData.code,
        model: selectData.model ? selectData.model.model : '',
        type_name: selectData.type_name ?? TransferCodeToValue(selectData.type, 'product'),
        unit: selectData.unit,
        usage: selectData.usage,
        process: selectData.process?.name ?? "-",
        product_name: selectData.name,
        product_type: TransferCodeToValue(selectData.type, 'productType'),
        product_unit: selectData.unit,
        product: {...selectData},
        bom_root_id: selectData.bom_root_id,
        customerData: selectData.customer,
        customerArray : selectData.customer,
        modelData: selectData.model,
        modelArray : selectData.model,
        standard_uph : selectData.standard_uph,
        os_id : selectData.os_id,
        date: selectData.date,
        deadline: selectData.deadline,
        amount: selectData.amount,
        shipment_amount : selectData.shipment_amount,
        shipment_date : selectData.shipment_date,
        lead_time : selectData.lead_time,
        uph : selectData.uph,
        identification : selectData.identification,
        border: usedInModal,
      }
      if(columnType === 'outsourceProduct'){
        result['order_quantity'] = undefined
        result['bomChecked'] = undefined
        result['bom_info'] = undefined
        result['lots'] = undefined
      }
      return result
    }
    case "process": {
      return {
        process:selectData,
        process_id: selectData.name,
        version: selectData.version,
        border: usedInModal
      }
    }
    case 'rawMaterial': {
      return {
        ...selectData,
        rm_id: selectData.code,
        type: TransferCodeToValue(selectData.type, 'rawMaterialType'),
        type_name:"원자재",
        customer_id: selectData.customerArray?.name,
        unit: selectData.unit === 1 ? '장' : 'kg',
        raw_material: {
          ...selectData,
          customer: selectData.customerArray
        },
        usage: selectData.usage,
        border: usedInModal
      }
    }
    case 'subMaterial': {
      return {
        ...selectData,
        wip_id: selectData.code,
        customer_id: selectData.customerArray?.name,
        type:"부자재",
        type_name:"부자재",
        sub_material: {
          ...selectData,
          customer: selectData.customerArray
        },
        usage: selectData.usage,
        border: usedInModal
      }
    }
    case 'factory': {
      return {
        // ...selectData,
        factory: {
          ...selectData,
          manager: selectData.managerArray,
        },
        affiliated_id:null,
        factory_id: selectData.name,
        subFactory:null,
        subFactories:null,
        border: usedInModal
      }
    }
    case 'customer': {
      return {
        customer_id:selectData.name,
        customer:selectData.customerArray,
        customerArray:selectData.customerArray,
        crn:selectData.crn,
        border: usedInModal
      }
    }
    case 'receiveContract':
    case 'contract': {
      return {
        contract: {
          ...selectData,
        },
        bom_root_id: selectData.product?.bom_root_id,
        customer: selectData.product?.customer?.name,
        customer_id: selectData.product?.customer?.name,
        model: selectData.product?.model?.model,
        cm_id: selectData.product?.model?.model,
        code: selectData.product?.code,
        product_id: selectData.product?.code,
        product_name: selectData.product?.name,
        name: selectData.product?.name,
        type: TransferCodeToValue(selectData.product?.type, 'product'),
        unit: selectData.product?.unit,
        process: selectData.product?.process?.name,
        contract_id: selectData.identification,
        product: {
          ...selectData.product
        },
        border: usedInModal
      }
    }
    case 'toolRegister': {
      return {
        ...selectData,
        code: selectData.tool_id,
        tool_id: selectData.code,
        border: usedInModal
      }
    }
    default : {
      return {
        ...selectData,
        border: usedInModal
      }
    }
  }
}

import {TransferCodeToValue} from '../common/TransferFunction'

export const SearchResultSort = (infoList, type: string) => {
  switch(type) {
    case 'user': {
      return infoList.map((v) => {
        return {
          ...v,
          ca_name: v.ca_id.name,
        }
      })
    }
    case 'customer': {
      return infoList.map((v) => {
        return {
          ...v,
          customer_id: v.name,
          customer: v.customer_id,
          customerArray: v
        }
      })
    }
    case 'model': {
      return infoList.map((v) => {
        return {
          ...v,
          customer_id: v.customer.name,
          customer: v.customer.name,
          customerArray: v.customer,
          rep: v.customer.rep,
          crn: v.customer.crn,
        }
      })
    }
    case 'product': {
      return infoList.map((v) => {
        return {
          ...v,
          customer_name: v.customer ? v.customer.name : "",
          model_name: v.model ? v.model.model : "",
          type_name: TransferCodeToValue(v.type, 'productType'),
          type_id:v.type
        }
      })
    }
    case 'rawmaterial': {
      return infoList.map((v) => {
        return {
          ...v,
          customerArray: v.customer,
          customer: v.customer?.name ?? "",
          rawName: v.name,
          type: v.type === 2 ? "SHEET" : "COIL",
          type_id:v.type
        }
      })
    }
    case 'submaterial': {
      return infoList.map((v) => {
        return {
          ...v,
          customerArray: v.customer,
          customer: v.customer ? v.customer.name : "",
          subName: v.name,
        }
      })
    }
    case 'factory': {
      return infoList ? infoList.map((v) => {
        return {
          ...v,
          managerArray: v.manager,
          manager: v.manager?.name,
        }
      }) : []
    }
    case 'contract': {
      return infoList ? infoList.map((v) => {
        return {
          ...v,
          customer_name: v.product.customer?.name,
          model_name: v.product.model?.model,
          product_code: v.product.code,
          product_name: v.product.name,
          product_type: TransferCodeToValue(v.product.type, 'material'),
          product_unit: v.product.unit,
        }
      }) : []
    }
    case 'machine': {
      return infoList.map((v) => {
        return {
          ...v,
          factory_id: v.factory?.name,
          affiliated_id: v.subFactory?.name,
        }
      })
    }
    default : {
      return infoList
    }
  }
}

export const SearchModalResult = (selectData, type: string) => {
  switch(type) {
    case 'user': {
      return {
        // ...selectData,
        appointment: selectData.appointment,
        telephone: selectData.telephone,
        description: selectData.description,
        manager: selectData.name,
        worker_name: selectData.name,
        managerPk: selectData.user_id,
        user: selectData,
        worker: selectData,
      }
    }
    case 'model': {
      return {
        ...selectData,
        cm_id: selectData.model,
        customer: selectData.customerArray,
        modelArray: {
          ...selectData,
          customer: selectData.customerArray
        }
      }
    }
    case 'product': {
      return {
        code: selectData.code,
        name: selectData.name,
        type: TransferCodeToValue(selectData.type, 'material'),
        customer: selectData.customer ? selectData.customer.name : '',
        customer_id: selectData.customer?.name,
        cm_id: selectData.model?.model,
        product_id: selectData.code,
        model: selectData.model ? selectData.model.model : '',
        type_name: selectData.type_name ?? TransferCodeToValue(selectData.type, 'material'),
        unit: selectData.unit,
        usage: selectData.usage,
        process: selectData.process?.name ?? "-",
        product_name: selectData.name,
        product_type: TransferCodeToValue(selectData.type, 'material'),
        product_unit: selectData.unit,
        product: {...selectData},
        bom_root_id: selectData.bom_root_id,
        customerData: selectData.customer,
        modelData: selectData.model
      }
    }
    case "process": {
      return {
         process:selectData,
         process_id: selectData.name,
         version: selectData.version
      }
    }
    case 'rawmaterial': {
      return {
        ...selectData,
        rm_id: selectData.code,
        type: TransferCodeToValue(selectData.type, 'rawMaterialType'),
        customer_id: selectData.customerArray?.name,
        raw_material: {
          ...selectData,
          customer: selectData.customerArray
        }
      }
    }
    case 'submaterial': {
      return {
        ...selectData,
        wip_id: selectData.code,
        customer_id: selectData.customerArray?.name,
        sub_material: {
          ...selectData,
          customer: selectData.customerArray
        }
      }
    }
    case 'factory': {
      return {
        ...selectData,
        factory: {
          ...selectData,
          manager: selectData.managerArray,
        },
        factory_id: selectData.name
      }
    }
    case 'customer': {
      return {
        customer_id:selectData.name,
        customer:selectData.customerArray,
        customerArray:selectData.customerArray,
        crn:selectData.crn,
      }
    }
    case 'contract': {
      return {
        contract: {
          ...selectData,
        },
        product: {
          ...selectData.product
        },
        bom_root_id: selectData.product.bom_root_id,
        customer: selectData.product.customer?.name,
        customer_id: selectData.product.customer?.name,
        model: selectData.product.model?.model,
        cm_id: selectData.product.model?.model,
        code: selectData.product.code,
        product_id: selectData.product.code,
        product_name: selectData.product.name,
        name: selectData.product.name,
        type: TransferCodeToValue(selectData.product.type, 'material'),
        unit: selectData.product.unit,
        process: selectData.product.process?.name,
        contract_id: selectData.identification
      }
    }
    default : {
      return selectData
    }
  }
}

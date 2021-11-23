import {TransferCodeToValue} from '../common/TransferFunction'

export const SearchResultSort = (infoList, type: string) => {
  console.log('infolist', infoList)
  switch(type) {
    case 'user': {
      return infoList.map((v) => {
        return {
          ...v,
          ca_name: v.ca_id.name
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
        }
      })
    }
    case 'rawmaterial': {
      return infoList.map((v) => {
        return {
          ...v,
          customerArray: v.customer,
          customer: v.customer.name,
          rawName: v.name,
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
      return infoList.map((v) => {
        return {
          ...v,
          managerArray: v.manager,
          manager: v.manager.name,
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
        managerPk: selectData.user_id,
        user: selectData
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
        type: selectData.type,
        type_name: TransferCodeToValue(selectData.type, 'material'),
        unit: selectData.unit,
        usage: selectData.usage,
        process: selectData.process.name,
        product: {...selectData},
        bom_root_id: selectData.bom_root_id,
      }
    }
    case 'rawmaterial': {
      return {
        ...selectData,
        type: TransferCodeToValue(selectData.type, 'rawMaterialType'),
        raw_material: {
          ...selectData,
          customer: selectData.customerArray
        }
      }
    }
    case 'submaterial': {
      return {
        ...selectData,
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
        customer:selectData.customerArray
      }
    }
    default : {
      return selectData
    }
  }
}

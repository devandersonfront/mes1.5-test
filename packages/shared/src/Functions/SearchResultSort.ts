
export const SearchResultSort = (infoList, type: string) => {
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
          customer_name: v.customer.name,
          customer: v.customer.name,
          model_name: v.model.model,
        }
      })
    }
    default : {
      return infoList
    }
  }
}

export const SearchModalResult = (selectData, type: string) => {
  console.log(type, selectData)
  switch(type) {
    case 'user': {
      return {
        ...selectData,
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
        mold: selectData.molds && selectData.molds.length !== 0 ?  selectData.molds[0].mold.name : "-",
        type: selectData.type,
        unit: selectData.unit,
        usage: selectData.usage,
        process: selectData.process.name,
        product: {...selectData},
        bom_root_id: selectData.bom_root_id
      }
    }
    default : {
      return selectData
    }
  }
}

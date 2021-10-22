
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
    default : {
      return infoList
    }
  }
}

export const SearchModalResult = (selectData, type: string) => {
  switch(type) {
    case 'user': {
      return {
        ...selectData,
        manager: selectData.name,
        managerPk: selectData.user_id,
        user: selectData
      }
    }
    default : {
      return selectData
    }
  }
}

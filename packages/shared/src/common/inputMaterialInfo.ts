import { TransferCodeToValue } from './TransferFunction'
import { searchModalList } from './modalInit'
import { UnitContainer } from '../components/Unit/UnitContainer'

export const InputModalHeaderItems = (type: string) : {title: string, infoWidth: number, key: string, unit?: string}[][] => {
  switch(type){
    case 'outsourcing':
      return [
        [
          {title: '발주 고유번호', infoWidth: 144, key: 'identification'},
          {title: '거래처', infoWidth: 144, key: 'customer'},
          {title: '모델', infoWidth: 144, key: 'model'},
        ],
        [
          {title: 'CODE', infoWidth: 144, key: 'code'},
          {title: '품명', infoWidth: 144, key: 'name'},
          {title: '구분', infoWidth: 144, key: 'product_type'},
          {title: '품목 종류', infoWidth: 144, key: 'type'},
          {title: '생산 공정', infoWidth: 144, key: 'process'},
        ],
        [
          {title: '단위', infoWidth: 144, key: 'unit'},
          {title: '발주량', infoWidth: 144, key: 'order_quantity'},
          {title: '발주자', infoWidth: 144, key: 'worker_name'},
        ],
      ]
    default:
      return [
        [
          {title: '지시 고유번호', infoWidth: 144, key: 'identification'},
          {title: 'LOT 번호', infoWidth: 144, key: 'lot_number'},
          {title: '거래처', infoWidth: 144, key: 'customer'},
          {title: '모델', infoWidth: 144, key: 'model'},
        ],
        [
          {title: 'CODE', infoWidth: 144, key: 'code'},
          {title: '품명', infoWidth: 144, key: 'name'},
          {title: '구분', infoWidth: 144, key: 'product_type'},
          {title: '품목 종류', infoWidth: 144, key: 'type'},
          {title: '생산 공정', infoWidth: 144, key: 'process'},
        ],
        [
          {title: '단위', infoWidth: 144, key: 'unit'},
          {title: '목표 생산량', infoWidth: 144, key: 'goal'},
          {title: '작업자', infoWidth: 144, key: 'worker_name'},
          {title: '양품 수량', infoWidth: 144, key: 'good_quantity'},
          {title: '불량 수량', infoWidth: 144, key: 'poor_quantity'},
        ],
      ]
  }}

export const getHeaderItems = (row:any, type:string) => {
  const headerItems = {
    identification: row.identification,
    customer: row.product?.customer?.name,
    model: row.product?.model?.model,
    code: row.product?.code,
    name: row.product?.name,
    process: row.product?.process?.name,
    product_type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'productType') : "-",
    type: Number(row.product?.type) >= 0 ? TransferCodeToValue(row.product.type, 'product') : "-",
    unit: row.product?.unit,
    worker_name: row.worker?.name ?? row.worker ?? '-',
  }
  if(type === 'outsourcing') {
    headerItems['order_quantity'] = row.order_quantity ?? 0
  } else {
    headerItems['goal'] = row.goal
    headerItems['lot_number'] = row.lot_number ?? '-'
    headerItems['poor_quantity'] = row.poor_quantity ?? 0
    headerItems['good_quantity'] = row.good_quantity ?? 0
  }
  return headerItems
}

export const InputListHeaders = (isOutsourcing: boolean, readonly:boolean) => {
  const headers = isOutsourcing ? [...searchModalList.OutsourcingInputListReadonly] : [...searchModalList.InputListReadonly]
  if(!readonly) {
    if(isOutsourcing){
      headers.splice(9,0, {key: 'disturbance', name: '발주량', formatter: UnitContainer, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"})
      headers.splice(11,0,{...headers[11], readonly: false})
    }else {
      headers.splice(9,0,{key: 'disturbance', name: '생산량', formatter: UnitContainer, textAlign: 'center', unitData:'EA', placeholder: "0", textType:"Modal"})
      headers.splice(12,0,{...headers[12], readonly: false})
    }
  }
  console.log(headers)
  return headers
}
// export const lotListHeaders = searchModalList.InputListReadonly
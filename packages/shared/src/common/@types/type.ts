export interface IMenuType {
  title: string
  url: string
  subMenu?: IMenuType[]
}

export interface IExcelHeaderType {
  key: string
  name: string
  width?: number
  editor?: any
  selectList?: any[]
  type?: string
  unitData?: string
  searchType?: string
  tab?:string
  id?:number
  disableType?: string
  textType?: string
  options?:{status:number, name:string}[]
  result?:(value:number | string | boolean) => void
  staticCalendar?: boolean
  clearContract?: boolean
  maxDate?:boolean
  theme?: string
  toFix?: number
  placeholder?: string
  textAlign?: 'left' | 'center' | 'right'
  modalInitData?: any
  summaryType?: any
  modalType?: boolean
  readonly?: boolean
  load?: string
  title?: string
  url?: string
  headerType?:any[]
  toolType?: 'register'
  callback?: (data : any) => void
}

export interface IResponseType {
  status: number
  message?: string
  results?: any
}

export interface IMenu {
  title: string //트리뷰에 표시될 이름
  show: boolean //트리뷰 펼쳐질지 확인
  checkable: boolean //체크박스 표시 여부
  check?: boolean //체크 여부
  value?: string //체크시 넘길 값
  child: IMenu[] // 하위 트리뷰 리스트
}

export interface IItemMenuType {
  id?: number | string
  mi_id?: number
  title?: string
  hide?: boolean
  width?: number
  unit?: number
}

export type MachineType = {
  machine_id:string | number
  machine_idPK:string | number
  seq: number,
  process_id: number,
  process_idPK: number | string,
  mold_id: number,
  ln_id: number| undefined,
  goal: number,
  last: boolean,
  mold?: {
    mold_id:number, name:string
  }
}

export type ProductListType = {
  total_length:number,
  selectRow:number,
  products:ProductType[]
}

type ProductType = {
  id:string
  model:string
  name:string
  shipment_id: number | string,
  customer_id: number | string,
  customer_idPK:number | string,
  cm_id: number | string,
  cm_idPK: number | string,
  product_id: number | string,
  date: string
  amount: number
  code:string
}

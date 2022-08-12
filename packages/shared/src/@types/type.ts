import UserInfo, { UserInfoState } from '../reducer/userInfo'

export interface IMenuType {
  title: string
  url: string
  subMenu?: IMenuType[]
}

export interface IExcelHeaderType {
  isFloatFormat?: number
  onClickEvent?: (any) => {any}
  beforeEventTitle?: string
  afterEventTitle?: string
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
  disabledCase?: {key: any, value: any}[]
  textType?: string
  options?:{status:number, name:string}[]
  sortOption?: string
  sorts?: {orders:string[], sorts:string[]}
  result?:(value:number | string | boolean, key?:string) => void
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
  subTitle?:string
  url?: string
  headerType?:any[]
  toolType?: 'register'
  callback?: (data : any) => void
  idx?:number
  headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][]
  action?:string
  doubleClick?:() => void
  mi_id?:number
  hide?:boolean
  version?:number
  noSelect?:boolean
  inputType?: string
  overlay?:boolean
  orderRegisterManage?:() => any[]

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
  name?:string
  id?: string
  index?:number
  date?:string
  machine_id?:string | number
  machine_idPK?:string | number
  seq?: number,
  process_id?: number,
  process_idPK?: number | string,
  mold_id?: number,
  ln_id?: number| undefined,
  goal?: number,
  last?: boolean,
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

export type InspectionFinalDataResult = {
  sequence: number
  pass: boolean
}

export type InspectionInfo = {
  name: string
  unit: string
  type: number
  error_minimum: string
  error_maximum: string
  standard: string
  samples: number
  data_result: InspectionDataResult[] | []
}

export type InspectionDataResult = {
  sequence: number
  value: string
  pass: boolean
}

export type ChangeProductFileInfo = {
  name: string
  UUID: string
  sequence: number
}


export type MidrangeRecordType = {
  inspection_time: {
    beginning: string
    middle: string
    end: string
  } | {}
  inspection_result: {
    beginning: InspectionFinalDataResult[]
    middle: InspectionFinalDataResult[]
    end: InspectionFinalDataResult[]
  } | {}
  legendary_list: string[]
  inspection_info: {
    beginning: InspectionInfo[]
    middle: InspectionInfo[]
    end: InspectionInfo[]
  } | {}
  writer?: midrangeWorkerType
}

export type midrangeWorkerType = {
  additional: []
  appointment: string
  authority: number
  ca_id: {ca_id: number, name: string, factor: number, authorities: [], version: number}
  company: string
  email: string
  id: string
  name: string
  password: string
  profile: null | string
  serviceAddress: string
  sync: string
  telephone: string
  token: null | string
  user_id: number
  version: number
}

export interface MidrangeRecordRegister extends MidrangeRecordType {
  sic_id?: string
  record_id?: string
  version?: number
  samples?:number
}

export type TransferType = "productType" | "material" | "rawmaterial" | "rawMaterialType" | "workStatus" | 'machine' | "product" |  "submaterial" | "welding" | null

export interface BomType {
  childProductId: number | null
  childRmId: number | null
  childSmId: number | null
  child_product: any | null
  child_rm: any | null
  child_sm: any | null
  key: string | null
  parent: any | null
  parentId: number | null
  seq: number | null
  setting: number | null
  type: number | null
  usage: number | null
  version: number | null
}

export interface BomObjectType extends BomType {
  typeName : TransferType| null
  bomKey: string | null,
  id: number | null,
  detail: any | null
}

export interface TableSortingOptionType {
  sorts:string[],
  orders:string[]
}


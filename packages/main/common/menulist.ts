import {IMenuType} from './@types/type'

type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | ""

export const menuSelect = (type: IMenu) => {
  switch(type){
    case 'HOME'   :
      return HOME_MENUS
    case 'BASIC'  :
      return BASIC_MENUS
    case 'MES'    :
      return MES_MENUS
    case 'PMS'    :
      return PMS_MENUS
    case 'WMS'    :
      return []
    case 'UMS'    :
      return []
    case 'SETTING':
      return []
    default:
      return []
  }
}

const HOME_MENUS: IMenuType[] = [

]

const BASIC_MENUS: IMenuType[] = [
  {
    title: '사용자 권한 관리', url: '',
    subMenu: [
      {title: '권한 관리', url: '/mes/basic/authority/member'},
      {title: '유저 관리', url: '/mes/basic/user?page=1'},
    ]
  },
  {title: '공장 기준정보', url: '/mes/basic/factory'},
  {
    title: '거래처 관리', url: '',
    subMenu: [
      {title: '거래처 정보 관리', url: '/mes/basic/customer?page=1'},
      {title: '모델 관리', url: '/mes/basic/customer/model?page=1'},
    ]
  },
  {title: '공정 관리', url: '',
    subMenu:[
      {title: '공정 종류 관리', url: '/mes/basic/process?page=1'},
      {title: '공정 일시정지 유형 등록', url: '/mes/basic/register/pause'},
    ]
  },
  {
    title: '품질 기준정보', url: '',
    subMenu: [
      {title: '공정별 자주검사 항목 등록', url: '/mes/basic/register/defect'},
    ]
  },
  {title: '주변장치 기준정보', url: '/mes/basic/device'},
  {title: '기계 기준정보', url: '/mes/basic/machine'},
  {title: '금형 기준정보', url: '/mes/basic/moldV1u'},
  {title: '공구 기준정보', url: '/mes/basic/tool'},
  {title: '원자재 기준정보', url: '/mes/basic/rawmaterialV1u'},
  {title: '부자재 기준정보', url: '/mes/basic/submaterial'},
  {title: '제품 등록 관리', url: '/mes/basic/productV1u'},
]

const MES_MENUS: IMenuType[] = [
  {
    title: '영업 관리', url: '',
    subMenu: [
      {title: '수주 정보 등록', url: '/mes/order/register'},
      {title: '수주 현황', url: '/mes/order/list'},
      {title: '납품 정보 등록', url: '/mes/delivery/register'},
      {title: '납품 현황', url: '/mes/delivery/list'},
    ]
  },
  {
    title: '생산관리 등록', url: '',
    subMenu: [
      {title: '작업지시서 등록', url: '/mes/operationV1u/register'},
      {title: '작업지시서 리스트', url: '/mes/operationV1u/list'},
      {title: '작업 일보 리스트', url: '/mes/recordV2/list'},
      {title: '작업 완료 리스트', url: '/mes/finishV2/list'},
    ]
  },
  {
    title: '원자재 관리', url: '',
    subMenu: [
      {title: '원자재 입고 등록', url: '/mes/rawmaterialV1u/input'},
      {title: '원자재 재고 현황', url: '/mes/rawmaterialV1u/stock'},
    ]
  },
  {
    title: '부자재 관리', url: '',
    subMenu: [
      {title: '부자재 입고 등록', url: '/mes/submaterialV1u/input'},
      {title: '부자재 재고 현황', url: '/mes/submaterialV1u/stock'},
    ]
  },
  {
    title: '품질 관리', url: '',
    subMenu: [
      {title: '불량 통계 (자주검사 관리)', url: '/mes/quality/defect'},
      {title: '초ㆍ중ㆍ종 검사 리스트', url: '/mes/quality/midrange/list'},
      {title: '작업 표준서 관리', url: '/mes/quality/work/standardlist'},
      {title: '변경점 정보 등록', url: '/mes/quality/product/change/register'},
      {title: '변경점 정보 리스트', url: '/mes/quality/product/change/list'},
    ]
  },
  {
    title: '공구 관리', url: '',
    subMenu: [
      {title: '공구 입고 등록', url: '/mes/tool/register'},
      {title: '공구 재고 현황', url: '/mes/tool/list'},
    ]
  },
  {
    title: '재고 관리', url: '',
    subMenu: [
      {title: '재고 현황', url: '/mes/stockV2/list'},
      {title: '생산/납품 현황', url: '/mes/stock/productlist'},
      {title: '생산/납품 현황(관리자용)', url: '/mes/stock/admin'},
    ]
  },
]

const PMS_MENUS: IMenuType[] = [
  // { title: '프레스 모니터링', url: '/pms/monitoring/press' },
  // { title: '프레스별 분석 모니터링', url: '/pms/v2/factoryMonitoring' },
  {
    title: '프레스 모니터링', url: '',
    subMenu: [
      { title: '프레스 분석 모니터링', url: '/pms/v2/factoryMonitoring' },
      // { title: '프레스 현황 모니터링', url: '/pms/new/monitoring/press' }
    ]
  },
  // {
  //   title: '프레스 데이터 통계', url: '',
  //   subMenu: [
  //     { title: '비가동시간 통계 및 분석' , url: '/pms/analysis/readytime'}
  //   ]
  // },
]

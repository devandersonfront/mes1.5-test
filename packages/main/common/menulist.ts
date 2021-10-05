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
  {title: '공장 기본정보', url: '/mes/basic/factory'},
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
    title: '품질 기본정보', url: '',
    subMenu: [
      {title: '공정별 불량 유형 등록', url: '/mes/basic/register/defect'},
    ]
  },
  {title: '주변장치 기본정보', url: '/mes/basic/device'},
  // {title: '기계 기본정보', url: '/mes/basic/machine?page=1'},
  {title: '기계 기본정보', url: '/mes/basic/machine'},
  // {title: '금형 기본정보', url: '/mes/basic/mold?page=1'},
  {title: '금형 기본정보', url: '/mes/basic/moldV1u'},
  // {title: '원자재 기본정보', url: '/mes/basic/rawmaterial?page=1'},
  {title: '원자재 기본정보', url: '/mes/basic/rawmaterialV1u'},
  {title: '부자재 기본정보', url: '/mes/basic/submaterial'},
  // {title: '제품 등록 관리', url: '/mes/basic/product?page=1'},
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
      // {title: '작업지시서 등록', url: '/mes/operaction/register'},
      // {title: '작업지시서 리스트', url: '/mes/operaction/list'},
      // {title: '작업완료 등록(관리자용)', url: '/mes/record/register'},
      // {title: '작업완료 등록(작업자용)', url: '/mes/record/worker/register'},
      // {title: '작업완료 리스트(합산)', url: '/mes/record/sum?page=1'},
      // {title: '작업완료 리스트(관리자용)', url: '/mes/record/list?page=1'},
      // {title: '작업완료 리스트(작업자용)', url: '/mes/record/worker/list?page=1'},
      {title: '작업지시서 등록', url: '/mes/operationV1u/register'},
      {title: '작업지시서 리스트', url: '/mes/operationV1u/list'},
      {title: '작업 일보 리스트', url: '/mes/recordV2/list'},
      {title: '작업 완료 리스트', url: '/mes/finishV2/list'},
    ]
  },
  // {
  //   title: '원자재 관리', url: '',
  //   subMenu: [
  //     {title: '원자재 입고 관리', url: '/mes/rawmaterial/input?page=1'},
  //     {title: '원자재 재고 관리', url: '/mes/rawmaterial/stock?page=1'},
  //   ]
  // },
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
      {title: '부자재 입고 등록', url: '/mes/rawmaterialV1u/input'},
      {title: '부자재 재고 현황', url: '/mes/rawmaterialV1u/stock'},
    ]
  },
  {
    title: '품질 관리', url: '',
    subMenu: [
      {title: '불량 통계', url: '/mes/quality/defect'},
    ]
  },
  {
    title: '재고 관리', url: '',
    subMenu: [
      {title: '재고 현황', url: '/mes/stockV2'},
      {title: '생산/납품 현황', url: '/mes/stock/productlist'},
      {title: '생산/납품 현황(관리자용)', url: '/mes/stock/admin'},
    ]
  },
  // {title: '납품 관리', url: '/mes/delivery',},
  // {title: 'KPI', url: '/mes/kpi',},
]

const PMS_MENUS: IMenuType[] = [
  {
    title: '프레스 모니터링', url: '',
    subMenu: [
      // { name: '프레스 모니터링', url: '/pms/monitoring/press' },
      { title: '프레스 분석 모니터링', url: '/pms/custom/dashboard' },
      { title: '프레스 현황 모니터링', url: '/pms/new/monitoring/press' }
    ]
  },
  {
    title: '프레스 데이터 통계', url: '',
    subMenu: [
      { title: '비가동시간 통계 및 분석' , url: '/pms/analysis/readytime'}
    ]
  },
  // {
  //   title: '금형 관리', url: '',
  //   subMenu: [
  //     { title: '금형 관리', url: '/pms/mold/maintenence' },
  //     { title: '문제점 유형 등록', url: '/pms/mold/maintenence/problem' },
  //   ]
  // },
  // {
  //   title: '프레스 보전관리', url: '',
  //   subMenu: [
  //     { title: '금형 수명 주기', url: '/pms/maintenance/mold' },
  //     { title: '클러치&브레이크', url: '/pms/maintenance/clutch' },
  //     { title: '오일 교환 및 보충', url: '/pms/maintenance/oil' },
  //     { title: '오버톤', url: '/pms/maintenance/overton' }
  //   ]
  // },
  // {
  //   title: '프레스 데이터 통계', url: '',
  //   subMenu: [
  //     { title: '오일 공급', url: '/pms/statistics/oil' },
  //     { title: '비 가동시간', url: '/pms/statistics/readytime' },
  //     { title: '전력', url: '/pms/statistics/power' },
  //     { title: '로드톤 ', url: '/pms/statistics/loadton' },
  //     { title: '능력', url: '/pms/statistics/ability' },
  //     { title: '에러', url: '/pms/statistics/error' },
  //     { title: '불량률', url: '/pms/statistics/defective' },
  //     { title: '제품 별 톤', url: '/pms/statistics/product' },
  //     { title: '금형 타발 수', url: '/pms/statistics/mold' }
  //   ]
  // },
  // {
  //   title: '프레스 데이터 분석', url: '',
  //   subMenu: [
  //     { title: '생산량', url: '/pms/analysis/capacity' },
  //     { title: '능력', url: '/pms/analysis/ability' },
  //     { title: '비가동시간', url: '/pms/analysis/readytime' },
  //     { title: '불량 공정', url: '/pms/analysis/defective' }
  //   ]
  // },
]

import {IMenuType} from './@types/type'

const BASIC_MENUS: IMenuType[] = [
  {
    title: '사용자 권한 관리',
    url: '',
    subMenu: [
      { title: '권한 관리', url: '' },
      { title: '유저 관리', url: '' }
    ]
  },
  {
    title: '고객사 관리',
    url: '',
    subMenu: [
      { title: '고객사 정보 관리', url: '' },
      { title: '고객사 모델 관리', url: '' }
    ]
  },
  {
    title: '공정 관리',
    url: '',
  },
  {
    title: '품질 기준정보',
    url: '',
    subMenu: [
      { title: '공정별 자주검사 항목 등록', url: '' },
    ]
  },
  {
    title: '기계 기준정보',
    url: '',
  },
  {
    title: '제품 등록 관리',
    url: '',
  },
  {
    title: '원자재 기준정보',
    url: '',
  },
  {
    title: '금형 기준정보',
    url: '',
  }
]

const MES_MENUS:IMenuType[] = [
  {
    title: '생산관리 등록',
    url: '',
    subMenu:[]
  },
  {
    title: '생산관리 등록',
    url: ''
  },
  {
    title: '생산관리 등록',
    url: ''
  },
  {
    title: '생산관리 등록',
    url: ''
  },
  {
    title: '납품관리',
    url: ''
  },
  {
    title: 'KPI',
    url: ''
  },
]

const PMS_MENUS = [
  {
    title: '생산관리 등록'
  }
]

const WMS_MENUS = [
  {
    title: '생산관리 등록'
  }
]

const UMS_MENUS = [
  {
    title: '생산관리 등록'
  }
]

const SETTING_MENUS = [
  {
    title: '생산관리 등록'
  }
]

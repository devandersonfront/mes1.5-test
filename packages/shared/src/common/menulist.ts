import {IMenuType} from '../@types/type'
import {bkMesTitles, defaultBasicTitles, defaultMesTitles} from "./menuTitles";
import {BasicOrderType, MesOrderType} from "./menuTitles/types";

type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | "CNC" | ""

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
        case 'CNC'    :
            return CNC_MENUS
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

const BasicOrder : BasicOrderType[] = ['userAuthMgmt', 'factoryInfo', 'manageMgmt','processMgmt','qualityInfo','deviceInfo',
'machineInfo','moldInfo','toolInfo','rawInfo','subInfo','productMgmt','documentMgmt']

const BASIC_MENUS: IMenuType[] = BasicOrder.map(menu => ({
    title:defaultBasicTitles[menu].title,
    url: defaultBasicTitles[menu].url,
    subMenu: defaultBasicTitles[menu]?.subMenu?.map(sub => ({
        title: defaultBasicTitles[sub].title,
        url: defaultBasicTitles[sub].url
    }))
}))

const MesOrder : MesOrderType[] = ['businessMgmt','pmReg','rawMgmt','subMgmt','toolMgmt','qualityMgmt','stockMgmt','kpi']

const MES_MENUS: IMenuType[] = MesOrder.map(menu => ({
    title:defaultMesTitles[menu].title,
    url: defaultMesTitles[menu].url,
    subMenu: defaultMesTitles[menu]?.subMenu?.map(sub => ({
        title: defaultMesTitles[sub].title,
        url: defaultMesTitles[sub].url
    }))
}))

const PMS_MENUS: IMenuType[] = [
    // { title: '프레스 모니터링', url: '/pms/monitoring/press' },
    // { title: '프레스별 분석 모니터링', url: '/pms/v2/factoryMonitoring' },
    {
        title: '프레스 모니터링', url: '',
        subMenu: [
            { title: '프레스 분석 모니터링', url: '/pms/v2/factoryMonitoring' },
            { title: '프레스 현황 모니터링', url: '/pms/new/monitoring/press' }
        ]
    },
    {
        title: '프레스 통계 및 분석', url: '',
        subMenu: [
            { title : '생산량' , url : '/pms/v2/analysis/output'},
            { title : '능력' , url : '/pms/v2/analysis/ability'},
            { title : '에러' , url : '/pms/v2/analysis/error'},
            { title : '전력' , url : '/pms/v2/analysis/power'},
            { title : '기계 비가동 시간' , url: '/pms/v2/analysis/idleTime'},
            { title : '작업시간' , url : '/pms/v2/analysis/workTime'},
        ]
    },
    {
        title: '프레스 관리', url: '',
        subMenu: [
            { title : '에러 보기' , url : '/pms/v2/press/maintenance/errorview'},
            { title : '파라미터 보기' , url : '/pms/v2/press/maintenance/parameterview'},
            { title : '캠 보기' , url : '/pms/v2/press/maintenance/camview'},
            { title : '클러치&브레이크' , url : '/pms/v2/press/maintenance/clutchandbrake'},
            { title : '설비 수리 요청 등록' , url : '/pms/v2/press/maintenance/facilities'},
            { title : '설비 수리 요청 리스트' , url : '/pms/v2/press/maintenance/list'},
            { title : '설비 수리 완료 리스트' , url : '/pms/v2/press/maintenance/complete'},
            { title : '설비 수리 완료 리스트(관리자용)' , url : '/pms/v2/press/maintenance/complete/admin'},
            { title : '설비 문제 유형 등록' , url : '/pms/v2/press/maintenance/problem'},
            { title : '프레스 일상점검 등록' , url : '/pms/v2/press/maintenance/PressDailyRegister'},
            { title : '프레스 일상점검 일일현황' , url : '/pms/v2/press/maintenance/PressDailyStatus'}

        ]
    },
    {
        title: '금형 관리', url: '',
        subMenu: [
            { title : '금형 타수 관리' , url : '/pms/v2/mold/maintenance'},
            { title : '금형 수리 요청 등록' , url : '/pms/v2/mold/maintenance/repairs'},
            { title : '금형 수리 요청 리스트' , url : '/pms/v2/mold/maintenance/list'},
            { title : '금형 수리 완료 리스트' , url : '/pms/v2/mold/maintenance/complete'},
            { title : '금형 수리 완료 리스트(관리자용)' , url : '/pms/v2/mold/maintenance/complete/admin'},
            { title : '금형 문제 유형 등록' , url : '/pms/v2/mold/maintenance/problem'},
            { title : '금형 일상정검 등록' , url : '/pms/v2/press/maintenance/moldDailyRegister'},
            { title : '금형 일상정검 일일현황' , url : '/pms/v2/press/maintenance/moldDailyStatus'}

        ]
    },
    // {
    //   title: '프레스 데이터 통계', url: '',
    //   subMenu: [
    //     { title: '비가동시간 통계 및 분석' , url: '/pms/analysis/readytime'}
    //   ]
    // },
]
const CNC_MENUS: IMenuType[] = [
    {
        title: '설비 모니터링', url: '',
        subMenu: [
            { title: 'CNC 설비 모니터링', url: '/pms/v2/factoryMonitoring' },
        ]
    },
    {
        title: 'CNC 데이터 통계', url: '',
        subMenu: [
            { title : '생산량' , url : '/pms/v2/analysis/output'},
            { title : '에러' , url : '/pms/v2/analysis/error'},
            { title : '기계 비가동 시간' , url: '/pms/v2/analysis/idleTime'},
        ]
    },
    {
        title: 'CNC 관리', url: '',
        subMenu: [
            { title : '설비 수리 요청 등록' , url : '/pms/v2/press/maintenance/facilities'},
            { title : '설비 수리 요청 리스트' , url : '/pms/v2/press/maintenance/list'},
            { title : '설비 수리 완료 리스트' , url : '/pms/v2/press/maintenance/complete'},
            { title : '설비 수리 완료 리스트(관리자용)' , url : '/pms/v2/press/maintenance/complete/admin'},
            { title : '설비 문제 유형 등록' , url : '/pms/v2/press/maintenance/problem'},
        ]
    },
]

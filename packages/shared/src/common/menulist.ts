import { IMenu as IAuthType, IMenuType } from '../@types/type'
import {
    HomeTitles,
    BasicTitles,
    MesTitles,
    CncTitles,
    PmsTitles,
    toAuth,
    HomeAuth,
    BasicAuth,
    MesAuth, PmsAuth, CncAuth
} from './menuTitles'
import {BasicOrderType, CncOrderType, HomeOrderType, MesOrderType, PmsOrderType} from './menuTitles/types'
import {titles} from "./menuTitles/titles";
import cookie from 'react-cookies'

export type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | "CNC" | ""

export const MENUS = () => {
    const configMenus = process.env.NEXT_PUBLIC_MENUS
    return configMenus === undefined ? ['HOME', 'BASIC', 'MES', 'PMS'] : configMenus.split(',')
}

export const menuSelect = (type: IMenu) => {
    switch(type){
        case 'HOME'   :
            return HOME_MENUS
        case 'BASIC'  :
            return BASIC_MENUS
        case 'MES'    :
            return MES_MENUS()
        case 'PMS'    :
            return PMS_MENUS()
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

export const authList = (type: string) => {
    switch(type){
        case 'HOME'   :
            return HOME_AUTH
        case 'BASIC'  :
            return BASIC_AUTH
        case 'MES'    :
            return MES_AUTH
        case 'PMS'    :
            return PMS_AUTH
        case 'CNC'    :
            return CNC_AUTH
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

let customTarget = process.env.NEXT_PUBLIC_CUSTOM_TARGET

const HomeOrder = (customTarget?: string): HomeOrderType[] => {
    const defaultOrder: HomeOrderType[] = ['home']
    switch(customTarget){
        default: return defaultOrder
    }
}



const BasicOrder = (customTarget?: string): BasicOrderType[] => {
    const defaultOrder: BasicOrderType[] = [ 'userAuthMgmt', 'factoryMgmt', 'customerMgmt', 'processMgmt', 'qualityMgmt', 'deviceMgmt',
        'machineMgmt', 'moldMgmt', 'toolMgmt', 'rawMgmt', 'subMgmt', 'productMgmt', 'documentMgmt' ]

    if(cookie.load('userInfo')?.company === "9UZ50Q"){
        defaultOrder.push("welding")
    }

    switch(customTarget){
        case 'dohwa': defaultOrder.splice(7,1)
        case 'ai' : return [ 'userAuthMgmt', 'factoryMgmt', 'customerMgmt', 'processMgmt', 'qualityMgmt', 'deviceMgmt',
            'machineMgmt', 'moldMgmt', 'toolMgmt', 'rawMgmt', 'subMgmt', 'productMgmt', 'opAiDataset', 'documentMgmt' ]
        default: return defaultOrder
    }
}

const MesOrder = (customTarget?: string): MesOrderType[] => {
    const defaultOrder : MesOrderType[] = ['businessMgmt','pmReg','rawMgmt','subMgmt','toolMgmt','qualityMgmt','stockMgmt','outsourceMgmt', 'kpi']
    switch(customTarget){
        case 'dohwa': defaultOrder.splice(7,1)
        default: return defaultOrder
    }
}

const PmsOrder = (customTarget?: string): PmsOrderType[] => {
    const defaultOrder: PmsOrderType[] = ['pressMon', 'pressStats', 'pressMnt', 'moldMnt']
    switch(customTarget){
        default: return defaultOrder
    }
}

const CncOrder = (customTarget?: string): CncOrderType[] => {
    const defaultOrder: CncOrderType[] = ['cncMon', 'cncStats', 'cncMnt']
    switch(customTarget){
        default: return defaultOrder
    }
}

const HOME_MENUS: IMenuType[] = HomeOrder(customTarget).map(menu => {
    return {
        title:HomeTitles(customTarget)[menu].title,
        url: HomeTitles(customTarget)[menu].url,
        subMenu: HomeTitles(customTarget)[menu]?.subMenu?.map(sub => ({
            title: HomeTitles(customTarget)[sub].title,
            url: HomeTitles(customTarget)[sub].url
        }))
    }
})


const BASIC_MENUS: IMenuType[] = BasicOrder(customTarget).map(menu => {
    return {
        title:BasicTitles(customTarget)[menu].title,
          url: BasicTitles(customTarget)[menu].url,
      subMenu: BasicTitles(customTarget)[menu]?.subMenu?.map(sub => ({
        title: BasicTitles(customTarget)[sub].title,
        url: BasicTitles(customTarget)[sub].url
    }))
    }
})

const MES_MENUS = () => {
    const user = cookie.load('userInfo')
    let companyTarget = user?.company === '4XX21Z' ? 'ds' : process.env.NEXT_PUBLIC_COMPANY_TARGET
    return MesOrder(customTarget).map(menu => ({
        title:MesTitles(customTarget,companyTarget)[menu].title,
        url: MesTitles(customTarget,companyTarget)[menu].url,
        subMenu: MesTitles(customTarget,companyTarget)[menu]?.subMenu?.map(sub => ({
            title: MesTitles(customTarget,companyTarget)[sub].title,
            url: MesTitles(customTarget,companyTarget)[sub].url,
            subMenu : MesTitles(customTarget,companyTarget)[sub]?.subMenu?.map(third => ({
                title: MesTitles(customTarget,companyTarget)[third]?.title,
                url: MesTitles(customTarget,companyTarget)[third]?.url
            }))
        }))
    }))
}

const PMS_MENUS = () => {
    const user = cookie.load('userInfo')
    let companyTarget = user?.company === '9UZ50Q' ? 'eunhae' : process.env.NEXT_PUBLIC_COMPANY_TARGET
    return PmsOrder(customTarget).map(menu => ({
        title: PmsTitles(customTarget , companyTarget)[menu].title,
        url: PmsTitles(customTarget , companyTarget)[menu].url,
        subMenu: PmsTitles(customTarget , companyTarget)[menu]?.subMenu?.map(sub => ({
            title: PmsTitles(customTarget, companyTarget)[sub].title,
            url: PmsTitles(customTarget, companyTarget)[sub].url
        }))
    }))
}

const CNC_MENUS: IMenuType[] = CncOrder(customTarget).map(menu => ({
    title:CncTitles(customTarget)[menu].title,
    url: CncTitles(customTarget)[menu].url,
    subMenu: CncTitles(customTarget)[menu]?.subMenu?.map(sub => ({
        title: CncTitles(customTarget)[sub].title,
        url: CncTitles(customTarget)[sub].url
    }))
}))

const HOME_AUTH: IAuthType =
  toAuth(titles.home, false,false,true, ['home'].map(tab => ({
      title: HomeAuth(customTarget)[tab].title,
      show: HomeAuth(customTarget)[tab].show,
      checkable: HomeAuth(customTarget)[tab].checkable,
      check: HomeAuth(customTarget)[tab].check,
      child: HomeAuth(customTarget)[tab]?.child?.map(child => ({
          title: HomeAuth(customTarget)[child].title,
          show: HomeAuth(customTarget)[child].show,
          checkable: HomeAuth(customTarget)[child].checkable,
          check: HomeAuth(customTarget)[child].check,
          child: HomeAuth(customTarget)[child].child,
          value: HomeAuth(customTarget)[child].value,
      })),
      value: HomeAuth(customTarget)[tab].value,
    })))

const BASIC_AUTH: IAuthType = toAuth(titles.basicMgmt, false,true,false, BasicOrder(customTarget).map(tab => ({
    title: BasicAuth(customTarget)[tab].title,
    show: BasicAuth(customTarget)[tab].show,
    checkable: BasicAuth(customTarget)[tab].checkable,
    check: BasicAuth(customTarget)[tab].check,
    child: BasicAuth(customTarget)[tab]?.child?.map(child => ({
        title: BasicAuth(customTarget)[child].title,
        show: BasicAuth(customTarget)[child].show,
        checkable: BasicAuth(customTarget)[child].checkable,
        check: BasicAuth(customTarget)[child].check,
        child: BasicAuth(customTarget)[child].child,
        value: BasicAuth(customTarget)[child].value,
    })),
    value: BasicAuth(customTarget)[tab].value,
})))


const MES_AUTH: IAuthType = toAuth(titles.mes, false,true,false, MesOrder(customTarget).map(tab => ({
    title: MesAuth(customTarget)[tab].title,
    show: MesAuth(customTarget)[tab].show,
    checkable: MesAuth(customTarget)[tab].checkable,
    check: MesAuth(customTarget)[tab].check,
    child: MesAuth(customTarget)[tab]?.child?.map(child => ({
        title: MesAuth(customTarget)[child].title,
        show: MesAuth(customTarget)[child].show,
        checkable: MesAuth(customTarget)[child].checkable,
        check: MesAuth(customTarget)[child].check,
        child: MesAuth(customTarget)[child].child,
        value: MesAuth(customTarget)[child].value,
    })),
    value: MesAuth(customTarget)[tab].value,
})))

const PMS_AUTH: IAuthType = toAuth(titles.pms, false,true,false, PmsOrder(customTarget).map(tab => ({
    title: PmsAuth(customTarget)[tab].title,
    show: PmsAuth(customTarget)[tab].show,
    checkable: PmsAuth(customTarget)[tab].checkable,
    check: PmsAuth(customTarget)[tab].check,
    child: PmsAuth(customTarget)[tab]?.child?.map(child => ({
        title: PmsAuth(customTarget)[child].title,
        show: PmsAuth(customTarget)[child].show,
        checkable: PmsAuth(customTarget)[child].checkable,
        check: PmsAuth(customTarget)[child].check,
        child: PmsAuth(customTarget)[child].child,
        value: PmsAuth(customTarget)[child].value,
    })),
    value: PmsAuth(customTarget)[tab].value,
})))

const CNC_AUTH: IAuthType = toAuth(titles.cnc, false,true,false, CncOrder(customTarget).map(tab => ({
    title: CncAuth(customTarget)[tab].title,
    show: CncAuth(customTarget)[tab].show,
    checkable: CncAuth(customTarget)[tab].checkable,
    check: CncAuth(customTarget)[tab].check,
    child: CncAuth(customTarget)[tab]?.child?.map(child => ({
        title: CncAuth(customTarget)[child].title,
        show: CncAuth(customTarget)[child].show,
        checkable: CncAuth(customTarget)[child].checkable,
        check: CncAuth(customTarget)[child].check,
        child: CncAuth(customTarget)[child].child,
        value: CncAuth(customTarget)[child].value,
    })),
    value: CncAuth(customTarget)[tab].value,
})))

export const AUTHORITY_LIST = MENUS().map(menu => authList(menu))

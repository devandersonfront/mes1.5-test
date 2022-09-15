import {IMenuType} from '../@types/type'
import {BasicTitles, MesTitles, CncTitles, PmsTitles} from "./menuTitles";
import { BasicOrderType, CncOrderType, MesOrderType, PmsOrderType } from './menuTitles/types'

type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | "CNC" | ""

export const menuSelect = (type: IMenu) => {
    switch(type){
        case 'HOME'   :
            return []
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

const customTarget = process.env.NEXT_PUBLIC_CUSTOM_TARGET

const BasicOrder = (customTarget?: string): BasicOrderType[] => {
    const defaultOrder: BasicOrderType[] = [ 'userAuthMgmt', 'factoryMgmt', 'customerMgmt', 'processMgmt', 'qualityMgmt', 'deviceMgmt',
        'machineMgmt', 'moldMgmt', 'toolMgmt', 'rawMgmt', 'subMgmt', 'productMgmt', 'documentMgmt' ]
    switch(customTarget){
        default: return defaultOrder
    }
}

const MesOrder = (customTarget?: string): MesOrderType[] => {
    const defaultOrder: MesOrderType[] = ['businessMgmt','pmReg','rawMgmt','subMgmt','toolMgmt','qualityMgmt','stockMgmt','outsourcing','kpi']
    switch(customTarget){
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


const MES_MENUS: IMenuType[] = MesOrder(customTarget).map(menu => ({
    title:MesTitles(customTarget)[menu].title,
    url: MesTitles(customTarget)[menu].url,
    subMenu: MesTitles(customTarget)[menu]?.subMenu?.map(sub => ({
        title: MesTitles(customTarget)[sub].title,
        url: MesTitles(customTarget)[sub].url
    }))
}))

const PMS_MENUS: IMenuType[] = PmsOrder(customTarget).map(menu => ({
    title:PmsTitles(customTarget)[menu].title,
    url: PmsTitles(customTarget)[menu].url,
    subMenu: PmsTitles(customTarget)[menu]?.subMenu?.map(sub => ({
        title: PmsTitles(customTarget)[sub].title,
        url: PmsTitles(customTarget)[sub].url
    }))
}))

const CNC_MENUS: IMenuType[] = CncOrder(customTarget).map(menu => ({
    title:CncTitles(customTarget)[menu].title,
    url: CncTitles(customTarget)[menu].url,
    subMenu: CncTitles(customTarget)[menu]?.subMenu?.map(sub => ({
        title: CncTitles(customTarget)[sub].title,
        url: CncTitles(customTarget)[sub].url
    }))
}))

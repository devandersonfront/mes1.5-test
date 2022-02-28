import React, {useEffect, useState} from 'react'
import {menuSelect} from '../../common/menulist'
import {IMenuType} from '../../common/@types/type'
import {MenuNavComponent, MenuNavItem, MenuText, SideMenuItem} from '../../styles/styledComponents'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import ic_home from '../../public/images/ic_home.png'
//@ts-ignore
import ic_info from '../../public/images/ic_info.png'
//@ts-ignore
import ic_mes from '../../public/images/ic_mes.png'
//@ts-ignore
// import ic_pms from '../../public/images/icon_CMS_WH_T.svg'
import ic_pms from '../../public/images/ic_pms.png'
//@ts-ignore
import ic_wms from '../../public/images/ic_wms.png'
//@ts-ignore
import ic_ums from '../../public/images/ic_ums.png'
//@ts-ignore
import ic_cnc from '../../public/images/icon_CMS_WH_T.svg'

//@ts-ignore
import ic_setting from '../../public/images/ic_setting.png'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'
import {setMenuStateChange} from '../../reducer/menuState'
import {RootState} from '../../reducer'

type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | "CNC" | ""

interface IProps {
  pageType?: IMenu,
  subType?: number
}

interface IMenuStateType {
  main: string
  sub: string
}

const MenuNavigation = ({pageType, subType}: IProps) => {
  const [menuType, setMenuType] = useState<IMenu>(pageType ?? "")
  const [menuList, setMenuList] = useState<IMenuType[]>()
  const [subMenuList, setSubMenuList] = useState<IMenuType[][]>([])

  const selector = useSelector((selector:RootState) => selector.menuState)
  const dispatch = useDispatch()

  const router = useRouter()

  useEffect(() => {
    let tmpMenu = menuSelect(menuType)
    setMenuList(tmpMenu)
    setSubMenuList(new Array(tmpMenu?.length).fill([]).map((v, i) => {
      return tmpMenu[i].subMenu
    }))
  }, [menuType])

  useEffect(() => {
    setMenuType(pageType)
  }, [pageType])

  const changeMenuType = (selectType: IMenu) => {
    if(menuType === selectType) {
      setMenuType("")
      dispatch(setMenuStateChange({
        main: [],
        sub: []
      }))
    }else{
      setMenuType(selectType)
      let tmpMenu = menuSelect(selectType)
      dispatch(setMenuStateChange({
        main: tmpMenu,
        sub: new Array(tmpMenu?.length).fill([]).map((v, i) => {
          return []
        })
      }))
    }
  }

  return (
    <div style={{display: 'flex'}}>
      <MenuNavComponent>
        <div>
          <MenuNavItem style={{backgroundColor: menuType === "HOME" ? POINT_COLOR : undefined}} onClick={() => {
            router.push('/mes/dashboard')
            changeMenuType("HOME")
          }}>
            <img src={ic_home} style={{width: 30, height: 30, marginBottom: 5}}/>
            <MenuText>HOME</MenuText>
          </MenuNavItem>
          <MenuNavItem style={{backgroundColor: menuType === "BASIC" ? POINT_COLOR : undefined}} onClick={() => {
            changeMenuType("BASIC")
          }}>
            <img src={ic_info} style={{width: 30, height: 30, marginBottom: 5}}/>
            <MenuText>기준정보관리</MenuText>
          </MenuNavItem>
          <MenuNavItem style={{backgroundColor: menuType === "MES" ? POINT_COLOR : undefined}} onClick={() => {
            changeMenuType("MES")
          }}>
            <img src={ic_mes} style={{width: 30, height: 30, marginBottom: 5}}/>
            <MenuText>MES</MenuText>
          </MenuNavItem>
          <MenuNavItem style={{backgroundColor: menuType === "CNC" ? POINT_COLOR : undefined}} onClick={() => {
            changeMenuType("CNC")
          }}>
            <img src={ic_cnc} style={{width: 30, height: 30, marginBottom: 5}}/>
            <MenuText>CNC</MenuText>
          </MenuNavItem>
          {/*<MenuNavItem style={{backgroundColor: menuType === "WMS" ? POINT_COLOR : undefined}} onClick={() => {*/}
          {/*  changeMenuType("WMS")*/}
          {/*}}>*/}
          {/*  <img src={ic_wms} style={{width: 30, height: 30, marginBottom: 5}}/>*/}
          {/*  <MenuText>WMS</MenuText>*/}
          {/*</MenuNavItem>*/}
          {/*<MenuNavItem style={{backgroundColor: menuType === "UMS" ? POINT_COLOR : undefined}} onClick={() => {*/}
          {/*  changeMenuType("UMS")*/}
          {/*}}>*/}
          {/*  <img src={ic_ums} style={{width: 30, height: 30, marginBottom: 5}}/>*/}
          {/*  <MenuText>UMS</MenuText>*/}
          {/*</MenuNavItem>*/}
          {/*<MenuNavItem style={{backgroundColor: menuType === "SETTING" ? POINT_COLOR : undefined}} onClick={() => {*/}
          {/*  changeMenuType("SETTING")*/}
          {/*}}>*/}
          {/*  <img src={ic_setting} style={{width: 30, height: 30, marginBottom: 5}}/>*/}
          {/*  <MenuText>Setting</MenuText>*/}
          {/*</MenuNavItem>*/}
        </div>
        <div style={{width: 198, paddingTop: 30, paddingLeft: 24}}>
          {
            selector.main && selector.main.map((v, i) => <>
              <SideMenuItem onClick={() => {
                if(v.subMenu && v.subMenu.length){
                  let tmpSubMenus = selector.sub

                  if(tmpSubMenus[i].length){
                    tmpSubMenus[i] = []
                  }else{
                    tmpSubMenus[i] = v.subMenu ?? []
                  }
                  dispatch(setMenuStateChange({
                    ...selector,
                    sub: [...tmpSubMenus]
                  }))
                } else if(v.url) {
                  router.push(v.url)
                }
              }}>
                <p>{v.title}</p>
              </SideMenuItem>
                {
                  selector.sub[i] && selector.sub[i].length ?
                    selector.sub[i].map((sub =>
                      <SideMenuItem onClick={() => {
                        if(sub.url){
                          router.push(sub.url)
                        }
                      }}>
                        <p style={{fontSize: 13, paddingLeft: 12}}>· {sub.title}</p>
                      </SideMenuItem>
                    ))
                    : null
                }
            </>
            )
          }
        </div>
      </MenuNavComponent>
    </div>
  );
}

export default MenuNavigation;

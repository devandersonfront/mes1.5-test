import React, {useEffect, useState} from 'react'
import {MENUS, menuSelect} from 'shared/src/common/menulist'
import {MenuNavComponent, MenuNavItem, MenuText, SideMenuItem} from '../../styles/styledComponents'
import {POINT_COLOR} from 'shared/src/common/configset'
//@ts-ignore
import ic_home from '../../public/images/ic_home.png'
//@ts-ignore
import ic_info from '../../public/images/ic_info.png'
//@ts-ignore
import ic_mes from '../../public/images/ic_mes.png'
//@ts-ignore
import ic_cnc from '../../public/images/icon_CMS_WH_T.svg'
//@ts-ignore
import ic_pms from '../../public/images/ic_pms.png'
//@ts-ignore
import ic_wms from '../../public/images/ic_wms.png'
//@ts-ignore
import ic_ums from '../../public/images/ic_ums.png'
//@ts-ignore
import ic_setting from '../../public/images/ic_setting.png'
import {useRouter} from 'next/router'
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from 'shared/src/reducer'
import { selectMenuState, setMenuState } from 'shared/src/reducer/menuState'

type IMenu = 'HOME' | 'BASIC' | 'MES' | 'PMS' | 'WMS' | 'UMS' | 'SETTING' | "CNC" | ""

interface IMenuType {
  title: string
  url: string
  subMenu?: IMenuType[]
}

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

  const selector = useSelector(selectMenuState)
  const selectMenu = useSelector((selector:RootState) => selector.menuSelectState)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    let tmpMenu =  menuSelect(menuType)
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
      dispatch(setMenuState({
        main: [],
        sub: [],
      }))
    }else{
      setMenuType(selectType)
      let tmpMenu = menuSelect(selectType)
      dispatch(setMenuState({
        main: tmpMenu,
        sub: new Array(tmpMenu?.length).fill([]).map((v, i) => {
          return []
        }),
      }))
    }
  }

  return (
      <div className={'nav unprintable'} style={{display: 'flex' , height : '100%'}}>
        <MenuNavComponent>
            <div style={{background : '#2b3c5c' , height : '100%'}}>
              <div style={{height : '100vh'}}>
              {
                MENUS().map((menu, menuIdx) => {
                  switch(menu){
                    case 'HOME':
                      return <MenuNavItem key={menuIdx} style={{backgroundColor: menuType === "HOME" ? POINT_COLOR : undefined}} onClick={() => {
                      changeMenuType("HOME")
                    }}>
                      <img src={ic_home} style={{width: 30, height: 30, marginBottom: 5}}/>
                      <MenuText>HOME</MenuText>
                    </MenuNavItem>
                    case 'BASIC':
                      return <MenuNavItem key={menuIdx} style={{backgroundColor: menuType === "BASIC" ? POINT_COLOR : undefined}} onClick={() => {
                        changeMenuType("BASIC")
                      }}>
                        <img src={ic_info} style={{width: 30, height: 30, marginBottom: 5}}/>
                        <MenuText>기준정보관리</MenuText>
                      </MenuNavItem>
                    case 'MES':
                      return <MenuNavItem key={menuIdx} style={{backgroundColor: menuType === "MES" ? POINT_COLOR : undefined}} onClick={() => {
                        changeMenuType("MES")
                      }}>
                        <img src={ic_mes} style={{width: 30, height: 30, marginBottom: 5}}/>
                        <MenuText>MES</MenuText>
                      </MenuNavItem>
                    case 'PMS':
                      return <MenuNavItem key={menuIdx} style={{backgroundColor: menuType === "PMS" ? POINT_COLOR : undefined}} onClick={() => {
                        changeMenuType("PMS")
                      }}>
                        <img src={ic_pms} style={{width: 30, height: 30, marginBottom: 5}}/>
                        <MenuText>PMS</MenuText>
                      </MenuNavItem>
                    case 'CNC':
                      return <MenuNavItem key={menuIdx} style={{backgroundColor: menuType === "CNC" ? POINT_COLOR : undefined}} onClick={() => {
                        changeMenuType("CNC")
                      }}>
                        <img src={ic_cnc} style={{width: 30, height: 30, marginBottom: 5}}/>
                        <MenuText>CNC</MenuText>
                      </MenuNavItem>
                    default: break
                  }
                })
              }
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
          </div>
          <div style={{width: 198, paddingTop: 30, paddingLeft: 24 ,background : selector.main.length > 0 ? '#2b3c5c' : undefined}}>
            {
              selector.main && selector.main.map((v, i) => <>
                    <SideMenuItem onClick={() => {
                      if(v.subMenu && v.subMenu.length){
                        let tmpSubMenus = [...selector.sub]
                        // 있으면 비우고 없으면 채워라
                        if(tmpSubMenus[i].length){
                          tmpSubMenus[i] = []
                        }else{
                          tmpSubMenus[i] = v.subMenu ?? []
                        }
                        dispatch(setMenuState({
                          ...selector,
                          sub: [...tmpSubMenus],
                        }))
                      } else if(v.url) {
                        router.push(v.url)
                      }
                    }} selectMain={v.title == selectMenu.main}>
                      <p>{v.title}</p>
                    </SideMenuItem>
                    {
                      selector.sub[i] && selector.sub[i].length ?
                          selector.sub[i].map((sub =>
                                  <SideMenuItem onClick={() => {
                                    if(sub.url){
                                      router.push(sub.url)
                                      dispatch(setMenuState({
                                        main: [],
                                        sub: [],
                                      }))
                                    }
                                  }} selectSub={sub.url == selectMenu.sub}>
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

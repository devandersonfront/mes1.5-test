import React from 'react'
import {
    ArrowImageWrapper,
    SecendMenuView,
    TopMenuTitle,
    TopMenuView,
    TreeViewContainer,
    TreeViewHeader,
    TreeViewWrapper
} from '../../styles/styledComponents'
import {IMenu} from '../../common/@types/type'
//@ts-ignore
import menuOpen from "../../public/images/ic_monitoring_open.png"
//@ts-ignore
import menuClose from "../../public/images/ic_monitoring_close.png"
//@ts-ignore
import checkIcon from "../../public/images/ic_check.png"
import Notiflix from 'notiflix'
import TreeView from '../../../shared/src/components/TreeView/TreeView'

interface IProps {
  item: IMenu[]
  setItem: (item: IMenu[]) => void
  selectIndex : number
}


const TreeViewTable = ({item, setItem, selectIndex}: IProps) => {
  const [menu, setMenu] = React.useState<IMenu[]>([{title: "", show: false, checkable: false, value: "", child: []}])

  React.useEffect(() => {
    setMenu(item)
  }, [item])

  const cascadeChecked = (childItems: IMenu[], parentCheck: boolean) => (
    childItems.map(childItem => ({...childItem, check: parentCheck, child: childItem.child?.length > 0 ? cascadeChecked(childItem.child, parentCheck) : childItem.child}))
  )

  const setChecked = (menuItem:IMenu, checkStatus: boolean, noCascade?: boolean) => {
    const hasChildren = menuItem.child.length > 0
    return {...menuItem, check: checkStatus, child: hasChildren && !noCascade ? cascadeChecked(menuItem.child, checkStatus) : menuItem.child}
  }

  const setShow = (menuItem:IMenu) => ({...menuItem, show:!menuItem.show})

  const eventToDown = (menuList: IMenu[],  menuIndexTree:number[], targetDepth:number, currentDepth: number, eventCallBack) => {
    const indexSize = menuIndexTree.length
    if(indexSize === 0) return
    const menuIndex = menuIndexTree[currentDepth]
    if(targetDepth === currentDepth){
      menuList[menuIndex] = eventCallBack(menuList[menuIndex])
    } else {
      currentDepth++
      eventToDown(menuList[menuIndex].child, menuIndexTree, targetDepth, currentDepth, eventCallBack)
    }
  }

  const setParentChecked = (menuList: IMenu[],  menuIndexTree:number[], willCheck: boolean) => {
    const parentIndex= menuIndexTree.length -2
    for (let i = parentIndex; i > -1; i--) {
      const parentCallBack = (menuItem:IMenu) => (
        willCheck ? menuItem.child?.every(childMenu => childMenu.check) ? setChecked(menuItem, true, true) : menuItem
        : menuItem.child?.some(childMenu => !childMenu.check) ? setChecked(menuItem, false, true) : menuItem
    )
      eventToDown(menuList, menuIndexTree, i, 0, parentCallBack)
    }
  }

  const onClickMenu = (menuIndexTree:number[]) => {
    let tmp = menu
    eventToDown(tmp, menuIndexTree, menuIndexTree.length - 1, 0, setShow)
    setMenu([...tmp])
  }

  const onClickCheckBox = (menuIndexTree:number[], parentCheck: boolean) => {
    let tmp = menu
    eventToDown(tmp, menuIndexTree,menuIndexTree.length - 1, 0, (menuItem: IMenu) => setChecked(menuItem, !menuItem.check))
    setParentChecked(tmp, menuIndexTree, !parentCheck)
    setMenu([...tmp])
    setItem([...tmp])
  }

  const RecursiveTreeView = (menus: IMenu[], depth: number, menuIndexTree: number[],  titleStyles?: React.CSSProperties) => (
    menus.map((menu, mIdx) => {
        const UpdatedIndexTree = [...menuIndexTree, mIdx]
        const isChild = depth > 0
        const hasChildren = menu.child?.length > 0
      return [ <div style={{marginLeft: `${depth * 30}px`}}><TreeView open={menu.show} checked={menu.check} hasChildren={hasChildren} checkable={menu.checkable} style={(isChild ? {height: '40px'} : null)}
                    onClickCheckBox={() => onClickCheckBox(UpdatedIndexTree, menu.check)} onClickArrow={() => onClickMenu(UpdatedIndexTree)} title={menu.title}
                              titleStyles={titleStyles}/></div>, menu.show && menu.child && RecursiveTreeView(menu.child, depth + 1, UpdatedIndexTree) ]
      }
    )
  )

  return (
    <TreeViewWrapper>
      <TreeViewHeader>
        <p style={{color: 'white'}}>메뉴</p>
      </TreeViewHeader>
      <TreeViewContainer>
        {
          menu && item && selectIndex !== -1 && RecursiveTreeView(menu, 0, [],{ fontWeight: 'bold', fontSize: '18px', color: 'white' })
        }
      </TreeViewContainer>
    </TreeViewWrapper>
  );
};


export default TreeViewTable

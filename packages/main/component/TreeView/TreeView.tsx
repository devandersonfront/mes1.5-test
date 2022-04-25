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

  const setChecked = (menuItem:IMenu) => {
    const hasChildren = menuItem.child.length > 0
    const recursiveCheck = (childItems: IMenu[], parentCheck: boolean) => (
      childItems.map(childItem => ({...childItem, check: parentCheck, child: childItem.child?.length > 0 ? recursiveCheck(childItem.child, parentCheck) : childItem.child}))
    )
    const checked = !menuItem.check
    return {...menuItem, check: checked, child: hasChildren ? recursiveCheck(menuItem.child, checked) : menuItem.child}
  }

  const recursiveCheck = (menuList: IMenu[],  menuIndexTree:number[], parentCheck: boolean) => {
    const indexSize = menuIndexTree.length
    if(indexSize === 0) return
    const menuIndex = menuIndexTree.shift()
    if(indexSize === 1){
      menuList[menuIndex] = setChecked(menuList[menuIndex])
    } else {
      if(parentCheck) menuList[menuIndex] = {...menuList[menuIndex], check: !parentCheck}
      recursiveCheck(menuList[menuIndex].child, menuIndexTree, parentCheck)
    }
  }

  const recursiveShow = (menuList: IMenu[],  menuIndexTree:number[]) => {
    const indexSize = menuIndexTree.length
    if(indexSize === 0) return
    const menuIndex = menuIndexTree.shift()
    if(indexSize === 1){
      menuList[menuIndex] = {...menuList[menuIndex], show:!menuList[menuIndex].show}
    } else {
      recursiveShow(menuList[menuIndex].child, menuIndexTree)
    }
  }

  const onClickMenu = (menuIndexTree:number[]) => {
    let tmp = menu
    recursiveShow(menu, menuIndexTree)
    setMenu([...tmp])
  }

  const onClickCheckBox = (menuIndexTree:number[], parentCheck: boolean) => {
    let tmp = menu
    recursiveCheck(menu, menuIndexTree, parentCheck)
    setMenu([...tmp])
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

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

interface IProps {
  item: IMenu[]
  setItem: (item: IMenu[]) => void
  selectIndex : number
}


const TreeViewTable = ({item, setItem, selectIndex}: IProps) => {
  const [menu, setMenu] = React.useState<IMenu[]>([{title: "", show: false, checkable: false, value: "", child: []}])

  console.log(menu,'menumenumenu')

  React.useEffect(() => {
    setMenu(recursiveMenu(item))

  }, [item])


  const recursiveMenu = (menu : IMenu[]) => {

    if(menu.length === 0){
      return [];
    }
    const recursiveData = menu.map((data,i)=>{
      if(data.title !== 'HOME'){
        return data 
      }
      return {...data , child : recursiveMenu(data.child.map((v,i)=>({...v ,checkable : false , check : true})))}
    })

    return recursiveData
  }

  

  const onClickMenu = (depth: number, i: number[]) => {
    let tmp = menu

    switch (depth) {
      case 1:
        tmp[i[0]] = {...tmp[i[0]], show: !tmp[i[0]].show}
        break;
      case 2:
        tmp[i[0]].child[i[1]] = {...tmp[i[0]].child[i[1]], show: !tmp[i[0]].child[i[1]].show}
        break;
      case 3:
        tmp[i[0]].child[i[1]].child[i[2]] = {...tmp[i[0]].child[i[1]].child[i[2]], show: !tmp[i[0]].child[i[1]].child[i[2]].show}
        break;
    }

    setMenu([...tmp])
  }

  const onClickCheckbox = (top: number, depth: number, i: number[], nowCheck?: boolean) => {
    let tmp = menu
    switch (depth) {
      case 1:
        let allClick = nowCheck !== undefined ? nowCheck : !tmp[top].child[i[0]].check
        tmp[top].child[i[0]].check = allClick
        tmp[top].child[i[0]].child.map((v, index) => {
          // tmp[top].child[i[0]].child[index].check = allClick
          onClickCheckbox(top, depth+1, [...i, index], allClick)
        })
        break;
      case 2:
        if(tmp[top].child[i[0]].child[i[1]].child.length){
          let allClick = nowCheck !== undefined ? nowCheck : !tmp[top].child[i[0]].child[i[1]].check
          // tmp[top].child[i[0]].child[i[1]].check = allClick
          tmp[top].child[i[0]].child[i[1]].child.map((v, index) => {
            tmp[top].child[i[0]].child[i[1]].child[index].check = allClick
            onClickCheckbox(top, depth+1, [...i, index], allClick)
          })
          break;
        }else{
          let cnt = 0
          tmp[top].child[i[0]].child[i[1]].check = !tmp[top].child[i[0]].child[i[1]].check
          tmp[top].child[i[0]].child.map((v) => {
            if(v.check){
              cnt++
            }
          })

          if(nowCheck !== undefined){
            tmp[top].child[i[0]].child[i[1]].check = nowCheck
          }else{
            tmp[top].child[i[0]].check =
                cnt === tmp[top].child[i[0]].child.length;
          }

          break;
        }
      case 3:
        let cnt1 = 0
        tmp[top].child[i[0]].child[i[1]].child[i[2]].check = !tmp[top].child[i[0]].child[i[1]].child[i[2]].check
        tmp[top].child[i[0]].child[i[1]].child.map((v) => {
          if(v.check){
            cnt1++
          }
        })

        if(nowCheck !== undefined){
          tmp[top].child[i[0]].child[i[1]].check = nowCheck
        }else {
          tmp[top].child[i[0]].child[i[1]].check =
              cnt1 === tmp[top].child[i[0]].child[i[1]].child.length;
        }
        break;
    }

    setItem([...tmp])
  }

  const TreeViewItem = (value: IMenu, key: string, depth: number, indexList: number[]) => {
    return (
      <div>
        <SecendMenuView
          style={{paddingLeft: 48+((depth-2)*40)}}
          onClick={() => {
            if(value.child.length){
              onClickMenu(depth, indexList)
            }
          }}
        >

          {
            value.checkable ?
              <>
                <label
                  htmlFor={`check${key}`}
                  style={{
                    backgroundColor: value.check ? '#19b9df' :'white',
                    width: 14,
                    height: 14,
                    marginRight: 16,
                    cursor: "pointer",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 0
                  }}
                >
                  {
                    value.check && <img src={checkIcon} style={{width: 14, height: 14}} alt={'treeview-checked'} />
                  }
                </label>
                <input
                  hidden
                  type="checkbox"
                  id={`check${key}`}
                  onChange={() => {
                    onClickCheckbox(indexList[0], depth-1, indexList.slice(1))
                  }}
                />
              </>
              : <>
                  <label
                  htmlFor={`check${key}`}
                  style={{
                    backgroundColor: value.check ? '#19b9df' :'white',
                    width: 14,
                    height: 14,
                    marginRight: 16,
                    cursor: "pointer",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 0
                  }}
                  >
                  {
                    value.check && <img src={checkIcon} style={{width: 14, height: 14}} alt={'treeview-checked'} />
                  }
                  </label>
                  <input
                    hidden
                    type="checkbox"
                    id={`check${key}`}
                    onChange={() => {
                      Notiflix.Report.warning('오류', '이 메뉴는 수정하실수 없습니다' , '확인')
                    }}
                  />
                </>
          }
          <p style={{color: 'white'}}>{value.title}</p>
          {
            value.child.length ?
              <ArrowImageWrapper style={{marginLeft: 16}}>
                <img src={value.show ? menuClose : menuOpen} style={{width: 16, height: 16}} alt={'treeview-alter1'}/>
              </ArrowImageWrapper>
              : null
          }
        </SecendMenuView>
        {
          value.show && value.child.length && value.child.map((treeItem, index) => {
            return TreeViewItem(treeItem, key+`${index}`, depth+1, [...indexList, index])
          })
        }
      </div>
    )
  }

  return (
    <TreeViewWrapper>
      <TreeViewHeader>
        <p style={{color: 'white'}}>메뉴</p>
      </TreeViewHeader>
      <TreeViewContainer>
        {
          menu && item && selectIndex !== -1 && menu.map((outerMenu, outerIndex) => menu[outerIndex] && <div style={{height: "100%"}}>
              <TopMenuView onClick={() => onClickMenu(1, [outerIndex])}>
                  <ArrowImageWrapper style={{marginRight: 16}}>
                      <img src={menu[outerIndex].show ? menuClose : menuOpen} style={{width: 16, height: 16}} alt={'treeview-alter2'} />
                  </ArrowImageWrapper>
                  <TopMenuTitle>{outerMenu.title}</TopMenuTitle>
              </TopMenuView>
            { outerMenu.show && outerMenu.child && outerMenu.child.map((innerMenu, innerIndex) =>
                TreeViewItem(innerMenu, `key-${outerIndex}-${innerIndex}`, 2, [outerIndex, innerIndex]))}
          </div> )
        }
      </TreeViewContainer>
    </TreeViewWrapper>
  );
};


export default TreeViewTable

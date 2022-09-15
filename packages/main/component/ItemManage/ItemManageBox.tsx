import {ItemListTableHeader, ItemListTableWrapper, ItemWrapper} from '../../styles/styledComponents'
import React from 'react'
import ItemBox from './ItemBox'
import { IItemMenuType } from 'shared'

interface IProps {
  title: string,
  items: IItemMenuType[]
  setItems: (item: IItemMenuType[]) => void
  type: 'base' | 'additional'
}

const ItemManageBox = ({title, items, setItems, type}: IProps) => {
  return (<ItemListTableWrapper>
    <ItemListTableHeader>
      <p>{title} {type === 'base' ? "기본" : "추가"} 항목</p>
    </ItemListTableHeader>
    <ItemWrapper>
      {items.map((v, index) => {
        return <ItemBox item={v} setItems={(item) => {
          const tempItem = items
          tempItem[index] = item
          setItems([...tempItem])
        }}/>
      })}
      {
        items.length < 28 && new Array(28-items.length).fill('').map(() => {
          return <ItemBox item={{hide: true}} setItems={() => {}}/>
        })
      }
    </ItemWrapper>
  </ItemListTableWrapper>)
}

export default ItemManageBox

import {Item} from '../../styles/styledComponents'
import React from 'react'
import {IItemMenuType} from '../../common/@types/type'
import {POINT_COLOR} from '../../common/configset'

interface IProps {
  item: IItemMenuType
  setItems: (item: IItemMenuType) => void
}

const ItemBox = ({item,setItems}: IProps) => {

  return (
    <Item
      style={{backgroundColor: !item.hide ? POINT_COLOR : undefined,}}
      onClick={() => {
        setItems({
          ...item,
          hide: !item.hide
        })
      }}
    >
      <p style={{color: 'white'}}>{item.title}</p>
    </Item>
  );
}

export default ItemBox

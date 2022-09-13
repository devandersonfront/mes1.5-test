import {Item} from '../../styles/styledComponents'
import React from 'react'
import {POINT_COLOR} from 'shared/src/common/configset'
import Notiflix from 'notiflix'
import { IItemMenuType } from 'shared'

interface IProps {
  item: IItemMenuType
  setItems: (item: IItemMenuType) => void
}

const ItemBox = ({item,setItems}: IProps) => {

  return (
    <Item
      style={{backgroundColor: !item.hide  ? POINT_COLOR : undefined,}}
      onClick={() => {
        if(item.mi_id){
          if(item.moddable){
            setItems({
              ...item,
              hide: !item.hide
            })
          }else{
            Notiflix.Notify.warning('필수인 항목은 숨기기가 불가능합니다.')
          }
      }
      }}
    >
      <p style={{color: 'white'}}>{item.title}</p>
    </Item>
  );
}

export default ItemBox

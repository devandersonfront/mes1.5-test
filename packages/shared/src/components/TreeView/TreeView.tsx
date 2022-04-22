import React from 'react';
//@ts-ignore
import menuOpen from "../../../public/images/ic_monitoring_open.png"
//@ts-ignore
import menuClose from "../../../public/images/ic_monitoring_close.png"
//@ts-ignore
import checkIcon from "../../../public/images/ic_check.png"
import Notiflix from 'notiflix'
import styled from 'styled-components'

type TreeViewProps = {
  open: boolean
  checked: boolean
  checkable: boolean
  hasChildren: boolean
  onClickCheckBox: () => void
  onClickArrow: () => void
  title: string
  titleStyles?: React.CSSProperties
  style?:React.CSSProperties
}

const TreeView = ({title, titleStyles, style, onClickCheckBox, onClickArrow, hasChildren, checkable, open, checked}:TreeViewProps) => {
  console.log(titleStyles)
  const onClickCheck = () => {
    checkable ? onClickCheckBox() : Notiflix.Report.warning('경고', '수정할 수 없습니다.','확인')
  }
  return <TreeViewWrapper style={style}>
    <CheckBoxWrapper onClick={onClickCheck}>
      {
        checked && <img src={checkIcon} style={{ width: 14, height: 14, backgroundColor: '#19b9df' }} alt={'checked'}/>
      }
    </CheckBoxWrapper>
    <OpenTreeWrapper onClick={onClickArrow}>
      <p style={titleStyles}>{title}</p>
      {
        hasChildren && <ArrowImageWrapper>
        <img src={open ? menuClose : menuOpen} alt={'arrow'}/>
        </ArrowImageWrapper>
      }
    </OpenTreeWrapper>
  </TreeViewWrapper>
};

const TreeViewWrapper = styled.div`
  width: 1260px;
  display: flex;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;

`
const CheckBoxWrapper = styled.div`
  height: 14px;
  width: 14px;
  display: flex;
  cursor: pointer;
  display: flex;
  margin-left: 20px;
  justify-content: left;
  background-color: white;
`

const OpenTreeWrapper = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 16px;
  align-items: center;
`

const ArrowImageWrapper = styled.div`
  height: 20px;
  display: flex;
  margin-left: 16px;
`

TreeView.defaultProps = {
  titleStyles: {color: 'white',fontSize: '16px',}
};
export default TreeView

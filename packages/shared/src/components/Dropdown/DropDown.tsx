import React, { useState } from 'react'
import styled from 'styled-components'

interface IProps {
  children?: any
  listStyle?: any
  itemStyle?: any
  items: string[]
  onClick: (index:number) => void
}

const DropDown = (props: IProps) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false)

  return (
    <>
      <Icon onClick={() => setIsOpen(!isOpen)}>
      {
        props.children
      }
      </Icon>
      {
        isOpen && <SelectList style={props.listStyle}>
            {props.items?.map((option:string, index) =>
              <SelectItem key={index} style={props.itemStyle} onClick={(event) => {
                props.onClick(index)
                // setSelectValue(option)
                // onChangeEvent(option)
                setIsOpen(false)
              }}>{option}</SelectItem>
            )}
          </SelectList>
      }
    </>
  )
}

export default DropDown

const Icon = styled.div`
  cursor: pointer;
  user-select: none;
`

const SelectList = styled.ul`
    color: white;
    background: #717C90;
    position: absolute;
    z-index: 1;
    list-style-type: none;
    padding: 0px;
    border-radius:6px;
    margin-top: 30px;
`

const SelectItem = styled.li`
    padding: 10px 30px 10px 10px;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    &:hover{
        background:#202E4A;
    }
`

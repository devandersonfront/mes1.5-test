import React, { useEffect, useState } from 'react'
import styled from "styled-components";
import {IExcelHeaderType} from "../../@types/type";

interface IProps {
  row: any
  column: IExcelHeaderType
  setRow: (row: any) => void
  onChangeOption:any
}

const HeaderSort = ({row, column, setRow, onChangeOption}: IProps) => {
  const [option, setOption] = useState<IExcelHeaderType['sortOption']>('none')
  useEffect(() => {
    setOption(column.sortOption)
  }, [])

  const changeSortOption = (sortOption:string) => {
    switch(sortOption){
      case 'none':
        return 'DESC'
      case 'DESC':
        return 'ASC'
      case 'ASC':
        return 'none'
      default:
        return 'none'
    }
  }

  const SortIcons = () => {
    return <span style={{fontSize: '20px'}} className="material-symbols-outlined">
      {option === 'none' ? 'unfold_more' : option === 'DESC' ? 'expand_more' : 'expand_less'}
    </span>
  }

  const SortOrderNum = () => {
    const index = column.sorts?.sorts?.findIndex(value => value === column.key)
    return !isNaN(index) && index !== -1 ? <span style={{fontSize: '12px'}}>
      {index + 1}
    </span> : null
  }

  return (
    <>
    <HeaderTitle onClick={() => {
      if(column.result){
        const sortOption = changeSortOption(column.sortOption)
        setOption(sortOption)
        column.result(column.key, sortOption)
      }
    }}>
      {column.name}
      <SortIcon>
        {SortIcons()}
        {SortOrderNum()}
      </SortIcon>
    </HeaderTitle>
    </>
  )
}

const HeaderTitle = styled.div`
  color:white;
  font-size:14px;
  font-weight: bold;
  display:flex;
  justify-content:space-between;
  align-items:center;
`;

const SortIcon = styled.div`
   display:flex;
  justify-content:space-between;
  align-items:center;
`


export {HeaderSort};

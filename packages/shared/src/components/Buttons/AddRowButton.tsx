import React from 'react'
import { UploadButton } from '../../styles/styledComponents'
import { POINT_COLOR } from '../../common/configset'
import Styled from 'styled-components'
import Notiflix from 'notiflix'
import { alertMsg } from '../../common/AlertMsg'

interface IProps {
  row: any
  column: any
  onRowChange: (e: any) => void
}
const AddRowButton = ({ row, column, onRowChange}: IProps) => {
  const onClick = () => {
    try{
      if(!!!row.id) throw(alertMsg.noRawMaterial)
      const rowsCopy = column.basicRow.slice()
      rowsCopy.push({...row, isFirst: false, isChange:false, id: row.id + Date.now()})
      column.setBasicRow(rowsCopy)
    }catch(errMsg){
      Notiflix.Report.warning('경고', errMsg, '확인')
    }
  }
  return (
    <Wrapper>
      <UploadButton onClick={onClick} hoverColor={POINT_COLOR}>
        <p>행 추가</p>
      </UploadButton>
    </Wrapper>
    )
}
export {AddRowButton}
const Wrapper = Styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
`

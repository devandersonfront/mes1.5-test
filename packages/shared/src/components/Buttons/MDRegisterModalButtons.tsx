import Notiflix from 'notiflix'
import React from 'react'
import styled from 'styled-components'
import { IExcelHeaderType } from '../../@types/type'

interface IProps {
  seqKey?: 'seq' | 'sequence'
  data: any[]
  setData: (e: any) => void
  dataIndex: number | undefined
  setDataIndex: (e: any) => void
  onDelete?: () => void
  addLimit?: number
}


const MDRegisterModalButtons = ({seqKey = 'seq', data, setData, dataIndex, setDataIndex, onDelete, addLimit = 10 }: IProps) => {
  
  return (<div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
    <Button onClick={() => {
      if(data?.length === addLimit) {
        Notiflix.Report.warning('경고', `최대 ${addLimit}까지 등록할 수 있습니다.`, '확인')
        return
      } else {
        setData(prev =>[
          ...prev,
          {
            setting: 1,
            [seqKey]: prev.length+1,
          }
        ])
      }
    }}>
      <p>행 추가</p>
    </Button>
    <Button style={{marginLeft: 16}} onClick={() => {
      if(dataIndex === undefined || dataIndex === 0){
        return;
      }else{
        let tmpRow = data.slice()
        let tmp = tmpRow[dataIndex]
        tmpRow[dataIndex] = {...tmpRow[dataIndex - 1], [seqKey]: tmpRow[dataIndex - 1][seqKey] + 1, isChange: true}
        tmpRow[dataIndex - 1] = {...tmp, [seqKey]: tmp[seqKey] - 1, isChange: true}
        setData(tmpRow)
        setDataIndex(dataIndex-1)
      }
    }}>
      <p>위로</p>
    </Button>
    <Button style={{marginLeft: 16}} onClick={() => {
      if(dataIndex === data.length-1 || dataIndex === undefined){
        return
      } else {
        let tmpRow = data.slice()
        let tmp = tmpRow[dataIndex]
        tmpRow[dataIndex] = {...tmpRow[dataIndex + 1], [seqKey]: tmpRow[dataIndex + 1][seqKey] - 1, isChange: true}
        tmpRow[dataIndex + 1] = {...tmp, [seqKey]: tmp[seqKey] + 1, isChange: true}
        setData(tmpRow)
        setDataIndex(dataIndex + 1)
      }
    }}>
      <p>아래로</p>
    </Button>
    <Button style={{marginLeft: 16}} onClick={() =>
    {
      if(onDelete){
        onDelete()
      } else {
        if(dataIndex === undefined){
          return Notiflix.Report.warning(
            '경고',
            '선택된 정보가 없습니다.',
            '확인',
          );
        } else {
          let tmpRow = [...data]
          tmpRow.splice(dataIndex, 1)
          const filterRow = tmpRow.map((v , i)=>{
            return {...v , [seqKey] : i + 1, isChange:true}
          })
          setData(filterRow)
          setDataIndex(undefined)
        }
      }
    }}>
      <p>삭제</p>
    </Button>
  </div>)
}

const Button = styled.button`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    
`;

export {MDRegisterModalButtons}

import React from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const DropDownEditor = ({ row, onRowChange, column }: IProps) => {

  const settingText = (value:boolean) => {
    if(value){
      return column.selectList[0].name
    }else{
      return column.selectList[1].name
    }
  }
  return (
    <select
      className={'editDropdown'}
      style={{
        border: 0,
        width: '100%',
        padding: '0 8px 0 9px'
      }}
      value={typeof row[column.key] === "boolean" ? settingText(row[column.key]) : row[column.key]}
      onChange={(event) => {
        let pk = "";
        Object.keys(column && column.selectList ? column.selectList[0] : []).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })

        let pkValue = ""
        column.selectList?.map((v) => {
          if(v.name === event.target.value){
            if(v[pk]){
              pkValue = v[pk]
            }else{
              pkValue = v.pk
            }
          }
        })

        let tmpPk = pk

        if(column.key === 'exhaustion' && row['current'] === 0){
          Notiflix.Report.failure('변경 실패!', '사용할 수 있는 재고가 없습니다', '확인')
        }else{
          let tmpData = {}

          if(column.key === 'customer') {
            let tmpCrn = ''
            column.selectList.map(v => {
              if(v.name === event.target.value) {
                tmpCrn = v.crn
              }
            })
            tmpData = {
              ...tmpData,
              crn: tmpCrn
            }
          }

          return onRowChange({
            //@ts-ignore
            ...row, [column.key]: event.target.value, [column.key+"PK"]: pkValue ?? undefined,
            [tmpPk]: event.target.value, [tmpPk+"PK"]: pkValue, [column.key+"_id"]: pkValue, ...tmpData,
            isChange: true
          })
        }
      }}
    >
      {column.selectList && column.selectList.map((title) => {
        return (<option key={title.pk} value={title.name}>
          {title.name}
        </option>)
      })}
    </select>
  );
}

export default DropDownEditor;

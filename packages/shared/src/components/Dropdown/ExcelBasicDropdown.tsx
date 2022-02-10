import React from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
//@ts-ignore
import filterOpenB from '../../../public/images/filter_open_b.png'
//@ts-ignore
import filterOpenW from '../../../public/images/filter_open_w.png'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const DropDownEditor = ({ row, onRowChange, column }: IProps) => {

  const cleanValue = (type?:string) => {
    switch(type){
      case "spare":
        // 22/01/24 수정

        return row.setting == 1 ? "스페어" : row.setting == 0 ? "기본" : row.setting
        // return row.spare
      case "setting" :
        return row[column.key] == 1 || row[column.key] == "여" ? "여" : "부"
      default:
        return row[column.key] ? row[column.key] : "무"
    }
  }

  return (
    <select
      className={'editDropdown'}
      style={{
        appearance: 'none',
        border: 0,
        width: '100%',
        padding: '0 8px 0 9px',
        color: column.type === 'Modal' ? 'black': 'white',
        background: `url(${column.type === 'Modal' ? filterOpenB : filterOpenW}) no-repeat right 9px center`,
        backgroundSize: '24px',
        backgroundColor: column.type === 'Modal' ? row.border ? '#19B9DF80' : 'white' : '#00000000'
      }}
      value={cleanValue(column.key)}
      // value={selectType()}
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

          // if(column.key === 'customer' || column.key === "Modal") {
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
          // }
          if(column.key === "spare"){
            switch (event.target.value){
              case "스페어":
                row.setting = 1;
                break ;
              case "기본" :
                row.setting = 0;
                break ;
              case "여":
                row.setting = 1;
                break ;
              case "부" :
                row.setting = 0;
                break ;
              default :
                break;
            }
          }

          return onRowChange({
            //@ts-ignore
            ...row, [column.key]:event.target.value, [column.key+"PK"]: pkValue ?? undefined,
            [tmpPk]: event.target.value, [tmpPk+"PK"]: pkValue, [column.key+"_id"]: pkValue,
            // ...tmpData,
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

export {DropDownEditor};

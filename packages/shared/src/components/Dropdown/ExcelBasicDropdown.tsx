import React from 'react'
import {IExcelHeaderType} from '../../@types/type'
import Notiflix from 'notiflix'
//@ts-ignore
import filterOpenB from '../../../public/images/filter_open_b.png'
//@ts-ignore
import filterOpenW from '../../../public/images/filter_open_w.png'
import {isBoolean} from "lodash";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

// 부 0
// 여 1
// 스페어 0
// 기본 1
const DropDownEditor = ({ row, onRowChange, column }: IProps) => {
  const getSelectList = () => {
    if(column.key === 'type' && column.tab === 'ROLE_BASE_15'){
      const selectListIdx = row.product_type ==='생산품' ? 0 : 1
      return column.selectList?.[selectListIdx] ?? []
    }else {
      return column.selectList ?? []
    }
  }
  const selectList: any[] = getSelectList()
  const cleanValue = (type?:string) => {
    switch(type){
      case "spare":
        // 22/01/24 수정
        return row.setting === 0 ?
            "스페어"
            :
            row.setting === 1 ?
                "기본"
                :
                row.setting
        // return row.spare
      case "setting" :
        return (row[column.key] === 1 || row[column.key] === "여")
            ? "여" : "부"
      case "interwork":
        if(isBoolean(row[column.key])){
          return row[column.key] ? "유" : "무"
        }else{
          return row[column.key]
        }
      default :
        return row[column.key] ?? "무"
    }
  }

  const filterValue = (value : string) => {
    switch(value){
      case '여' :
        return 1
      case '부' :
        return 0
      case '기본' :
        return 1
      case '스페어':
        return 0
      default :
        return value
    }
  }

  //
  return (
    <>
    {
      (!(column.tab === 'ROLE_BASE_04' && column.key === 'weldingType') || row.type ==='용접기') ? <select
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
      disabled={column.readonly}
      // value={selectType()}
      onChange={(event) => {
        let pk = "";
        Object.keys(column && column.selectList ? column.selectList[0] : []).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })

        let pkValue = ""
        selectList?.map((v) => {
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
          selectList.map(v => {
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
                row.setting = 0;
                break ;
              case "기본" :
                row.setting = 1;
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


          if((column.tab === 'ROLE_BASE_04' && column.key === 'type') && event.target.value !=='용접기'){

            return onRowChange({
              //@ts-ignore
              ...row, [column.key]:filterValue(event.target.value), [column.key+"PK"]: pkValue ?? undefined,
              [tmpPk]: event.target.value, [tmpPk+"PK"]: pkValue, [column.key+"_id"]: pkValue,
              setting : filterValue(event.target.value),
              // ...tmpData,
              isChange: true,
              weldingType: null,
              weldingTypePK: null,
              weldingType_id: null
            })

          }else if(column.tab === 'ROLE_BASE_15'){
            if(column.key === 'type'){
              onRowChange({
                ...row,
                [column.key]:filterValue(event.target.value),
                [column.key+"_id"]: pkValue ?? undefined,
                isChange: true,
              })
            } else if(column.key === 'product_type'){
              onRowChange({
                ...row,
                [column.key]:filterValue(event.target.value),
                [column.key+"_id"]: pkValue ?? undefined,
                type: '반제품',
                type_id: pkValue === '0' ? 0 : 3,
                isChange: true,
                readonly: pkValue !== '0'
              })
            }
          }else {
            return onRowChange({
              //@ts-ignore
              ...row,
              [column.key]:filterValue(event.target.value),
              [column.key+"PK"]: pkValue ?? undefined,
              [tmpPk]: event.target.value, [tmpPk+"PK"]: pkValue, [column.key+"_id"]: pkValue,
              setting : filterValue(event.target.value),
              // type: filterValue(event.target.value),
              // ...tmpData,
              isChange: true
            })
          }

        }
      }}
    >
      {
        selectList.map((title) => {
        return (<option style={{background:column.type === "Modal" ? "white" : "#353b48"}} key={title.pk} value={title.name}>
          {title.name}
        </option>)
      })
      }

    </select>
          :
          "-"
    }
    </>

  );
}

export {DropDownEditor};

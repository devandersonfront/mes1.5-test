import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import PageHeader from '../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../common/@types/type'
import {RequestMethod} from '../../../common/RequestFunctions'
import {columnlist} from "../../../common/columnInit";
//@ts-ignore
import Notiflix from "notiflix";

import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../common/configset'
import DropDownEditor from '../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'

interface IProps {
  children?: any
  title: string
  user: any
  type: string
  router: any
  optList: string[]
  row?: Array<any>
  column?: IExcelHeaderType[]
}

const machineType = [{pk: 0, name: "선택없음"},
  {pk: 1, name: "프레스"},
  {pk: 2, name: "로봇"},
  {pk: 3, name: "용접기"},
  {pk: 4, name: "밀링"},
  {pk: 5, name: "선반"},
  {pk: 6, name: "탭핑기"},]

// export const getServerSideProps = async (ctx: any) => {
//
//   const changeTitle = (type: string) => {
//     switch(type) {
//       case 'member':
//         return {
//           title: '유저 관리',
//           optList: ['사용자명', '이메일', '직책명', '전화번호','권한명'],
//         }
//       case 'customer':
//         return {
//           title: '고객사 정보 관리',
//           optList: ['고객사명', '대표자명', '담당자명', '전화 번호','휴대폰 번호', '팩스 번호', '주소', '사업자 번호'],
//         }
//       case 'process':
//         return {
//           title: '공정 관리',
//           optList: ['공정명'],
//         }
//       case 'machine':
//         return {
//           title: '기계 기본정보',
//           optList: ['제조번호', '제조사명', '기계명', '공정명', '담당자명'],
//         }
//       case 'productprocess':
//       case 'product':
//         return {
//           title: '제품 등록 관리',
//           optList: ['고객사명','모델명', 'CODE', '품명', '재질'],
//         }
//       case 'rawmaterial':
//         return {
//           title: '원자재 기본정보',
//           optList: ['고객사명', '모델명', 'CODE', '품명', '재질'],
//         }
//       case 'mold':
//         return {
//           title: '금형 기본정보',
//           optList: ['고객사명','모델명', 'CODE', '품명', '재질'],
//         }
//       case 'model':
//         return {
//           title: "고객사 모델정보",
//           optList: ['고객사명','사업자 번호', '모델명'],
//         }
//       case 'rawin':
//         return {
//           title: "원자재 입고 관리",
//           optList: ['고객사명','모델명', 'CODE', '품명', 'lot번호'],
//         }
//       case 'rawstock':
//         return {
//           title: "원자재 재고 관리",
//           optList: ['고객사명','모델명', 'CODE', '품명', 'lot번호'],
//         }
//     }
//   }
//
//   const tempObject = changeTitle(ctx.query.type)
//
//   return {
//     props: {
//       title: tempObject ? tempObject.title : "",
//       type: ctx.query.type,
//       optList: tempObject ? tempObject.optList : []
//     }
//   }
// }

const BasicContainer = ({title, type, optList}: IProps) => {
  const router = useRouter()

  const [basicRow, setBasicRow] = useState<Array<any>>([{name: '', id: '1'}])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(type ? columnlist[type] : [])
  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')

  useEffect(() => {
    LoadBasic().then(() => {})
    setOptionList(optList)
  }, [type])


  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key
        let res: any

        if(v.key === 'authority'){
          res = await RequestMethod('get', `${v.key}All`, )
        } else {

          if(tmpKey.indexOf('customer') !== -1){
            tmpKey = 'customer'
          }else if(tmpKey === 'cm_id'){
            tmpKey = 'model'
          }else if(tmpKey === 'process_id'){
            tmpKey = 'process'
          }

          res = await RequestMethod('get', `${tmpKey}List`,{
            path: {
              page: 1,
              renderItem: MAX_VALUE,
            }
          })
        }

        if(type === 'member'){
          return {
            ...v,
            selectList: [...res.results]
          }
        }else if(type === 'authority') {
          let pk = "";

          Object.keys(res.results[0]).map(v => {
            if(v.indexOf('_id') !== -1){
              pk = v
            }
          })

          return {
            ...v,
            selectList: [...res.results.map((value: any) => {
              return {
                ...value,
                name: value.model,
                pk: value[pk]
              }
            })]
          }
        }else{
          let pk = "";

          res.results.info_list && Object.keys(res.results.info_list[0]).map((v) => {
            if(v.indexOf('_id') !== -1){
              pk = v
            }
          })
          if(tmpKey === 'model'){
            return {
              ...v,
              selectList: [...res.results.info_list.map((value: any) => {
                return {
                  ...value,
                  name: value.model,
                  pk: value[pk]
                }
              })]
            }
          }

          return {
            ...v,
            selectList: [...res.results.info_list.map((value: any) => {
              return {
                ...value,
                pk: value[pk]
              }
            })]
          }
        }
      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id
          }
        }else{
          return v
        }
      }
    })

    // if(type !== 'productprocess'){
    Promise.all(tmpColumn).then(res => {
      setColumn([...res])
    })
    // }
  }

  const SaveBasic = async () => {
    let res = await RequestMethod('post', `${type}Save`,
        {
          [type === 'rawin' || type === 'rawstock' ? 'warehousing' : type+'s']: basicRow.map((row, i) => {
            if(selectList.has(row.id)){
              let selectKey: string[] = []
              let additional:any[] = []
              column.map((v) => {
                if(v.selectList){
                  selectKey.push(v.key)
                }

                if(v.type === 'additional'){
                  additional.push(v)
                }
              })

              let selectData: any = {}

              Object.keys(row).map(v => {
                if(v.indexOf('PK') !== -1) {
                  selectData = {
                    ...selectData,
                    [v.split('PK')[0]]: row[v]
                  }
                }

                if(v === 'unitWeight') {
                  selectData = {
                    ...selectData,
                    unitWeight: Number(row['unitWeight'])
                  }
                }

                if(v === 'exhaustion') {
                  selectData = {
                    ...selectData,
                    current: 0
                  }
                }
              })

              return {
                ...row,
                ...selectData,
                additional: [
                  ...additional.map(v => ({
                    id: v.id,
                    title: v.name,
                    value: row[v.name],
                    unit: v.unit
                  }))
                ]
              }

            }
          }).filter((v) => v)
        })

    if(res){
      if(res.status === 200){
        Notiflix.Report.success('저장되었습니다.','','확인');
        LoadBasic()
      }
    }
  }

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `${type}Delete`,
      {
        [type === 'process' ? 'processes' : type+'s']: basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            if(type === 'member'){
              return row.id
            }else{
              let pk = ""
              Object.keys(row).map((v:string) => {
                if(v.indexOf("_id") !== -1){
                  pk = v
                }
              })

              if(type === 'model') {
                pk = 'cm_id'
              }

              return row[pk]
            }
          }
        }).filter((v) => v)
      })

    if(res) {
      if(res.status === 200){
        LoadBasic()
      }
    }
  }

  const LoadBasic = async () => {
    const res = await RequestMethod('get', `${type}List`,{
      path: type === 'productprocess' ? {
        pp_id: router.query.pp_id
      } : {
        page: 1,
        renderItem: 19,
      },
      params: type === 'rawstock' ? {
        tab : 'ROLE_RMAT_02'
      }: {}
    })

    if(res && res.status === 200){
      cleanUpData(res)
    }
  }

  const SearchBasic = async (keyword: any, option: number) => {
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `${type}Search`,{
      path: type === 'productprocess' ? {
        pp_id: router.query.pp_id
      } : {
        page: 1,
        renderItem: 19,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      cleanUpData(res)
    }
  }

  const changeRow = (row: any, key?: string) => {
    let tmpData = {}
    Object.keys(row).map(v => {

      if(row[v] && typeof row[v] === 'object' && v !== 'additional'){
        let data = changeRow(row[v], v)
        tmpData = {
          ...tmpData,
          ...data,
        }
      }else{
        if(type === 'machine' && v === 'type'){
          tmpData = {
            ...tmpData,
            type: machineType[row.type].name,
            typePK: machineType[row.type].pk
          }
        }else if(type === 'productprocess' && v === 'last') {
          tmpData = {
            ...tmpData,
            last: row['last'] ? '최종 공정' : '-',
            lastPK: row['last']
          }
        } else if(key === 'customer' && v.indexOf(key) === -1){
          if(v === 'name'){
            tmpData = {
              ...tmpData,
              [key+'_idPK']: row[key+'_id'],
              [key+'_id']: row[v],
              [key]: row[v],
            }
          }else if(v === 'name'){
            tmpData = {
              ...tmpData,
              [key+'_'+v]: row[v]
            }
          }else{
            tmpData = {
              ...tmpData,
              [v]: row[v]
            }
          }
        }
        else if (key === 'authority' && v === 'ca_id') {
          tmpData = {
            ...tmpData,
            ['authorityPK']: row['ca_id'],
            ['authority']: row['name'],
          }
        } else if(key === 'raw_material' && v === 'name'){
          tmpData = {
            ...tmpData,
            name: row['name'],
          }
        } else if (key === 'model' && v === 'cm_id') {
          tmpData = {
            ...tmpData,
            ['cm_idPK']: row['cm_id'],
            ['cm_id']: row['model'],
          }
        } else if (key === 'manager' && v === 'user_id') {
          tmpData = {
            ...tmpData,
            ['user_idPK']: row.user_id,
            ['user_id']: row.name,
          }
        } else if(key && v === 'name') {
          tmpData = {
            ...tmpData,
            [`${key}_${v}`]: row[v]
          }
        } else {
          tmpData = {
            ...tmpData,
            [v]: row[v]
          }
        }
      }
    })
    return tmpData
  }


  const cleanUpData = (res: any) => {
    let tmpColumn = type ? columnlist[type] : []
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.results.menus && res.results.menus.map((menu: any) => {
        if(menu.colName === column.key){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit
          }
        }
      })

      if(menuData){
        return {
          ...column,
          ...menuData
        }
      }
    }).filter((v:any) => v)

    let additionalMenus = res.results.menus ? res.results.menus.map((menu:any) => {
      if(menu.colName === null){
        return {
          id: menu.id,
          name: menu.title,
          width: menu.width,
          key: menu.title,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit
        }
      }
    }).filter((v: any) => v) : []


    tmpRow = res.results.info_list

    if(type === 'productprocess'){
      loadAllSelectItems(columnlist[type])
    }else{
      loadAllSelectItems( [
        ...tmpColumn,
        ...additionalMenus
      ] )
    }

    let selectKey = ""
    let additionalData: any[] = []
    tmpColumn.map((v: any) => {
      if(v.selectList){
        selectKey = v.key
      }
    })

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
      }
    })

    let pk = "";
    Object.keys(tmpRow).map((v) => {
      if(v.indexOf('_id') !== -1){
        pk = v
      }
    })

    setBasicRow([...tmpRow.map((row: any, index: number) => {
      let realTableData = changeRow(row)
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      if(row.current !== null && row.current !== undefined){
        appendAdditional = {
          ['exhaustion']: row.current === 0 ? '사용완료' : '-',
          ['exhaustionPK']: row.current === 0
        }
      }

      return {
        id: index,
        ...realTableData,
        password: null,
        ...appendAdditional
      }
    })])

    setSelectList(new Set())
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `${type}`, type, tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        downloadExcel()
        break;
      case 1:
        if(type === 'rawstock'){
          SaveBasic()
        }else{
          router.push(`/mes/item/manage/${type}`)
        }
        break;
      case 2:
        if(type === 'mold' || type === 'raw_material'){
          SaveBasic()
        }else{
          let items = {}

          column.map((value) => {
            if(value.selectList && value.selectList.length){
              items = {
                ...value.selectList[0],
                [value.key] : value.selectList[0].name,
                [value.key+'PK'] : value.selectList[0].pk,//여기 봐야됨!
                ...items,
              }
            }

            if(value.key === 'id') {
              items = {
                ...items,
                tmpId: "",
              }
            }

          })

          setBasicRow([
            ...basicRow,
            {
              ...items,
              id: `${type}_${basicRow.length+1}`,
              name: null,
              additional: [],
            },
          ])
        }
        break;

      case 3:
        SaveBasic()

        break;
      case 4:
        DeleteBasic()
        break;

    }
  }

  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'MES'}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <PageHeader
          isSearch
          searchKeyword={''}
          onChangeSearchKeyword={(keyword) => {
            SearchBasic(keyword, optionIndex)
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            SearchBasic('', option)
          }}
          title={title}
          buttons={
            type === 'rawstock'
              ? ['엑셀로 받기', '저장하기']
              : ['엑셀로 받기', '항목관리', '행 추가', '저장하기', '삭제']
          }
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          headerList={[
            SelectColumn,
            ...column
          ]}
          row={[...basicRow]}
          setRow={setBasicRow}
          selectList={selectList}
          setSelectList={setSelectList}
        />
      </div>
    </div>
  );
}



export default BasicContainer;

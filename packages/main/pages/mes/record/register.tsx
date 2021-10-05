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
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../common/configset'
import DropDownEditor from '../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'
import PaginationComponent from '../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import moment from 'moment'

const title = '작업 완료 등록'
const optList = ['고객사명', '모델명', 'CODE', '품명', '공정', '기계', 'Lot번호']

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicContainer = () => {
  const router = useRouter()

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: `rawinput_${Math.random()*1000}`,
    date: moment().format('YYYY-MM-DD'),
    start: `${moment().format('YYYY-MM-DD HH:mm')}:00`,
    end: undefined,
    poor_quantities: []
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.recordRegister)
  const [selectList, setSelectList] = useState<Set<any>>(new Set())
  const [isGoal, setIsGoal] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    // loadAllSelectItems(column).then((column) => {})
    LoadMenu()
  }, [])

  const loadAllSelectItems = async (column: IExcelHeaderType[], pp_id?: number) => {
    if(pp_id){
      const res = await RequestMethod('get', `productprocessList`,{
        path: {
          pp_id
        }
      })
    }

    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0 && v.key === 'seq'){
        return {
          ...v,
          selectList: []
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

    Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
    })
  }

  const SaveBasic = async () => {
    let tmpRow = basicRow.map(v => {

      if(selectList.has(v.id)){
        return {
          ...v,
          customer_id: v.customer_idPK,
          osd_id: v.osd_idPK,
          cm_id: v.cm_idPK,
          mold_id: v.mold_idPK,
          machine_id: v.machine_idPK,
          process_id: v.process_idPK,
          ln_id: v.ln_idPK,
          paused_time: v.paused_timePK,
          good_quantity: Number(v.good_quantity),
          user_id: v.user_idPK,
          poor_quantities: v.poor_quantities ?? [],
          paused_times: v.paused_times ?? []
        }
      }
    }).filter(v => v)
    if(tmpRow.length){
      let res = await RequestMethod('post', `recordSave`,
      {
        records: [...tmpRow]
      })
      if(res){
        if(res.status === 200){
          Notiflix.Report.success('저장되었습니다.','','확인');
        }
      }
    } else {
      Notiflix.Report.failure('저장 실패', '저장할 데이터를 선택해주세요', '확인')
    }
  }

  const DeleteBasic = async () => {
    let tmpRow = basicRow.map((row, index) => {
      if(selectList.has(row.id)){
        return
      }
      return row
    }).filter(v => v)
    Notiflix.Report.success('삭제되었습니다.','','확인');
    setBasicRow([...tmpRow])
  }

  const LoadMenu = async () => {
    const res = await RequestMethod('get', `itemList`,{
      path: {
        tab: 'ROLE_PROD_05'
      }
    })

    if(res && res.status === 200) {
      let tmpColumn = column
      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object | undefined;
        res.results.bases && res.results.bases.map((menu: any) => {
          if(menu.colName === column.key){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:'ROLE_PROD_05',
              unit:menu.unit,
              moddable: !menu.moddable,
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:'ROLE_PROD_05',
              unit:menu.unit,
              moddable: !menu.moddable
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
      loadAllSelectItems(tmpColumn)
    }else if (res.state === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }
  }

  const changeRow = (row: any) => {
    let tmpData = {}

    return {
      ln_id: row.ln_id,
      rm_id: row.raw_material.rm_id,
      customer_id: row.raw_material.model.customer.name,
      cm_id: row.raw_material.model.model,
      code: row.raw_material.code,
      name: row.raw_material.name,
      texture: row.raw_material.texture,
      depth: row.raw_material.depth,
      width: row.raw_material.width,
      height: row.raw_material.height,
      type: row.raw_material.type,
      amount: row.amount,
      date: row.date,
      number: row.number,
      ...tmpData
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.operationRegister
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
            unit:menu.unit,
            moddable: !menu.moddable
          }
        } else if(menu.colName === 'id' && column.key === 'tmpId'){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit,
            moddable: !menu.moddable
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

    loadAllSelectItems(tmpColumn)

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

    let additionalData: any[] = []

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
      }
    })

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row)
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      const random_id = Math.random()*1000

      return {
        // ...row,
        ...realTableData,
        ...appendAdditional,
        id: `rawinput_${random_id}`,
      }
    })

    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `작업완료등록`, '작업완료등록', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        downloadExcel()
        break;
      // case 1:
      //   router.push(`/mes/item/manage/rawin`)
      //   break;
      case 1:

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
        })

        const random_id = Math.random()*1000

        setBasicRow([
          {
            ...items,
            id: `rawinput_${random_id}`,
            name: '',
            date: moment().format('YYYY-MM-DD'),
            start: `${moment().format('YYYY-MM-DD HH:mm')}:00`,
            end: null,
          },
          ...basicRow
        ])
        break;
      case 2:
        SaveBasic()

        break;
      case 3:
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
            ()=>{
              DeleteBasic()
            },
            ()=>{})

        break;

    }
  }

  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'MES'} subType={0}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <PageHeader
          title={title}
          buttons={['엑셀로 받기', '행 추가', '저장하기', '삭제']}
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          headerList={[
            SelectColumn,
            ...column
          ]}
          row={basicRow}
          // setRow={setBasicRow}
          setRow={(e) => {
            let tmp: Set<any> = selectList
            e.map(v => {
              if(v.isChange) tmp.add(v.id)
            })
            setSelectList(tmp)
            setBasicRow(e)
          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          height={basicRow.length * 40 >= 40*18+40 ? 40*18 : basicRow.length * 40 + 56}
        />
      </div>
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export default BasicContainer;

import React, {useEffect, useState} from 'react'
import {
  columnlist,
  excelDownload,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from "moment"
import {useDispatch} from "react-redux";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";
import {subFactorySearchModal} from "shared/src/components/Modal/SearchModalTest/subFactorySearchModal";

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const machineList = [
  {pk: 0, name: "선택없음"},
  {pk: 1, name: "프레스"},
  {pk: 2, name: "로봇"},
  {pk: 3, name: "용접기"},
  {pk: 4, name: "밀링"},
  {pk: 5, name: "선반"},
  {pk: 6, name: "탭핑기"},
]

const weldingType = [
  {pk:0, name: "선택없음"},
  {pk:1, name: "아르곤"},
  {pk:2, name: "통합"},
  {pk:3, name: "스팟"},
]

const BasicMachineV1u = ({option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["machineV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['기계 제조사', '기계 이름', "", '제조 번호'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [typesState, setTypesState] = useState<number>(null);
  const [selectRow , setSelectRow] = useState<number>(0);

  const changeSetTypesState = (value:number) => {
    setTypesState(value);
    setPageInfo({page:1, total:1})
  }



  useEffect(() => {
    if(keyword){
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }else{
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [pageInfo.page, typesState])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"기계 기준정보",sub:""}))
    return (() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key


        let res: any
        res = await RequestMethod('get', `${tmpKey}List`,{
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          }
        })

        let pk = "";

        res.info_list && res.info_list.length && Object.keys(res.info_list[0]).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })
        return {
          ...v,
          selectList: [...res.info_list.map((value: any) => {
            return {
              ...value,
              name: tmpKey === 'model' ? value.model : value.name,
              pk: value[pk]
            }
          })]
        }

      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id,
            result:changeSetTypesState
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
    let result = [];
    let mfrCodeCheck = true
    basicRow.map((row, index)=>{
      if(selectList.has(row.id)){
        if(!row.mfrCode) mfrCodeCheck = false;
        result.push(cleanForRegister(row))
      }
    })
    if(result.length === 0) {
      Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인", )
      return
    }else if(!mfrCodeCheck){
      Notiflix.Report.warning("경고","제조 번호를 입력해주세요.","확인", )
      return
    }
      RequestMethod('post', `machineSave`, result)
          .then((res) => {
            Notiflix.Report.success("저장되었습니다.","","확인");
            LoadBasic(pageInfo.page);
          })
          .catch((error)=>{
            return error.data && Notiflix.Report.warning("경고",`${error.data.message}`,"확인");
          })
          .catch((err) => {
            Notiflix.Report.failure("경고", err.data.message, "확인");
          })
  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `machineList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 18,
      },

      params: typesState !== null ?
          {
            types:typesState
          }
          :
          {

          }
    })
    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }
    // else if (res.state === 401) {
    //   Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
    //     router.back()
    //   })
    // }

    setSelectList(new Set())

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    // if(!isPaging){
    //   setOptionIndex(option)
    // }
    const res = await RequestMethod('get', `machineSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 18,
      },
      params: typesState !== null ?
          {
            keyword: keyword ?? '',
            opt: option ?? 0,
            types:0
          }
          :
          {
            keyword: keyword ?? '',
            opt: option ?? 0,
          }
    })

    if(res){
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }

    setSelectList(new Set())
  }

  const convertDataToMap = () => {
    const map = new Map()
    basicRow.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return basicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.machine_id){
        haveIdRows.push(row)
      }
    })

    return haveIdRows
  }


  const DeleteBasic = async () => {

    const map = convertDataToMap()
    const selectedRows = filterSelectedRows()
    const haveIdRows = classfyNormalAndHave(selectedRows)
    const filterData = haveIdRows.map((row)=>cleanForRegister(row))
    let deletable = true

    if(haveIdRows.length > 0){
      deletable = await RequestMethod('delete','machineDelete', filterData)
      LoadBasic(1)
      setKeyword('')

    }else{

      selectedRows.forEach((row)=>{map.delete(row.id)})
      setBasicRow(Array.from(map.values()))
      setPageInfo({page: pageInfo.page, total: pageInfo.total})
      setSelectList(new Set())
    }

    if(deletable){
      Notiflix.Report.success('삭제되었습니다.','','확인');
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["machineV2"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
        if(!menu.hide){
          if(menu.colName === column.key){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: !menu.moddable,
              version: menu.version,
              sequence: menu.sequence,
              hide: menu.hide
            }
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

    let additionalMenus = res.menus ? res.menus.map((menu:any) => {
      if(menu.colName === null && !menu.hide){
        return {
          id: menu.mi_id,
          name: menu.title,
          width: menu.width,
          // key: menu.title,
          key: menu.mi_id,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit,
          tab: menu.tab,
          version: menu.version,
          colName: menu.mi_id,
        }
      }
    }).filter((v: any) => v) : []


    tmpRow = res.info_list


    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )

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

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {

      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.mi_id]: v.value
        }
      })

      let random_id = Math.random()*1000;
      return {
        ...row,
        ...appendAdditional,
        type: row.type ? machineList[row.type].name : '선택없음',
        type_id: row.type ? machineList[row.type].pk : 0,
        weldingType: row.weldingType ? weldingType[row.weldingType].name : "선택없음",
        factory_id: row.factory?.name,
        affiliated_id: row.subFactory?.name,
        id: `mold_${random_id}`,
      }
    })
    setBasicRow([...tmpBasicRow])
    // setBasicRow([{ id: "", name: "400톤 2호기", weldingType: '선택없음', type: '프레스', mfrCode: '125-77-123', interwork: '유', user_id: '차지훈', manufacturer:'Aidas'}])
  }

  const searchAiID = (rowAdditional:any[], index:number) => {
    let result:number = undefined;
    rowAdditional.map((addi, i)=>{
      if(index === i){
        result = addi.ai_id;
      }
    })
    return result;
  }
  const cleanForRegister = (value:any) => {
    const tempData = {...value};
    let additional:any[] = []
    column.map((v) => {
      if(v.type === 'additional'){
        additional.push(v)
      }
    })
    let weldingPK = 0;
    weldingType.map((welding)=>{
      if(welding.name === value.weldingType){
        weldingPK = welding.pk;
      }
    })
    tempData.madeAt = value.madeAt ?? moment().format("YYYY-MM-DD")
    tempData.machine_id =  value.machine_idPK ?? value.machine_id;
    tempData.type = value.type_id;
    tempData.manager = value?.user?.user_id ? value.user : value.manager ?? null;
    tempData.factory = value?.factory?.factory_id ? value.factory : null;
    tempData.subFactory = value?.subFactory?.sf_id ? {...value.subFactory, manager:value.subFactory.manager_info} : null;

    // if(value.subFactory !== null && value.subFactory !== undefined && value.subFactory.sf_id !== null){
    //   tempData.subFactory = {...value.subFactory, manager:value.subFactory.manager_info};
    // }else{
    //   tempData.subFactory = null;
    // }
    tempData.weldingType = weldingPK;
    tempData.interwork = value.interworkPK === "true";
    tempData.devices = value?.devices?.map((device) => {
      return {...device, type: device.type_id}
    })
    tempData.photo = value.photo?.uuid ?? value.photo;
    tempData.additional =[
      ...additional.map((v, index)=>{
        if(!value[v.colName]) return undefined;
        return {
          mi_id: v.id,
          title: v.name,
          value: value[v.colName] ?? "",
          unit: v.unit,
          ai_id: searchAiID(value.additional, index) ?? undefined,
          version:value.additional[index]?.version ?? undefined
        }
      }).filter((v) => v)
    ]

    // tempData.device.manager
    return tempData

  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `mold`, "mold", tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        // setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true)
        break;
      case 2:
        router.push(`/mes/item/manage/machine`)
        break;
      case 3:
        let items = {}

        column.map((value) => {
          if(value.selectList && value.selectList.length){
            items = {
              ...value.selectList[0],
              [value.key] : value.selectList[0].name,
              [value.key+'PK'] : value.selectList[0].pk, //여기 봐야됨!
              ...items,
            }
          }
        })

        const random_id = Math.random()*1000

        setBasicRow([
          {
            ...items,
            id: `process_${random_id}`,
            name: null,
            additional: [],
          },
          ...basicRow
        ])
        break;

      case 4:
        SaveBasic()

        break;
      case 5:
        if(selectList.size === 0){
          return Notiflix.Report.warning(
              '경고',
              '선택된 정보가 없습니다.',
              '확인',
          );
        }

        Notiflix.Confirm.show("경고","삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)","확인","취소",
            () => DeleteBasic()
        )
        break;

    }
  }

  const competeMachineV1u = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)

    const isCheck = spliceRow.some((row)=> row.mfrCode === tempRow[selectRow].mfrCode && row.mfrCode !== undefined && row.mfrCode !== '')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
            '제조 번호 경고',
            `중복되는 제조 번호가 존재합니다.`,
            '확인'
        );
      }
    }

    setBasicRow(rows)
  }

  const settingHeight = (length:number) => {
    switch (length){
      case 0:
        return 90
      default :
        return basicRow.length * 40 + 56
    }
  }

  return (
      <div>
        <PageHeader
          isSearch
          searchKeyword={keyword}
          onChangeSearchKeyword={(keyword) => {
            // setKeyword(keyword)
            // setPageInfo({...pageInfo,page:1})
            SearchBasic(keyword, optionIndex, 1).then(() => {
              Notiflix.Loading.remove();
            });
          }}
          searchOptionList={optionList}
          onChangeSearchOption={(option) => {
            setOptionIndex(option)
          }}
          optionIndex={optionIndex}
          title={"기계 기준정보"}
          buttons={
            ['', '', '항목관리', '행추가', '저장하기', '삭제']
          }
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
            editable
            resizable
            resizeSave
            headerList={[
              SelectColumn,
              ...column
            ]}
            row={basicRow}
            // setRow={setBasicRow}
            setRow={(e) => {
              let tmp: Set<any> = selectList
              e.map(v => {
                if(v.isChange) {
                  tmp.add(v.id)
                  v.isChange = false
                }
              })
              setSelectList(tmp)
              competeMachineV1u(e)
            }}
            selectList={selectList}
            //@ts-ignore
            setSelectList={setSelectList}
            setSelectRow={setSelectRow}
            width={1576}
            height={settingHeight(basicRow.length)}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo,page:page})
          }}
        />
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

export {BasicMachineV1u};

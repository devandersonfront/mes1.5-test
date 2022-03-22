import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import PageHeader from '../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType} from '../../../common/@types/type'
import {RequestMethod} from '../../../common/RequestFunctions'
import {columnlist} from "../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {MAX_VALUE} from '../../../common/configset'
import TextEditor from '../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../common/excelDownloadFunction'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../reducer";
import {
  delete_all_machine_list,
  delete_machine_list,
  insert_machine_list,
  insert_machine_list_index
} from "../../../reducer/machineSelect";

const title = '작업지시서 등록'
const optList = ['거래처명', '모델명', 'CODE', '품명', '공정', '기계', 'Lot번호']

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const BasicContainer = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const dispatch = useDispatch();
  const selector = useSelector((state:RootState) => state.MachineSelectReducer);

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", index: 1, date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.operationRegister)
  const [selectList, setSelectList] = useState<Set<any>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(optList)
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [isLoad, setIsLoad] = useState<number>(0)
  const [isGoal, setIsGoal] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  useEffect(() => {
    LoadMenu()
  }, [page, keyword, option])

  useEffect(() => {
    if(basicRow[0].pp_id && basicRow[0].pp_id !== isLoad){
      ProductProcessSearch(basicRow[0].pp_id)
    }
  }, [basicRow])


  useEffect(()=>{
    dispatch(delete_all_machine_list());
  },[])
  const ProductProcessSearch = async (pp_id: number) => {
    const res = await RequestMethod('get', `productprocessList`,{
      path: {
        pp_id
      }
    })

    const recentRes = await RequestMethod('get', `operationRecent`,{
      path: {
        pp_id
      }
    })

    if(res && recentRes) {
      Notiflix.Report.info("",recentRes.message,"확인");
      let tmpRow = [basicRow[0]]

      res.results.processes.map((v, i) => {
        const random_id = Math.random()*1000
        recentRes.results.processes.map((value,i)=>{
          if(value.seq === v.seq){
            v = {...value, ...v}
          }
        })
        if(i === 0){
          tmpRow[0] = {
            ...tmpRow[0],
            ...v,
            process_id: v.process.name,
            process_idPK: v.process.process_id,
            mold: v.mold,
            id: `operation_${random_id}`,
            machine_id:v.machine ? v.machine.name : null,
            machine_idPK:v.machine? v.machine.machine_id : null
          }
        }else{
          tmpRow.push({
            ...v,
            process_id: v.process.name,
            process_idPK: v.process.process_id,
            mold: v.mold_name,
            id: `operation_${random_id}`,
            machine_id:v.machine? v.machine.name : null,
            machine_idPK:v.machine ? v.machine.machine_id : null
          })
        }
      })
      setIsLoad(pp_id)
      setBasicRow([...tmpRow])
      dispatch(insert_machine_list({process_length:tmpRow.length, machineList:tmpRow}))
    }
  }

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList){
        return {
          ...v,
          pk: v.unit_id
        }
      }else{
        return v
      }
    })

    Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
        }
      })])
    })
  }

  const SaveBasic = async () => {

    let processesSetting = [];

    selector.machineList.map((v,i)=>{
      processesSetting.push({...v, process_id:v.process_idPK, machine_id: typeof v.machine_id === "string" ? v.machine_idPK : v.machine_id})
    })
    let res = await RequestMethod('post', `operationSave`,
        {
          operation: {
            date: selector.machineList[0].date,
            customer_id: selector.machineList[0].customer_idPK,
            cm_id: selector.machineList[0].cm_idPK,
            product_id: selector.machineList[0].product_id,
            processes:
             selector.machineList.map((row, i) => {
                          if(selectList.has(row.id)){
                            let additional:any[] = []
                            column.map((v) => {
                              if(v.type === 'additional'){
                                additional.push(v)
                              }
                            })

                            let selectData: any = {}

                            return {
                              ...row,
                              ...selectData,
                              id: row.tmpId,
                              // seq: i+1,
                              authority: row.authorityPK,
                              last: basicRow.length -1 === i ? true : false,
                              machine_id: row.machine_idPK,
                              process_id: row.process_idPK,
                              ln_id: row.ln_idPK,
                              additional: [
                                ...additional.map(v => {
                                  if(row[v.name]) {
                                    return {
                                      id: v.id,
                                      title: v.name,
                                      value: row[v.name],
                                      unit: v.unit
                                    }
                                  }
                                }).filter((v) => v)
                              ]
                            }

                          }
                        }).filter((v) => v)
          }
        })

    if(res){
      if(res.status === 200){
        Notiflix.Report.success('저장되었습니다.','','확인');
      }
    }
  }

  const DeleteBasic = async () => {
    let tmpRow = []
    tmpRow = basicRow.map((v) => {
      if(selectList.has(v.id)){
        return
      }
      return v
    }).filter(v => v).map((v, index) => {
      return {
        ...v,
        seq: index+1,
      }
    })

    if(tmpRow.length > 0 && selectList.size > 0){
      // selector.machineList.splice(selectList, 1);
      dispatch(delete_machine_list());
      Notiflix.Report.success("삭제되었습니다.","","확인");
      setBasicRow([...tmpRow])
    }else{
      Notiflix.Report.warning("1개 이상의 작업이 필요합니다!","","확인");
    }
  }

  const loadLotInfo = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `rawinSearch`,{
      path: {
        page: page,
        renderItem: MAX_VALUE,
        customer_id: basicRow[0].customer_idPK,
        cm_id: basicRow[0].cm_idPK,
        rm_id: basicRow[0].rm_id
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0,
        nz: true
      }
    })

    return (res.results.info_list.length)
  }

  const LoadMenu = async () => {
    const res = await RequestMethod('get', `itemList`,{
      path: {
        tab: 'ROLE_PROD_01'
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
              tab:'ROLE_PROD_01',
              unit:menu.unit,
              moddable: !menu.moddable,
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.mi_id,
              name: menu.title,
              width: menu.width,
              tab:'ROLE_PROD_01',
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
            moddable: !menu.moddable,
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
    excelDownload(column, basicRow, `작업지시서등록`, '작업지시서등록', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        downloadExcel()
        break;
      case 1:
        loadLotInfo().then((lotLength) => {
          Notiflix.Loading.remove()

          if(!selector.machineList[0].product_id){
            Notiflix.Report.failure('저장 실패', '품목을 선택해주세요', '확인', )
            return
          } else if (
            (!selector.machineList[0].goal && selector.machineList[0].goal !== 0)
            ||
            (selector.machineList[0].seq !==1 || !selectList.has(selector.machineList[0].id))
          ) {
            // Notiflix.Report.failure('저장 실패', '목표 생산량을 입력해주세요', '확인', )
            SaveBasic()
            return
          }

          Notiflix.Confirm.show(
              '저장하시겠습니까?',
              `제품 (${selector.machineList[0].code})에 대한 Lot ${lotLength}개가 존재합니다. 입력하신 ${selector.machineList[0].goal}이 맞습니까?`,
              '저장',
              '취소',
              () => {
                SaveBasic()
              },
              () => {
              }
          )
        })

        break;
      case 2:

        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
            ()=>{
              DeleteBasic()
            },
            ()=>{}
        );

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
              buttons={[ '저장하기', '삭제']}
              buttonsOnclick={onClickHeaderButton}
          />
          <ExcelTable
              editable
              resizable
              headerList={[
                SelectColumn,
                ...column
              ]}
              row={selector.machineList}
              // row={basicRow}
              // setRow={setBasicRow}
              setRow={(e) => {
                let tmp: Set<any> = selectList
                e.map(v => {
                  if(v.isChange) tmp.add(v.id)
                })

                let tmpRow = e
                let tmpSelect = selectList

                if(e.length > 1 && e[1].goal && e[1].goal !== isGoal) {
                  setIsGoal(e[1].goal)

                  tmpRow = tmpRow.map((v, i) => {
                    tmpSelect.add(v.id)
                    if(i === 0){
                      return {
                        ...v,
                        goal:Number(e[0].goal)
                      }
                    }else{
                      return {
                        ...v,
                        goal:Number(e[1].goal)
                      }
                    }
                  })

                  setSelectList(tmpSelect)
                }

                setSelectList(tmp)
                setBasicRow([...tmpRow])
                // dispatch(insert_machine_list({...selector, machineList:[...tmpRow]}))
              }}
              setSelectRow={(e)=>{
                dispatch(insert_machine_list_index(e))
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

// BasicContainer.getInitialProps = async ({ query }) => {
//   let { page, keyword, opt } = query
//   if (typeof page === 'string')
//     page = parseInt(page);
//   if (typeof opt === 'string')
//     opt = parseInt(opt);
//   return { page, keyword, option: opt };
// }

export default BasicContainer;

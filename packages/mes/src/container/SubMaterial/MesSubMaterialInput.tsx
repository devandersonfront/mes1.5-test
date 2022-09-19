import React, {useEffect, useState} from 'react'
import {columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { alertMsg } from 'shared/src/common/AlertMsg'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesSubMaterialInput = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "sm"+Math.random()*100, date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["subinV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['거래처명','모델명', 'CODE', '품명', '금형명'])
  const [optionIndex, setOptionIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    getMenus()
    dispatch(setMenuSelectState({main:"부자재 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])


  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_WIP_01'
      }
    })

    if(res){
      let tmpColumn = columnlist["subinV1u"]

      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object | undefined;
        res.bases && res.bases.map((menu: any) => {
          if(menu.colName === column.key){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: menu.moddable,
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: menu.moddable,
            }
          }
        })

        if(menuData){
          return {
            ...column,
            ...menuData,
          }
        }
      }).filter((v:any) => v)

      setColumn([...tmpColumn.map(v=> {
        return {
          ...v,
          name: !v.moddable ? v.name+'(필수)' : v.name
        }
      })])
    }
  }

  const validate = (row) => {
    if(!!!row.sm_id) throw(alertMsg.noSubMaterial)
    if(!!!row.warehousing) throw(alertMsg.noImportAmount)
    if(!!!row.lot_number) throw(alertMsg.noLotNumber)
  }

  const checkDuplicateLotNumber = (lotNumbers: string[]) => {
    if(lotNumbers.length !== new Set(lotNumbers).size) throw (alertMsg.duplicateLotNumber)
  }

  const SaveBasic = async () => {
    try {
      if(selectList.size === 0) throw(alertMsg.noSelectedData)
      const selected = basicRow.filter(row => selectList.has(row.id))
      checkDuplicateLotNumber(selected.map(row => row.lot_number))
      const postBody = selected.map((row, i) => {
        validate(row)
        return {
          ...row,
          current: row.warehousing,
          warehousing: row.warehousing,
          customer: row.customerArray,
        }
      })
      const res = await RequestMethod('post', `lotSmSave`, postBody)

      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => {
          setTimeout(() => {
            router.push("/mes/submaterialV1u/stock")
          }, 300)
        });
      }
    } catch(errMsg){
      Notiflix.Report.warning("경고", errMsg, "확인",)
    }
  }


  const onClickHeaderButton = (index: number) => {
    const randomID = Math.random()*100;
    switch(index){
      case 0:
        setBasicRow([
          {id:`sm${randomID}`, date: moment().format('YYYY-MM-DD')},
          ...basicRow
        ])
        break;
      case 1:
        SaveBasic()
        break;
      case 2:
        if(selectList.size === 0) {
          return  Notiflix.Report.warning("경고",alertMsg.noSelectedData,"확인" )
        }
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인", "취소", () => {
          const tmpRow = basicRow.filter(({id}, index) => !selectList.has(id))
          setBasicRow(tmpRow);
        })

        break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"부자재 입고 등록"}
        buttons={
          ['행추가', '저장하기', '삭제']
        }
        buttonsOnclick={
          // () => {}
          onClickHeaderButton
        }
      />
      <ExcelTable
        editable
        resizable
        selectable
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
          setBasicRow(e.map((v) => {
            return {
              ...v,
              name: v.subName
            }
          }))
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />
      {/*<ExcelDownloadModal*/}
      {/*  isOpen={excelOpen}*/}
      {/*  column={column}*/}
      {/*  basicRow={basicRow}*/}
      {/*  filename={`금형기준정보`}*/}
      {/*  sheetname={`금형기준정보`}*/}
      {/*  selectList={selectList}*/}
      {/*  tab={'ROLE_BASE_07'}*/}
      {/*  setIsOpen={setExcelOpen}*/}
      {/*/>*/}
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

export {MesSubMaterialInput};

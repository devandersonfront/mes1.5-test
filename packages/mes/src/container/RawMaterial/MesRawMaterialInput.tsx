import React, {useEffect, useState} from 'react'
import {columnlist, ExcelDownloadModal, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesRawMaterialInput = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    id: "", date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawinV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  useEffect(() => {
    getMenus()
  }, [])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_RMAT_01'
      }
    })

    if(res){
      let tmpColumn = columnlist["rawinV1u"]

      tmpColumn = tmpColumn.map((column: any) => {
        let menuData: object | undefined;
        res.bases && res.bases.map((menu: any) => {
          if(menu.colName === column.key){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
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
            ...menuData,
          }
        }
      }).filter((v:any) => v)

      setColumn([...tmpColumn])
    }
  }

  const SaveBasic = async () => {
    if(selectList.size <= 0) {
      return Notiflix.Report.warning("경고", "데이터를 선택해 주시기 바랍니다.", "확인",)
    }

    basicRow.map((v)=> {
      if(selectList.has(v.id)) {
        if (v.rm_id === undefined) {
          return Notiflix.Report.warning("경고", "원자재 CODE를 선택해 주시기 바랍니다.", "확인",)
        }
        if (v.lot_number === undefined) {
          return Notiflix.Report.warning("경고", "원자재 LOT 번호를 입력해 주시기 바랍니다.", "확인",)
        }
      }
    })

    let res: any
    res = await RequestMethod('post', `lotRmSave`,
      basicRow.map((row, i) => {
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

              if(v === 'tmpId') {
                selectData = {
                  ...selectData,
                  id: row['tmpId']
                }
              }
            })
            return {
              ...row,
              ...selectData,
              warehousing: row.amount,
              type: row.type_id,
              raw_material: {...row.raw_material, type:row.raw_material?.type_id},
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
        }).filter((v) => v))
      .catch((error) => {
        if(error.status === 409){
         Notiflix.Report.warning('경고',error.data.message,'확인')
          return false
        }
        return false
      })


    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => {
        router.push("/mes/rawmaterialV1u/stock")
      });
    }
  }


  const onClickHeaderButton = (index: number) => {
    const randomID = Math.random()*100;
    switch(index){
      case 0:
        setBasicRow([
          {id:`rm${randomID}`, date: moment().format('YYYY-MM-DD')},
          ...basicRow
        ])
        break;
      case 1:
        SaveBasic()
        break;
      case 2:
        if(selectList.size === 0) {
          return  Notiflix.Report.warning("경고","삭제할 행을 선택해주세요.","확인" )
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
        title={"원자재 입고 등록"}
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
        // resizable
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
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />
      <ExcelDownloadModal
        isOpen={excelOpen}
        column={column}
        basicRow={basicRow}
        filename={`금형기준정보`}
        sheetname={`금형기준정보`}
        selectList={selectList}
        tab={'ROLE_BASE_07'}
        setIsOpen={setExcelOpen}
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

export {MesRawMaterialInput};

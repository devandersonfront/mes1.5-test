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

const MesOrderRegister = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["orderRegister"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    getMenus()
    Notiflix.Loading.remove()
  }, [])

  useEffect(() => {
  }, [basicRow])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_SALES_01'
      }
    })

    if(res){
      let tmpColumn = columnlist["orderRegister"]

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
              moddable:menu.moddable
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable:menu.moddable
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

  const SaveBasic = async () => {
    let res: any
    let checkValue = true;

    if(selectList.size <= 0) {
      Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
      return
    }
    basicRow.map((row) => {
      if(selectList.has(row.id) && !row.code){
        Notiflix.Report.warning("경고","CODE를 입력해주세요.","확인")
        return
      }
    })
    // else{
    //   basicRow.map((row) => {
    //     if(!Number(row.amount) && row.amount !== "0"){
    //       Notiflix.Report.warning("경고", "정확한 수주량을 입력해주세요.", "확인", )
    //       checkValue = false;
    //       return;
    //     }
    //   })
    // }

    if(!checkValue) return

    res = await RequestMethod('post', `contractSave`,
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
          })

          return {
            ...row,
            ...selectData,
            customer: row.customerArray,
            amount: row.amount ?? 0,
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


    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => {
        router.push('/mes/order/list')
      });
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        let random_id = Math.random()*1000;
        setBasicRow([
          {
            name: "", id: "order"+random_id, date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD')
          },
          ...basicRow
        ])
        break;
      case 1:
        SaveBasic()

        break;
      case 2:
        if(selectList.size <= 0){
          Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
        }else{
          Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
            ()=>{
              const filter = basicRow.filter((row, index) => !selectList.has(row.id))
              setBasicRow([...filter])
              setSelectList(new Set())
            },
            ()=>{}
          )
        }
        break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"수주 정보 등록"}
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
          setBasicRow(e.map((v, index) => ({
            ...v,
            name: v.product_name,
            date:v?.date ?? basicRow[index]?.date,
            deadline:v?.deadline ?? basicRow[index]?.deadline,
            amount:v?.amount ?? basicRow[index]?.amount
          })))
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

export {MesOrderRegister};

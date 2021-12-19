import React, {useEffect, useState} from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  columnlist,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType, RequestMethod,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'

interface IProps {
  page?: number
  keyword?: string
  option?: number
}

const MesOperationRegister = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    id: "", date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD')
  }])
  const [isFirst, setIsFirst] = useState<boolean>(true)
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationRegisterV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    console.log('basicRow', basicRow)
  }, [basicRow])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_PROD_01'
      }
    })

    if(res){
      console.log(res)
      let tmpColumn = columnlist["operationRegisterV2"]

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
    let res: any
    res = await RequestMethod('post', `sheetSave`,
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
            input_bom: row.input ?? [],
            status: 1,
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
        router.push('/mes/operationV1u/list')
      });

    }
  }

  const loadLatestSheet = async (product_id: string) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetLatestList`,{
      path: { product_id }
    })

    if(res){
      console.log(res)
      setBasicRow([{
        bom_root_id: res.product.bom_root_id,
        contract: res.contract,
        contract_id: res.contract?.identification ?? "-",
        date: res.date,
        deadline: res.deadline,
        customer: res.product.customer?.name,
        model: res.product.model?.model,
        code: res.product.code,
        product: res.product,
        product_name: res.product.name,
        type: res.product.type ? TransferCodeToValue(res.product.type, 'material') : '',
        unit: res.product.unit,
        process: res.product.process?.name,
        goal: res.goal
      }])
    }

    setIsFirst(false)
  }

  const loadGraphSheet = async (product_id: string) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetGraphList`,{
      path: { product_id }
    })

    if(res){
      setBasicRow([{
        ...basicRow[0],
        goal: 0,
      }, ...res.map(v => {
        if(v.type === 2){
          return {
            ...v,
            product: v.child_product,
            date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD'),
            customer: v.child_product.customer?.name,
            model: v.child_product.model?.model,
            product_name: v.child_product.name,
            code: v.child_product.code,
            type: TransferCodeToValue(v.type, 'material'),
            unit: v.child_product.unit,
            process: v.child_product.process?.name,
            readonly: true,
          }
        }
      }).filter(v => v)])
    }

    setIsFirst(false)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        // console.log(basicRow)
        if(basicRow[0].product.product_id){
          loadGraphSheet(basicRow[0].product.product_id)
        }
        break;
      case 1:
        const randomId = Math.random()*1000;
        setBasicRow([
          {
            id:"operation_"+randomId,
            date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD')
          },
          ...basicRow
        ])
        break;
      case 2:
        SaveBasic()
        break;
      case 3:
        Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
          ()=>{},
          ()=>{}
        )
        break;
    }
  }

  useEffect(() => {
    getMenus()
    Notiflix.Loading.remove()
  }, [])

  return (
    <div>
      <PageHeader
        title={"작업지시서 등록"}
        buttons={
          ['BOM 기준으로 보기', '행추가', '저장하기', '삭제']
        }
        buttonsOnclick={
          // () => {}
          onClickHeaderButton
        }
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
            // if(v.product?.product_id && isFirst) loadLatestSheet(v.product.product_id)
          })
          setSelectList(tmp)
          setBasicRow([...e])
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
        filename={`금형기본정보`}
        sheetname={`금형기본정보`}
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

export {MesOperationRegister};

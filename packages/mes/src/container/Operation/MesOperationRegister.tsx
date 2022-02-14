import React, {useEffect, useState} from 'react'
import lodash from "lodash";
import {
  columnlist,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  RequestMethod,
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

  // const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    id: `operation_${Math.random()*1000}`, date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD'),first:true
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationRegisterV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_PROD_01'
      }
    })

    if(res){
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

  const SaveBasic = async (result:any, selectList:Set<any>) => {
    // if(selectList){
    //   return Notiflix.Report.warning("저장할 ","관리자에게 문의하세요.", "확인");
    // }
    let res: any
    res = await RequestMethod('post', `sheetSave`,
        result.map((row, i) => {
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
              os_id:undefined,
              // input_bom: /*row?.input ??*/ [...row?.input_bom?.map((bom)=>{
              //   // return {
              //   //   ...bom,
              //   //   setting:bom.setting === "여" || bom.setting === 1 ? 1 : 0
              //   // }
              //   bom.bom.setting = bom.bom.setting === "여" || bom.bom.setting === 1 ? 1 : 0
              //   return {...bom}
              // })] ?? [],
              input_bom : [...row?.input_bom?.filter((bom)=> bom.bom.setting > 0)],
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

  const loadLatestSheet = async (product_id: string, object?: any) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `sheetLatestList`,{
      path: { product_id }
    })
    let resultData = [];
    if(res){
      setSelectList(new Set())
      Notiflix.Report.success("알림","최근 작업지시서를 불러왔습니다.","확인")
      let row:any = [];
      if(typeof res === 'string'){
        let tmpRowArray = res.split('\n')

        row = tmpRowArray.map(v => {
          if(v !== ""){
            let tmp = JSON.parse(v)
            return tmp
          }
        }).filter(v=>v)
        resultData = [...row.map((data, index) => {
          let random_id = Math.random()*1000;
          return index === 0 ?
              {
                ...object,
                bom_root_id: data.product?.bom_root_id,
                id: "operation_"+random_id,
                date: data?.date ?? moment().format("YYYY-MM-DD"),
                deadline: data?.deadline ?? moment().format("YYYY-MM-DD"),
                name:data.product?.name,
                model:data.product?.model,
                cm_id: data.product?.model.model,
                code:data.product?.code,
                product_id:data.product?.code,
                process_id:data.product?.process?.name ?? "-",
                goal: data.goal,
              }
              :
              {
                contract_id:"-",
                date: data?.data === undefined ? moment().format("YYYY-MM-DD") : data.date,
                deadline: data?.deadline === undefined ? moment().format("YYYY-MM-DD") : data.deadline,
                customer:data.product?.customer ?? "-",
                customer_id: data.product?.customer.name ?? "-",
                model:data.product?.model,
                cm_id: data.product?.model.model,
                product_id: data.product?.code,
                type:data.product?.type === 0 ? "반제품" : data.product.type === 1 ? "재공품" :"완제품" ,
                type_id:data.product?.type,
                unit: data.product?.unit,
                bom_root_id: data.product?.bom_root_id,
                id: "operation_"+random_id,
                name:data.product?.name,
                process_id:data.product?.process?.name ?? "-",
                goal: data.goal,
              }
        })]
      } else{
        let random_id = Math.random()*1000;
        resultData = [
          {
            ...res,
            first:true,
            // contract_id:res.identification,
            contract_id:res.contract?.identification ?? "-",
            date: res?.data === undefined ? moment().format("YYYY-MM-DD") : res.date,
            deadline: res?.deadline === undefined ? moment().format("YYYY-MM-DD") : res.deadline,
            customer:res.product.customer,
            customer_id: res.product.customer?.name,
            model:res.product.model,
            cm_id: res.product.model.model,
            product_id: res.product.code,
            type:res.product.type === 0 ? "반제품" : res.product.type === 1 ? "재공품" :"완제품" ,
            type_id:res.product.type,
            unit: res.product.unit,
            bom_root_id: res.product?.bom_root_id,
            id: "operation_"+random_id,
            name:res.product?.name,
            process_id:res.product?.process?.name ?? "-",
          }
        ]
      }
      return resultData;
      // setBasicRow([
      //     // ...basicRow,
      //   {
      //     id: "operation_"+random_id,
      //     bom_root_id: row.product?.bom_root_id,
      //     ...object,
      //     name:row.product?.name,
      //     process_id:row.product?.process?.name ?? "-",
      //     // contract: res.contract,
      //     // contract_id: res.contract?.identification ?? "-",
      //     // date: res.date,
      //     // deadline: res.deadline,
      //     // customer_id: res.product.customer?.name,
      //     // cm_id: res.product.model?.model,
      //     // product_id: res.product.code,
      //     // name: res.product.name ?? '-',
      //     // product: res.product,
      //     // product_name: res.product.name,
      //     // type: res.product.type ? TransferCodeToValue(res.product.type, 'material') : '',
      //     // unit: res.product.unit,
      //     // process_id: res.product.process?.name ?? '-',
      //     goal: row.goal,
      //   }
      // ])
      // return resultData;
    }else{
      return loadGraphSheet(product_id, object)
    }
  }

  const loadGraphSheet = async (product_id: string, object?: any) => {
    Notiflix.Loading.circle()
    const res=  await RequestMethod('get', `sheetGraphList`,{
      path: { product_id }
    })
    if(res){
      let tmp: Set<any> = selectList
      // setBasicRow([{
      //   ...object,
      //   goal: 0,
      // }, ...res.map(v => {
      //   if(v.type === 2){
      //     let random_id = Math.random()*1000;
      //
      //     tmp.add("operation_"+random_id)
      //
      //     return {
      //       ...v,
      //       id: "operation_"+random_id,
      //       bom_root_id: v.child_product.bom_root_id,
      //       product: v.child_product,
      //       date: moment().format('YYYY-MM-DD'),
      //       deadline: moment().format('YYYY-MM-DD'),
      //       customer_id: v.child_product.customer?.name,
      //       cm_id: v.child_product.model?.model,
      //       name: v.child_product.name,
      //       product_id: v.child_product.code,
      //       code: v.child_product.code,
      //       type: TransferCodeToValue(v.type, 'product'),
      //       unit: v.child_product.unit,
      //       process_id: v.child_product.process?.name ?? '-',
      //       readonly: true,
      //     }
      //   }
      // }).filter(v => v)])
      setSelectList(new Set())
      Notiflix.Report.warning("알림","최근 작업지시서가 없어 BOM기준으로 불러왔습니다.","확인")
      return [{
        ...object,
        goal: 0,
        name: object.product_name,
        date: object?.date ?? moment().format('YYYY-MM-DD'),
        deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
      }, ...res.map(v => {
        if(v.type === 2){
          let random_id = Math.random()*1000;
          tmp.add("operation_"+random_id)

          return {
            ...v,
            id: "operation_"+random_id,
            bom_root_id: v.child_product.bom_root_id,
            product: v.child_product,
            date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD'),
            customer_id: v.child_product.customer?.name,
            cm_id: v.child_product.model?.model,
            name: v.child_product.name ?? v.product_name,
            product_id: v.child_product.code,
            code: v.child_product.code,
            type: TransferCodeToValue(v.type, 'product'),
            unit: v.child_product.unit,
            process_id: v.child_product.process?.name ?? '-',
            readonly: true,
          }
        }
      }).filter(v => v)]
      // setSelectList(tmp)


    }
  }

  const onClickHeaderButton = async(index: number) => {
    switch(index){
      case 0:
        if(selectList.size === 1) {
          if (basicRow[0].product.product_id) {
            const data = await loadGraphSheet(basicRow[0].product.product_id, basicRow[0]).then(value => value)
            setBasicRow(data);
          }
        }else{
          Notiflix.Report.warning("경고","한개의 데이터만 선택해 주시기 바랍니다.","확인");
        }
        break;
        // case 1:
        //   const randomId = Math.random()*1000;
        //   setBasicRow([
        //     {
        //       id:"operation_"+randomId,
        //       date: moment().format('YYYY-MM-DD'),
        //       deadline: moment().format('YYYY-MM-DD')
        //     },
        //     ...basicRow
        //   ])
        //   break;
      case 2:
        SaveBasic(basicRow, selectList)
        break;
      case 3:
        if(selectList.size > 0) {
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
              () => {

                Notiflix.Report.success("삭제되었습니다.", "", "확인", () => {
                  const resultBasic = [...basicRow];
                  resultBasic.forEach((row, index) => {
                    if (selectList.has(row.id)) {
                      basicRow.splice(index, 1)
                    }
                  })
                  setBasicRow([...basicRow])
                })
              },
          )
        }else{
          Notiflix.Report.warning("경고","데이터를 선택해 주시기 바랍니다.","확인");
        }
        break;
    }
  }

  useEffect(() => {
    getMenus()
  }, [])

  return (
      <div>
        <PageHeader
            title={"작업지시서 등록"}
            buttons={['BOM 기준으로 보기', '', '저장하기', '삭제']}
            buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
            editable
            // resizable
            headerList={[
              SelectColumn,
              ...column
            ]}
            row={basicRow}
            setRow={async(e) => {
              const eData = e.filter((eValue) => {
                let equal = false;
                basicRow.map((bValue)=>{
                  if(eValue.product?.product_id === bValue.product?.product_id){
                    equal = true
                  }
                })
                if(basicRow[0].product == undefined) return "first"
                if(!equal) return eValue
              })
              if(eData.length <= 0){
                setSelectList(new Set());
                setBasicRow([...e])
              }else{
                setSelectList(new Set());
                const resultData = await loadLatestSheet(e[0]?.product?.product_id, e[0]).then((value) => value)
                // const resultData = await loadGraphSheet(e[0].product.product_id, e[0]).then((value) => value)
                setBasicRow([...resultData])
              }
              let tmp: Set<any> = selectList;
              setSelectList(tmp)
            }}
            selectList={selectList}
            setSelectList={(select) => {
              //@ts-ignore
              setSelectList(select)
            }}
            height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
        />
        {/*<ExcelDownloadModal*/}
        {/*  isOpen={excelOpen}*/}
        {/*  column={column}*/}
        {/*  basicRow={basicRow}*/}
        {/*  filename={`금형기본정보`}*/}
        {/*  sheetname={`금형기본정보`}*/}
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

export {MesOperationRegister};

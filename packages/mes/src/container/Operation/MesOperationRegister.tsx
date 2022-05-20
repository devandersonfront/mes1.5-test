import React, {useEffect, useState} from 'react'
import lodash from "lodash";
import {
  columnlist,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  RequestMethod, RootState,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch, useSelector} from "react-redux";
import {SearchModalResult, SearchResultSort} from "shared/src/Functions/SearchResultSort";
import {delete_operation_searchKey} from "shared/src/reducer/operationRegisterState";
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";
import {NoneSelectedValidation, RequiredValidation, NoAmountValidation} from "shared/src/validations/Validation";

interface IProps {
  page?: number
  keyword?: string
  option?: number
}

const MesOperationRegister = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch();
  const receiveKey = useSelector((root:RootState) => root.OperationRegisterState);
  //처음인지 확인하는 state 하나 필요
  const [firstCheck, setFirstCheck] = useState<boolean>(true)
  const [codeCheck, setCodeCheck] = useState<boolean>(true)
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    id: `operation_${Math.random()*1000}`, date: moment().format('YYYY-MM-DD'),
    deadline: moment().format('YYYY-MM-DD'),first:true
  }])



  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["operationCodeRegisterV2"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_PROD_01'
      }
    })

    if(res){
      let tmpColumn = codeCheck ?  columnlist["operationCodeRegisterV2"] : columnlist['operationIdentificationRegisterV2']

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
        if(v.name === '수주 번호' && !codeCheck){
          return {
            ...v,
            name:  v.name+'(필수)'
          }
        }else if(v.name === 'CODE' && codeCheck){
          return {
            ...v,
            name: v.name+'(필수)'
          }
        }else {
          return {
            ...v,
            name: !v.moddable ? v.name+'(필수)' : v.name
          }
        }
      })])
    }
  }

  const validateSaveRequest = (selectedData: any[]) => {
    return NoneSelectedValidation(selectedData) ||
    RequiredValidation('product_id', selectedData,"CODE OR 수주번호를 선택해주세요.") ||
    RequiredValidation('input_bom', selectedData,"자재 보기를 눌러 BOM 등록을 해주세요.") ||
    NoAmountValidation('goal', selectedData, "목표 생산량을 입력해 주세요.")
  }

  const SaveBasic = async (selectedData: any[]) => {
    if(validateSaveRequest(selectedData)) return
    let res: any
    res = await RequestMethod('post', `sheetSave`,
      selectedData.map((row, i) => {
        let selectKey: string[] = []
        column.map((v) => {
          if (v.selectList) {
            selectKey.push(v.key)
          }
        })
        let selectData: any = {}

        Object.keys(row).map(v => {
          if (v.indexOf('PK') !== -1) {
            selectData = {
              ...selectData,
              [v.split('PK')[0]]: row[v]
            }
          }

        })
        return {
          ...row,
          ...selectData,
          contract: selectedData[0].contract,
          os_id: undefined,
          version: undefined,
          input_bom: [ ...row?.input_bom?.map((bom) => {
            bom.bom.setting = bom.bom.setting === "여" || bom.bom.setting === 1 ? 1 : 0
            return { ...bom }
          }) ] ?? [],
          status: 1,
        }
      }))
    if (res) {
      Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
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
                contract_id:"-",
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
                goal: 0,
              }
        })]
      } else{
        let random_id = Math.random()*1000;
        resultData = [
          {
            ...res,
            first:true,
            contract_id: "-",
            code: res.product.code,
            date: res?.data === undefined ? moment().format("YYYY-MM-DD") : res.date,
            deadline: res?.deadline === undefined ? moment().format("YYYY-MM-DD") : res.deadline,
            customer:res.product.customer,
            customer_id: res.product.customer?.name,
            model:res.product.model,
            cm_id: res.product.model?.model ?? '-',
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
      setSelectList(new Set())
      // if(codeCheck) {
      //   Notiflix.Report.warning("알림", "최근 작업지시서가 없어 BOM기준으로 불러왔습니다.", "확인")
      // }
      return [{
        ...object,
        contract_id: codeCheck ? "-" : object.contract_id,
        goal: codeCheck ? 0 : object.contract.amount,
        cm_id: object.cm_id ?? '-',
        process_id: object.product?.process?.name ?? '-',
        name: object.product_name ?? '-',
        date: object?.date ?? moment().format('YYYY-MM-DD'),
        deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
        first:true,
      }, ...res.map(v => {
        if(v.type === 2){
          let random_id = Math.random()*1000;
          tmp.add("operation_"+random_id)

          return {
            ...v,
            contract_id: codeCheck ? "-" : object.contract_id,
            id: "operation_"+random_id,
            bom_root_id: v.child_product.bom_root_id,
            product: v.child_product,
            date: object?.date ?? moment().format('YYYY-MM-DD'),
            deadline: object?.deadline ?? moment().format('YYYY-MM-DD'),
            customer_id: v.child_product.customer?.name,
            cm_id: v.child_product.model?.model,
            name: v.child_product.name ?? v.product_name,
            product_id: v.child_product.code,
            code: v.child_product.code,
            type: TransferCodeToValue(v.child_product.type, 'product'),
            unit: v.child_product.unit,
            goal:  codeCheck ? 0 : object.contract.amount,
            process_id: v.child_product.process?.name ?? '-',
            readonly: true,
          }
        }
      }).filter(v => v)

      ]
    }
  }

  const onClickHeaderButton = async(index: number) => {
    switch(index){
      case 0:
        break;
      case 2:
        SaveBasic(basicRow.filter(row => selectList.has(row.id)))
        break;
      case 3:
        if(selectList.size > 0) {
          Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
              () => {
                  const resultBasic = [...basicRow];
                  const result = resultBasic.filter((row, index) => {
                    if (!selectList.has(row.id)) {
                      return row
                    }
                  })
                  result[0].first = true
                  setBasicRow([...result])

                Notiflix.Report.success("삭제되었습니다.", "", "확인", () => {
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
    if(receiveKey.searchKey !== "" && firstCheck){
      setColumn(columnlist["operationIdentificationRegisterV2"])
      RequestMethod("get", "contractSearch", {
        params:{
          keyword:receiveKey.searchKey,
          opt:0
        }
      })
          .then(async(res) => {
            const identification = res.info_list[0].identification
            const goal = res.info_list[0].amount
            await loadGraphSheet(res.info_list[0]?.productId,  SearchModalResult(SearchResultSort(res.info_list, "contract")[0], "receiveContract"))
                .then((res) => {
                  setBasicRow(res.map((row, index) => {
                      return {...row, contract_id:identification, goal}
                  }))
                  setCodeCheck(false)
                  setFirstCheck(false)
                })

          })
    }else{
      getMenus()
      setFirstCheck(false)
    }
  }, [codeCheck])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"생산관리 등록",sub:router.pathname}))
    return(() => {
      dispatch(delete_operation_searchKey())
      dispatch(deleteSelectMenuState())
    })
  },[])

  return (
      <div>
        <PageHeader
            isCode
            onChangeCode={(value)=> {
              setCodeCheck(value),
              setBasicRow([{
                id: `operation_${Math.random()*1000}`, date: basicRow[0].date?? moment().format('YYYY-MM-DD'),
                deadline: basicRow[0].deadline?? moment().format('YYYY-MM-DD'), first:true
              }])
            }}
            code={codeCheck}
            title={"작업지시서 등록"}
            buttons={['', '', '저장하기', '삭제']}
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
                setBasicRow([...e])
              }else{
                // if(codeCheck) {
                //   const resultData = await loadLatestSheet(e[0]?.product?.product_id, e[0]).then((value) => value)
                //   setBasicRow([...resultData])
                // }else{
                const resultData = await loadGraphSheet(e[0]?.product?.product_id, e[0]).then((value) => value)
                if(resultData === undefined) setBasicRow([{
                  id: `operation_${Math.random()*1000}`, date: e[0].date ?? moment().format('YYYY-MM-DD'),
                  deadline: e[0].deadline ?? moment().format('YYYY-MM-DD'),first:true
                }])
                else setBasicRow([...resultData])
                // }
              }
              let tmp: Set<any> = selectList;
              e.map(v => {
                if(v.isChange) {
                  tmp.add(v.id)
                  v.isChange = false
                }
              })
              // setSelectList(tmp)
              setSelectList(tmp)
            }}
            selectList={selectList}
            //@ts-ignore
            setSelectList={setSelectList}
            width={1576}
            height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
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

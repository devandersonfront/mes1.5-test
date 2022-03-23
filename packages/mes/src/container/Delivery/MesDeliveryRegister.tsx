import React, {useEffect, useState} from 'react'
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, RootState} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from "react-redux";
import {delete_delivery_identification} from "../../../../shared/src/reducer/deliveryRegisterState";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesDeliveryRegister = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const orderIdentificationId = useSelector((root:RootState) => root.deliveryRegisterState)

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    date: moment().format('YYYY-MM-DD'),
    // limit_date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["deliveryIdentificationRegister"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [codeCheck, setCodeCheck] = useState<boolean>(false)

  useEffect(() => {
    getMenus().then((res) => {
      if(res && orderIdentificationId.identification !== ""){
        RequestMethod("get", "contractSearch", {
          path:{
            page:1,
            renderItem:22
          },
          params:{
            keyword:orderIdentificationId.identification,
            opt:0
          }
        })
            .then((res) => {
              setBasicRow([{
                ...basicRow[0],
                date: res.info_list[0].deadline,
                contract_id: res.info_list[0].identification,
                product:res.info_list[0].product,
                contract: res.info_list[0],
                // product_id: res.info_list[0].product.product_id,
                customer_id: res.info_list[0].product.customer?.name,
                name: res.info_list[0].product.name,
                product_name: res.info_list[0].product.name,
                cm_id: res.info_list[0].product.model?.model,
                product_id: res.info_list[0].product.code,
                type: TransferCodeToValue(res.info_list[0].product.type, "product"),
                unit: res.info_list[0].product.unit,
                version: res.info_list[0].product.version
              }])
            })
      }
    })

    Notiflix.Loading.remove()
    return () => {
      dispatch(delete_delivery_identification());
    }
  }, [codeCheck])

  const getMenus = async () => {
    let res = await RequestMethod('get', `loadMenu`, {
      path: {
        tab: 'ROLE_SALES_03'
      }
    })

    if(res){
      let tmpColumn = codeCheck ? columnlist["deliveryCodeRegister"] : columnlist['deliveryIdentificationRegister']
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
              moddable: menu.moddable
            }
          } else if(menu.colName === 'id' && column.key === 'tmpId'){
            menuData = {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              tab:menu.tab,
              unit:menu.unit,
              moddable: menu.moddable
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
      return true
    }else {
      return false
    }
  }

  const SaveBasic = async () => {
    let data = basicRow.map((row, i) => {
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
          lots: row.lot_number,
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

    let truthyAmount = data.findIndex((v) => !v.amount) === -1

    if(truthyAmount){
      let res = await RequestMethod('post', `shipmentSave`,data)

      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => {
          router.push('/mes/delivery/list')
        });
      }
    }else{
      Notiflix.Report.warning('납품 수량을 선택해 주세요.', '', '확인')
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        let random_id = Math.random()*1000;
        setBasicRow([
          {
            name: "", id: `delivery${random_id}`, date: moment().format('YYYY-MM-DD'),
            deadline: moment().format('YYYY-MM-DD')
          },
          ...basicRow
        ])
        break;
      case 1:
        if(selectList.size <= 0){
          Notiflix.Report.warning("경고","데이터를 선택해주세요.","확인")
        }else{
          SaveBasic()
        }

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
            isCode
            code={codeCheck}
            onChangeCode={(value)=> {
              setCodeCheck(value)
              setBasicRow([{
                date: moment().format('YYYY-MM-DD'),
              }])
              setSelectList(new Set())
              setColumn(value ? columnlist.deliveryCodeRegister : columnlist.deliveryIdentificationRegister)
            }}
            title={"납품 정보 등록"}
            buttons={
              [ '행추가', '저장하기', '삭제']
            }
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
            // setRow={setBasicRow}
            setRow={(e) => {
              let tmp: Set<number> = selectList
              let tmpRow = e.map((v,i) => {
                if(v.product_id){
                  let index = e.findIndex((row) => row.product_id == v.product_id)
                  if(index !== -1 && index == i){
                    tmp.add(v.id)
                    return true
                  }else{
                    Notiflix.Report.warning("동시에 같은품목을 두개이상 등록할 수 없습니다.", "", "확인")
                    return false
                  }
                }
              })
              setSelectList(tmp)
              if(tmpRow.indexOf(false) !== -1){
                setBasicRow([...basicRow])
              }else{
                setBasicRow([...e.map(v => ({...v, name: v.product_name}))])
              }
            }}
            selectList={selectList}
            //@ts-ignore
            setSelectList={setSelectList}
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

export {MesDeliveryRegister};

import React, {useEffect, useState} from 'react'
import {ExcelTable} from 'shared/src/components/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import {Header as PageHeader} from 'shared/src/components/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'

import {columnlist} from 'shared/src/common/columnInit'
import {HeaderButton} from '../../../../styles/styledComponents'
import ItemManageBox from '../../../../component/ItemManage/ItemManageBox'
//@ts-ignore
import Notiflix from "notiflix";
import {IExcelHeaderType, IItemMenuType, RequestMethod, RootState} from 'shared'
import { useRouter } from 'next/router'
import cookie from 'react-cookies'

interface IProps {
  title: string
  type: string
  code: string
  placeholder:string
  isAdditional?:boolean
}

export const getServerSideProps = async (ctx: any) => {

  const changeTitle = (type: string) => {
    switch(type) {
      case 'member':
        return {
          title: '유저',
          code: 'ROLE_HR_02',
          placeholder: 'member',
          additional: true
        }
      case 'customer':
        return {
          title: '거래처 정보',
          code: 'ROLE_BASE_01',
          placeholder: 'customer',
          additional: true
        }
      case 'process':
        return {
          title: '공정 종류',
          code: 'ROLE_BASE_02',
          placeholder: 'process',
          additional: true
        }
      case 'machine':
        return {
          title: '기계 기준정보',
          code: 'ROLE_BASE_04',
          placeholder: 'machineV2',
          additional: true
        }
      case 'product':
        return {
          title: '제품',
          code: 'ROLE_BASE_15',
          placeholder: 'productV1u',
          additional: true
        }
      case 'rawmaterial':
        return {
          title: '원자재 기준정보',
          code: 'ROLE_BASE_06',
          placeholder: 'rawMaterial',
          additional: true
        }
      case 'submaterial':
        return {
          title: '부자재 기준정보',
          code: 'ROLE_BASE_13',
          placeholder: 'subMaterial',
          additional: true
        }
      case 'mold':
        return {
          title: '금형 기준정보',
          code: 'ROLE_BASE_07',
          placeholder: 'mold',
          additional: true
        }
      case 'model':
        return {
          title: "거래처 모델정보",
          code: 'ROLE_BASE_08',
          placeholder: 'model',
          additional: true
        }
      case 'factory' :
        return {
          title:"공장 기준정보",
          code: "ROLE_BASE_11",
          placeholder: 'factory',
          additional: true
        }
      case 'rawin':
        return {
          title: "원자재 입고 관리",
          code: 'ROLE_RMAT_01',
          placeholder: 'rawinV1u'
        }
      case 'rawstock':
        return {
          title: "원자재 재고",
          code: 'ROLE_RMAT_02',
          placeholder: 'rawinV1u'
        }
      case 'operation' :
        return {
          title: "작업지시서 리스트",
          code: "ROLE_PROD_02",
          placeholder: 'rawinV1u'
        }
      case 'stock' :
        return {
          title:"재고현황",
          code:"ROLE_STK_01",
          placeholder: 'stock'
        }
      case "device":
        return {
          title: "주변장치",
          code:"ROLE_BASE_12",
          placeholder: 'device',
          additional: true
        }
      case "tool" :
        return {
          title: "공구",
          code: "ROLE_BASE_14",
          placeholder: 'toolRegister'
        }
      case "order" :
        return {
          title: "수주 현황",
          code: "ROLE_SALES_02",
          placeholder: 'orderList'
        }
      case "delivery" :
        return {
          title: "납품 현황",
          code: "ROLE_SALES_04",
          placeholder: 'deliveryList'
        }
      case "operationV1u" :
        return {
          title: "작업지시서",
          code: "ROLE_PROD_02",
          placeholder: 'operationListV2'
        }
      case "recordV2" :
        return {
          title: "작업일보",
          code: "ROLE_PROD_08",
          placeholder: 'cncRecordListV2'
        }
        case "aiRecord" :
        return {
          title: "AI 작업일보",
          code: "ROLE_PROD_08",
          placeholder: 'aiRecordListV2'
        }
      case "finishV2":
        return {
          title: "작업완료",
          code: "ROLE_PROD_06",
          placeholder: 'finishListV2'
        }
      case "rawInputlist":
        return {
          title: "원자재 입고",
          code: "ROLE_RMAT_02",
          placeholder: 'rawstockV1u'
        }
      case "rawExportList":
        return {
          title: "원자재 출고",
          code: "ROLE_RMAT_03",
          placeholder: 'rawstockExport'
        }
      case "subStockList":
        return {
          title: "부자재 재고",
          code: "ROLE_WIP_02",
          placeholder: 'substockV1u'
        }
      case "subExportList":
        return {
          title: "부자재 출고",
          code: "ROLE_WIP_03",
          placeholder: 'substockExport'
        }
      case "warehousingList":
        return {
          title: "공구 입고",
          code: "ROLE_TOOL_02",
          placeholder: 'toolList'
        }
      case "toolList":
        return {
          title: "공구 입고",
          code: "ROLE_BASE_14",
          placeholder: 'toolList'
        }
      case "outOrderList":
        return {
          title: "외주 발주 현황",
          code: "ROLE_OUTS_01",
          placeholder: 'outsourcingOrderList'
        }
      case "outImportList":
        return {
          title: "외주 입고 현황",
          code: "ROLE_OUTS_02",
          placeholder: 'outsourcingImportList'
        }
      case "outsourcingDeliveryList":
        return {
          title: "외주 출고 현황",
          code: "ROLE_OUTS_03",
          placeholder: 'outsourcingDeliveryList'
        }
    }
  }

  const tempObject = changeTitle(ctx.query.type)

  return {
    props: {
      title: tempObject ? tempObject.title : "",
      code: tempObject ? tempObject.code : "",
      placeholder:tempObject ? tempObject.placeholder : "",
      type: ctx.query.type,
      isAdditional: tempObject?.additional ?? false
    }
  }
}


const ItemManagePage = ({title, type, code, placeholder, isAdditional}: IProps) => {
  const router = useRouter();
  const [item, setItem] = useState<IItemMenuType[]>([])
  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set())
  const [selectRow , setSelectRow] = useState<number>(0);
  let userInfo = cookie.load('userInfo')

  const checkValidation = () => {
    return userInfo.ca_id.name === 'MASTER' ?? undefined
  }

  const itemSetting = (columns:any[]) => {
    const originalColumn = columnlist[placeholder]
    const result = columns.map((col, index) => {
      if(col.colName == null){
        col.placeholder = "추가 항목"
        col.sequence = index
      }else{

        originalColumn.map((origin,) => {
          if(col.colName == origin.key) {
            col.placeholder = origin.name
            col.sequence = index
          }
        })
      }
      return col
    })
    setItem(result)
  }

  const listItem = async (code: string) => {
    const res =  await RequestMethod('get', 'itemList', {
      path: {
        tab: code
      }
    })
    if(res){
      const results = res

      let baseList = results.bases.map((row) => {
        return {...row, id:row.mi_id}
      })
      let addiList = results.additional.map((value, index)=>{
        const randomID = Math.random()*100;
        return {...value, id:"addi_"+randomID};
      })

      Notiflix.Loading.remove(300)

      itemSetting(baseList.concat(addiList).sort((a,b) => a.sequence - b.sequence).map((col, index) =>{
        return {...col, sequence:index}
      }))
    }
  }

  const saveItem = async (code: string, items: IItemMenuType[]) => {
    try{
      const postBody = items.map((item,index)=> {
        if(!item.placeholder && !item.title?.length) {
          throw("항목명을 입력해주세요.")
        }
        return {...item, sequence:index, title:item.title?.length > 0 ? item.title : item.placeholder}
      })

      const res =  await RequestMethod(
          'post', 'itemSave',
          postBody,
          undefined , undefined ,undefined, code
      )

      if(res !== null || res !== undefined) {
        listItem(code)
        setSelectList(new Set())
        Notiflix.Report.success(
            '성공',
            '저장되었습니다.',
            '확인',
        );
      }
    }catch(err){
      console.log(err)
      Notiflix.Report.warning("경고",err,"확인",)
    }
  }

  const convertDataToMap = () => {
    const map = new Map()
    item.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    const items = item.map((row : any)=> {
      if(selectList.has(row.id) && (row.colName !== null && row.colName !== undefined)) {
        throw("기존 항목은 삭제할 수 없습니다.")
      }else if(row.colName !== null){
        return
      }
      else return selectList.has(row.id) && row
    }).filter(v => v)
    return items
  }


  const deleteItem = async () => {
    if(selectList.size === 0) throw("선택된 정보가 없습니다.")
    Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
        async() => {
          try{
            const map = convertDataToMap()
            const selectedRows = filterSelectedRows()
            await RequestMethod('delete','itemDelete', selectedRows,)
                .then(() => Notiflix.Report.success('삭제되었습니다.', '', '확인'))

            selectList.forEach((row) => {
              map.delete(row)
            })
            // selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})
            setItem(Array.from(map.values()))
            // listItem(code)
            setSelectList(new Set())

          }catch(err){
            Notiflix.Report.warning('경고', err, '확인',)
          }
        }
    )
  }

  useEffect(() => {
    Notiflix.Loading.circle();
    listItem(code)
    if(checkValidation()){

    }else{
      Notiflix.Report.failure(
          '권한 오류',
          '관리자만 항목관리가 가능합니다.',
          '확인', () => {
            router.back()
          }
      )
    }
  }, [])


  const competeAddtion = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)
    const isCheck = spliceRow.some((row)=> row?.title === tempRow[selectRow]?.title && row?.title !== undefined && row?.title !== '')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
            '경고',
            `중복된 추가 항목명을 입력할 수 없습니다`,
            '확인'
        );
      }
    }

    setItem(rows)
  }


  return (
      <div style={{display: 'flex', }}>
        <MenuNavigation/>
        <div>
          <ProfileHeader/>
          <PageHeader
              title={`${title} 항목관리`}
          />
          <div style={{width: 1570}}>
            <div style={{marginBottom: 16, display: 'flex', justifyContent: 'flex-end'}}>
              {/*<HeaderButton onClick={() => {*/}
              {/*}} key={`btnCreate`}>초기화</HeaderButton>*/}
              {isAdditional &&
                    <HeaderButton onClick={() => {
                      const random_id = Math.random() * 1000;
                      setItem([...item, {
                        id: `addi_${random_id}`,
                        width: 118,
                        sequence: item.length,
                        tab: item[0].tab
                      }])
                    }} key={`btnCreate`}>행 추가</HeaderButton>
              }
              <HeaderButton onClick={() => saveItem(code, item)} key={`btnCreate`}>저장</HeaderButton>
              {isAdditional &&
                <HeaderButton onClick={deleteItem} key={`btnCreate`}>삭제</HeaderButton>
              }
            </div>
            <ItemManageBox title={title} items={item} setItems={setItem} type={'base'}/>
            <ExcelTable
                headerList={
                  isAdditional ?
                  [SelectColumn,...columnlist.baseItem(item, setItem)]
                      :
                  columnlist.baseItem(item, setItem)
                }
                setRow={(e) => competeAddtion(e)}
                row={item}
                height={500}
                selectList={selectList}
                setSelectList={setSelectList}
            />
          </div>
        </div>
      </div>
  );
}

export default ItemManagePage;

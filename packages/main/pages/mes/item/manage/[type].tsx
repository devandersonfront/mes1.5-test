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
}

export const getServerSideProps = async (ctx: any) => {

  const changeTitle = (type: string) => {
    switch(type) {
      case 'member':
        return {
          title: '유저 관리',
          code: 'ROLE_HR_02',
          placeholder: 'member'
        }
      case 'customer':
        return {
          title: '거래처 정보 관리',
          code: 'ROLE_BASE_01',
          placeholder: 'customer'
        }
      case 'process':
        return {
          title: '공정 관리',
          code: 'ROLE_BASE_02',
          placeholder: 'process'
        }
      case 'machine':
        return {
          title: '기계 기준정보',
          code: 'ROLE_BASE_04',
          placeholder: 'machineV2'
        }
      case 'product':
        return {
          title: '제품 등록 관리',
          code: 'ROLE_BASE_15',
          placeholder: 'productV1u'
        }
      case 'rawmaterial':
        return {
          title: '원자재 기준정보',
          code: 'ROLE_BASE_06',
          placeholder: 'rawMaterial'
        }
      case 'submaterial':
        return {
          title: '부자재 기준정보',
          code: 'ROLE_BASE_13',
          placeholder: 'subMaterial'
        }
      case 'mold':
        return {
          title: '금형 기준정보',
          code: 'ROLE_BASE_07',
          placeholder: 'mold'
        }
      case 'model':
        return {
          title: "거래처 모델정보",
          code: 'ROLE_BASE_08',
          placeholder: 'model'
        }
      case 'factory' :
        return {
          title:"공장 기준정보",
          code: "ROLE_BASE_11",
          placeholder: 'factory'
        }
      case 'rawin':
        return {
          title: "원자재 입고 관리",
          code: 'ROLE_RMAT_01',
          placeholder: 'rawinV1u'
        }
      case 'rawstock':
        return {
          title: "원자재 재고 관리",
          code: 'ROLE_RMAT_02'
        }
      case 'operation' :
        return {
          title: "작업지시서 리스트",
          code: "ROLE_PROD_02"
        }
      case 'delivery' :
        return {
          title: "납품 관리",
          code: "ROLE_SHPT_01"
        }
      case 'stock' :
        return {
          title:"재고현황",
          code:"ROLE_STK_01"
        }
      case "device":
        return {
          title: "주변창지 정보관리",
          code:"ROLE_BASE_12"
        }
      case "tool" :
        return {
          title: "공구 관리",
          code: "ROLE_BASE_14"
        }
    }
  }

  const tempObject = changeTitle(ctx.query.type)

  return {
    props: {
      title: tempObject ? tempObject.title : "",
      code: tempObject ? tempObject.code : "",
      placeholder:tempObject ? tempObject.placeholder : "",
      type: ctx.query.type
    }
  }
}


const ItemManagePage = ({title, type, code, placeholder}: IProps) => {
  const router = useRouter();
  const [item, setItem] = useState<IItemMenuType[]>([])
  // const [baseItem, setBaseItem] = useState<IItemMenuType[]>([])
  // const [addiItem, setAddiItem] = useState<IItemMenuType[]>([])
  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set())
  const [selectRow , setSelectRow] = useState<number>(0);
  let userInfo = cookie.load('userInfo')

  const checkValidation = () => {
    return userInfo.ca_id.name === 'MASTER' ?? undefined
  }

  const itemSetting = (columns:any[]) => {
    const originalColumn = columnlist[placeholder]
    console.log("originalColumn : ", originalColumn)
    const result = columns.map((col) => {
      if(col.colName == null){
        col.placeholder = "추가 항목"
      }else{
        originalColumn.map((origin, index) => {
          if(col.colName == origin.key) {
            console.log("origin.name : ", origin.name, index)
            col.placeholder = origin.name
            return
          }
        })
      }
      return col
    })

    console.log("result : ", result)
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

      let baseList = results.bases
      let addiList = results.additional.map((value)=>{
        const randomID = Math.random()*100;
        return {...value, id:"addi_"+randomID};
      })

      Notiflix.Loading.remove(300)

      itemSetting(baseList.concat(addiList).sort((a,b) => a.sequence - b.sequence))
    }
  }

  const saveItem = async (code: string, items: IItemMenuType[]) => {
    console.log("items : ", items)
    const res =  await RequestMethod(
        'post', 'itemSave',
        items.map((item,index)=>({...item, sequence : index, title:item.title.length > 0  ? item.title : item.placeholder})),
        undefined , undefined ,undefined, code
    )
    if(res !== null || res !== undefined) {
      listItem(code)
      Notiflix.Report.success(
          '성공',
          '저장되었습니다.',
          'Okay',
      );
    }
  }

  const convertDataToMap = () => {
    const map = new Map()
    item.map((v)=>map.set(v.id , v))
    return map
  }

  const filterSelectedRows = () => {
    return item.map((row : any)=> selectList.has(row.id) && row).filter(v => v)
  }

  const classfyNormalAndHave = (selectedRows) => {

    const normalRows = []
    const haveIdRows = []

    selectedRows.map((row : any)=>{
      if(row.mi_id){
        haveIdRows.push(row)
      }else{
        normalRows.push(row)
      }
    })

    return [normalRows , haveIdRows]
  }

  const deleteItem = async (code: string, items: IItemMenuType[]) => {
    if(selectList.size === 0){
      return Notiflix.Report.warning(
          '경고',
          '선택된 정보가 없습니다.',
          '확인',
      );
    }

    Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
        async() => {
          const map = convertDataToMap()
          const selectedRows = filterSelectedRows()
          const [normalRows , haveIdRows] = classfyNormalAndHave(selectedRows)

          if(haveIdRows.length > 0){

            if(normalRows.length !== 0) selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})
            await RequestMethod('delete','itemDelete', haveIdRows.map((row,index)=>({...row, seq : index})))
          }

          Notiflix.Report.success('삭제되었습니다.','','확인');
          selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})
          setItem(Array.from(map.values()))
          setSelectList(new Set())
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
      <div style={{display: 'flex', height: 1500}}>
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
              <HeaderButton onClick={() => saveItem(code, item)} key={`btnCreate`}>저장</HeaderButton>
              <HeaderButton onClick={() => {
                const random_id = Math.random() * 1000;
                setItem([...item, {
                  id: `addi_${random_id}`,
                  width: 118,
                  sequence:item.length,
                  tab:item[0].tab
                }])
              }} key={`btnCreate`}>행 추가</HeaderButton>
              <HeaderButton onClick={() => deleteItem(code, item)} key={`btnCreate`}>삭제</HeaderButton>
            </div>
            <ItemManageBox title={title} items={item} setItems={setItem} type={'base'}/>
            <ExcelTable
                headerList={[SelectColumn,...columnlist.baseItem(item, setItem)]}
                setRow={(e) => competeAddtion(e)}
                row={item}
                height={240}
                // setRow={setItem}
            />
            {/*<ItemManageBox title={title} items={baseItem} setItems={setBaseItem} type={'base'}/>*/}
            {/*<ExcelTable*/}
            {/*    headerList={[...columnlist.baseItem(baseItem, setBaseItem)]}*/}
            {/*    row={baseItem}*/}
            {/*    height={240}*/}
            {/*    setRow={setBaseItem}*/}
            {/*/>*/}
            {/*<br/><br/>*/}
            {/*{code !== "ROLE_STK_01" &&*/}
            {/*<>*/}
            {/*  <div style={{marginBottom: 16, display: 'flex', justifyContent: 'flex-end'}}>*/}
            {/*    <HeaderButton onClick={() => {*/}

            {/*      const existence = valueExistence()*/}

            {/*      if(!existence){*/}
            {/*        const resultArray = [];*/}
            {/*        baseItem.map((value)=>{*/}
            {/*          resultArray.push({...value})*/}
            {/*        })*/}
            {/*        addiItem.map((value)=>{*/}
            {/*          resultArray.push({...value, unit:value.unit_id ?? value.unit, moddable: value.moddablePK === "1" ? false : true})*/}
            {/*        })*/}
            {/*        saveItem(code, resultArray, 'additional')*/}
            {/*      }else{*/}
            {/*        return Notiflix.Report.warning(*/}
            {/*            '경고',*/}
            {/*            `"${existence}"을 입력 해주세요`,*/}
            {/*            '확인',*/}
            {/*        );*/}
            {/*      }*/}
            {/*    }} key={`btnCreate`}>추가항목 저장</HeaderButton>*/}
            {/*    <HeaderButton onClick={() => {*/}
            {/*      const random_id = Math.random() * 1000;*/}
            {/*      setAddiItem([...addiItem, {*/}
            {/*        id: `addi_${random_id}`,*/}
            {/*        width: 118,*/}
            {/*        sequence:baseItem.length,*/}
            {/*        tab:baseItem[0].tab*/}
            {/*      }])*/}
            {/*    }} key={`btnCreate`}>행 추가</HeaderButton>*/}
            {/*    <HeaderButton onClick={() => deleteItem(code, addiItem)} key={`btnCreate`}>삭제</HeaderButton>*/}
            {/*  </div>*/}
            {/*  <ItemManageBox title={title} items={addiItem} setItems={setAddiItem} type={'additional'}/>*/}
            {/*  <ExcelTable*/}
            {/*      selectable*/}
            {/*      headerList={[SelectColumn,...columnlist.additionalItem(addiItem, setAddiItem)]}*/}
            {/*      row={addiItem}*/}

            {/*      height={240}*/}
            {/*      setRow={(e) => competeAddtion(e)}*/}
            {/*      setSelectRow={(e) => {*/}
            {/*        setSelectRow(e)*/}
            {/*      }}*/}
            {/*      setSelectList={(e) => {*/}
            {/*        setSelectList(e)*/}
            {/*      }}*/}
            {/*  />*/}
            {/*</>*/}
            {/*}*/}
          </div>
        </div>
      </div>
  );
}

export default ItemManagePage;

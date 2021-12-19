import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import PageHeader from '../../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../../common/@types/type'
import {RequestMethod} from '../../../../common/RequestFunctions'
import {columnlist} from '../../../../common/columnInit'
import {HeaderButton, ItemListTableHeader, ItemListTableWrapper, ItemWrapper} from '../../../../styles/styledComponents'
import ItemManageBox from '../../../../component/ItemManage/ItemManageBox'
//@ts-ignore
import Notiflix from "notiflix";
import {useSelector} from "react-redux";
import {RootState} from "../../../../reducer";

interface IProps {
  children?: any
  title: string
  user: any
  type: string
  code: string
  row?: Array<any>
  column?: IExcelHeaderType[]
}

export const getServerSideProps = async (ctx: any) => {

  const changeTitle = (type: string) => {
    switch(type) {
      case 'member':
        return {
          title: '유저 관리',
          code: 'ROLE_HR_02'
        }
      case 'customer':
        return {
          title: '고객사 정보 관리',
          code: 'ROLE_BASE_01'
        }
      case 'process':
        return {
          title: '공정 관리',
          code: 'ROLE_BASE_02'
        }
      case 'machine':
        return {
          title: '기계 기본정보',
          code: 'ROLE_BASE_04'
        }
      case 'product':
        return {
          title: '제품 등록 관리',
          code: 'ROLE_BASE_05'
        }
      case 'rawmaterial':
        return {
          title: '원자재 기본정보',
          code: 'ROLE_BASE_06'
        }
      case 'submaterial':
        return {
          title: '부자재 기본정보',
          code: 'ROLE_BASE_13'
        }
      case 'mold':
        return {
          title: '금형 기본정보',
          code: 'ROLE_BASE_07'
        }
      case 'model':
        return {
          title: "고객사 모델정보",
          code: 'ROLE_BASE_08'
        }
      case 'factory' :
        return {
          title:"공장 기본정보",
          code: "ROLE_BASE_11"
        }
      case 'rawin':
        return {
          title: "원자재 입고 관리",
          code: 'ROLE_RMAT_01'
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
    }
  }

  const tempObject = changeTitle(ctx.query.type)

  return {
    props: {
      title: tempObject ? tempObject.title : "",
      code: tempObject ? tempObject.code : "",
      type: ctx.query.type
    }
  }
}

let unitData = [
  {unit_id: '0', name: "개별관리"},
  {unit_id: '1', name: "통일"},
  {unit_id: '2', name: "없음"},
]

const ItemManagePage = ({title, type, code}: IProps) => {
  const [baseItem, setBaseItem] = useState<IItemMenuType[]>([])
  const [addiItem, setAddiItem] = useState<IItemMenuType[]>([])
  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set())

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

      setBaseItem(baseList)
      setAddiItem(addiList)
      // setAddiItem(addiList.map((v: any, i: number) => {
      //   const random_id = Math.random() * 1000
      //
      //   return {
      //     ...v,
      //     unit: unitData[v.unit_id].name,
      //     unit_id: unitData[v.unit_id].unit_id,
      //     unitPK: unitData[v.unit_id].unit_id,
      //     id: random_id
      //   }
      // }))
    }
  }

  const saveItem = async (code: string, items: IItemMenuType[], type?: 'additional') => {
    const res =  await RequestMethod('post', 'itemSave',items
        // {
        //   tab: code,
        //   menus: type ? items.map(v => {
        //     if(v.title){
        //       return {
        //         ...v,
        //         unit: v['unitPK'],
        //       }
        //     }
        //   }).filter(v => v) : items,
        // }
        ,undefined , undefined ,code)
    if(res !== null || res !== undefined) {
      listItem(code)
      Notiflix.Notify.success("저장되었습니다.")
    }
  }

  const deleteItem = async (code: string, items: IItemMenuType[]) => {
    let idList:IItemMenuType[] = [];
    const spliceArray:number[] = [];
    items.map((v,i)=> {
      if(selectList.has(v.id as number)){
        spliceArray.push(i);
        idList.push(v)
      }
    })

    idList = idList.filter(value => value);

    const tmpPauseBasicRow = [...items];
    spliceArray.reverse();
    spliceArray.map((value, index)=>{
      tmpPauseBasicRow.splice(value, 1);
    })

    if(idList.length > 0) {
      const res = await RequestMethod('delete', 'itemDelete',
          // {
          //         tab: code,
          //         menus: idList
          //       }
          idList
      )

      if (res) {
        Notiflix.Report.success("삭제되었습니다.", "", "확인");
      }

    }else{
      Notiflix.Report.success("삭제되었습니다.", "", "확인");
    }

    setAddiItem([...tmpPauseBasicRow]);

    // type ? items.map(v => {
    //   if(selectList.has(v.id as number)) {
    //     return v.mi_id
    //   }
    // }).filter(v => v) : type


  }

  useEffect(() => {
    listItem(code)
  }, [])

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
            <HeaderButton onClick={() => saveItem(code, baseItem)} key={`btnCreate`}>저장</HeaderButton>
          </div>
          <ItemManageBox title={title} items={baseItem} setItems={setBaseItem} type={'base'}/>
          <ExcelTable
            headerList={columnlist.baseItem}
            row={baseItem}
            height={240}
            setRow={setBaseItem}
          />
          <br/><br/>
          {code !== "ROLE_STK_01" &&
              <>
                <div style={{marginBottom: 16, display: 'flex', justifyContent: 'flex-end'}}>
                  <HeaderButton onClick={() => {
                    const resultArray = [];
                    baseItem.map((value)=>{
                      resultArray.push({...value})
                    })
                    addiItem.map((value)=>{
                      resultArray.push({...value, unit:value.unit_id ?? value.unit, moddable: value.moddablePK === "1" ? false : true})
                    })
                    saveItem(code, resultArray, 'additional')
                  }} key={`btnCreate`}>추가항목 저장</HeaderButton>
                  <HeaderButton onClick={() => {
                    const random_id = Math.random() * 1000;
                    setAddiItem([...addiItem, {
                      id: `item_${random_id}`,
                      width: 118,
                      sequence:baseItem.length,
                      tab:baseItem[0].tab
                    }])

                  }} key={`btnCreate`}>행 추가</HeaderButton>
                  <HeaderButton onClick={() => deleteItem(code, addiItem)} key={`btnCreate`}>삭제</HeaderButton>
                </div>
                <ItemManageBox title={title} items={addiItem} setItems={setAddiItem} type={'additional'}/>
                <ExcelTable
                  headerList={[
                    SelectColumn,
                    ...columnlist.additionalItem
                  ]}
                  row={addiItem}
                  height={240}
                  setRow={setAddiItem}
                  selectList={selectList}
                  setSelectList={setSelectList}
                />
              </>
          }
        </div>
      </div>
    </div>
  );
}

export default ItemManagePage;

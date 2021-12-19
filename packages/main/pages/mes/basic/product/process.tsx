import React, {useEffect, useState} from 'react'
import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import PageHeader from '../../../../component/Header/Header'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {IExcelHeaderType, IItemMenuType} from '../../../../common/@types/type'
import {RequestMethod} from '../../../../common/RequestFunctions'
import {columnlist} from "../../../../common/columnInit";
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {changeCodeInfo, MAX_VALUE} from '../../../../common/configset'
import DropDownEditor from '../../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'

interface IProps {
  children?: any
  title: string
  optList: string[]
}

const title = '제품 등록 관리'

const BasicContainer = () => {
  const router = useRouter()

  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: ""
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.productprocess)
  const [selectList, setSelectList] = useState<Set<any>>(new Set())

  useEffect(() => {
    if(router.query.product_data){
      if(router.query.pp_id) {
        LoadBasic().then(() => {
          Notiflix.Loading.remove()
        })
      }else{
        loadAllSelectItems(column).then((column) => {

          const productData = JSON.parse(decodeURI(router.query.product_data as string))

          setBasicRow(new Array(50).fill(null).map((v: any, index) => {
            let tmpData = {}
            if (index === 0) {

              tmpData = {
                customer: productData.customer_id,
                model: productData.cm_id,
                code: productData.code,
                name: productData.name,
                texture: productData.texture,
              }
            }

            const random_id = Math.random()*1000

            return {
              ...tmpData,
              seq: index + 1,
              id: `productprocess_${random_id}`
            }
          }))
        })
      }
    }
  }, [router.query])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){

        let tmpKey = v.key

        if(tmpKey === 'process_id'){
          tmpKey = 'process'
        }

        const res = await RequestMethod('get', `${tmpKey}List`,{
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          }
        })

        return {
          ...v,
          selectList: [...res.results.info_list.map((value: any) => {
            return {
              ...value,
              name: tmpKey === 'model' ? value.model : value.name,
              pk: value.ca_id
            }
          })]
        }
      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id
          }
        }else{
          return v
        }
      }
    })

   return Promise.all(tmpColumn).then(res => {
      setColumn([...res.map(v=> {
        return {
          ...v,
          name: v.moddable ? v.name+'(필수)' : v.name
        }
      })])
      return res
    })
  }

  const SaveBasic = async () => {
    let tmpRow = basicRow
    let tmpIndex = -1
    if(basicRow.length){
      basicRow.map((v, index) => {
        if(v.last === '최종 공정'){
          tmpIndex = index
        }
      })

      tmpRow.splice(tmpIndex+1, basicRow.length-tmpIndex)
    }

    let res = await RequestMethod('post', `productprocessSave`,
      {
        product_id: Number(router.query.product_id),
        pp_id: router.query.pp_id ?? undefined,
        processes: tmpRow.map((row, i) => {
         return {
           ...row,
           mold_name: row.mold_name ?? undefined,
           process_id: row.process_idPK,
           last: row.lastPK
         }
        }).filter((v) => v)
      })

    if(res){
      if(res.status === 200){
        Notiflix.Report.success('저장되었습니다.','','확인',);

        cleanUpData(res)
      }
    }
  }

  const DeleteBasic = async () => {
    const res = await RequestMethod('delete', `productDelete`,
      {
        machines: basicRow.map((row, i) => {
          if(selectList.has(row.id)){
            return row.machine_id
          }
        }).filter((v) => v)
      })

    if(res) {
      if(res.status === 200){
        LoadBasic().then(() => {
          Notiflix.Loading.remove()
        })
      }
    }
  }

  const LoadBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `productprocessList`,{
      path: {pp_id: router.query.pp_id}
    })

    if(res && res.status === 200){
      cleanUpData(res)
    }else if (res.state === 401) {
      Notiflix.Report.failure('불러올 수 없습니다.', '권한이 없습니다.', '확인', () => {
        router.back()
      })
    }
  }

  const cleanUpData = (res: any) => {
    let tmpRow = []

    loadAllSelectItems(column)

    let additionalMenus = res.results.menus ? res.results.menus.map((menu:any) => {
      if(menu.colName === null){
        return {
          id: menu.id,
          name: menu.title,
          width: menu.width,
          key: menu.title,
          editor: TextEditor,
          type: 'additional',
          unit: menu.unit
        }
      }
    }).filter((v: any) => v) : []

    tmpRow = res.results.processes

    let additionalData: any[] = []

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
      }
    })

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let appendAdditional: any = {}

      row.additional && row.additional.map((v: any) => {
        appendAdditional = {
          ...appendAdditional,
          [v.title]: v.value
        }
      })

      if(index === 0){
        appendAdditional = {
          ...appendAdditional,
          customer: res.results.product.raw_material.model.customer.name,
          model: res.results.product.raw_material.model.model,
          code: res.results.product.raw_material.code,
          name: res.results.product.raw_material.name,
          texture: res.results.product.raw_material.texture
        }
      }

      const random_id = Math.random()*1000

      return {
        ...row,
        process_id: row.process.name,
        process_idPK: row.process.process_id,
        last: row.last ? '최종 공정' : '-',
        lastPK: row.last,
        ...appendAdditional,
        id: `productprocess_${random_id}`,
      }
    })


    setBasicRow([...tmpBasicRow])
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `생산공정등록`, '생산공정등록', tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        downloadExcel()
        break;
      case 1:
        SaveBasic()
        break;
      case 2:
        break;
    }
  }

  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'BASIC'}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <PageHeader
          title={title}
          buttons={['', '저장하기']}
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
          setRow={(e) => {
            let tmpList: Set<any> = selectList
            e.map(v => {
              if(v.isChange) tmpList.add(v.id)
            })
            setSelectList(tmpList)

            let lastIndex = 50
            let notExist = false
            let tmp: any[] = e.map((v, index) => {
              if(v.lastPK){
                lastIndex = index
              }

              if(e.length-1 === index && lastIndex === 50){
                notExist = true
              }

              if(lastIndex < index){
                return
              }else{
                return v
              }
            }).filter(v => v)

            if(notExist) {
              let newArray = new Array(50 - tmp.length).fill({seq: 0}).map((v, index) => {
                const random_id = Math.random()*1000
                return {
                  seq: e[e.length-1].seq+1+index,
                  id: `productprocess_${random_id}`
                }
              })
              tmp = [...tmp, ...newArray]
            }
            setBasicRow([...tmp])
          }}

          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
        />
      </div>
    </div>
  );
}



export default BasicContainer;

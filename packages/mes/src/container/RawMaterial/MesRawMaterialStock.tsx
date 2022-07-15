import React, {useEffect, useState} from 'react'
import {
  BarcodeModal,
  columnlist,
  excelDownload,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  setModifyInitData,
  TextEditor
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch} from 'react-redux'
import {deleteSelectMenuState, setSelectMenuStateChange} from "shared/src/reducer/menuSelectState";
import { settingHeight } from 'shared/src/common/Util';
import {BarcodeDataType} from "shared/src/common/barcodeType";
import {QuantityModal} from "shared/src/components/Modal/QuantityModal";

interface IProps {
  children?: any
  page?: number
  search?: string
  option?: number
}

type ModalType = {
  type : 'barcode' | 'quantity'
  isVisible : boolean
}

const MesRawMaterialStock = ({page, search, option}: IProps) => {
  const router = useRouter()

  const dispatch = useDispatch()

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionList, setOptionList] = useState<string[]>(['원자재 CODE', '원자재 품명', '재질', '원자재 LOT 번호', '거래처'])
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  // const [first, setFirst] = useState<boolean>(true);


  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });
  const [nzState, setNzState] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  const [expState, setExpState] = useState<boolean>(false);
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })

  const changeNzState = (value:boolean) => {
    setSelectList(new Set)
    setNzState(value);
  }

  const changeExpState = (value:boolean) => {
    setSelectList(new Set)
    setExpState(value);
  }

  const changeOrder = (value:number) => {
    setSelectList(new Set)
    setOrder(value);
    setPageInfo({page:1,total:1})
  }

  const loadPage = (page:number) => {
    // if(keyword){
    //   SearchBasic(keyword, optionIndex, page).then(() => {
    //     Notiflix.Loading.remove()
    //   })
    // }else{
    //   LoadBasic(page).then(() => {
    //     Notiflix.Loading.remove()
    //   })
    // }
    if (keyword) {
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove();
      });
    } else {
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove();
      });
    }
  }

  useEffect(() => {
    loadPage(pageInfo.page)
  }, [pageInfo.page, selectDate])

  useEffect(() => {
    dispatch(setSelectMenuStateChange({main:"원자재 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteSelectMenuState())
    })
  },[])

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if(v.selectList && v.selectList.length === 0){
        let tmpKey = v.key

        let res: any
        res = await RequestMethod('get', `${tmpKey}List`,{
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          }
        })


        let pk = "";

        res.results.info_list && res.results.info_list.length && Object.keys(res.results.info_list[0]).map((v) => {
          if(v.indexOf('_id') !== -1){
            pk = v
          }
        })
        return {
          ...v,
          selectList: [...res.results.info_list.map((value: any) => {
            return {
              ...value,
              name: tmpKey === 'model' ? value.model : value.name,
              pk: value[pk]
            }
          })]
        }

      }else{
        if(v.selectList){
          return {
            ...v,
            pk: v.unit_id,
            result: changeOrder
          }
        }else{
          return v
        }
      }
    })

    // if(type !== 'productprocess'){
    Promise.all(tmpColumn).then(res => {
      setColumn([...res])
    })
    // }
  }


  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `rawInList`,{
      path: {
        page: (page || page !== 0) ? page : 1,
        renderItem: 22,
      },
      params:
          order == 0 ?
          {
            exp: expState,
            nz:nzState,
            completed: nzState,
            from:selectDate.from,
            to:selectDate.to
          }
          :
          {
            sorts: 'date',
            order: order == 1 ? 'ASC' : 'DESC',
            exp: expState,
            nz:nzState,
            completed: nzState,
            from:selectDate.from,
            to:selectDate.to
          }
    })

    if(res){
      // setFirst(false);
      setPageInfo({
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }

  }

  const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
    Notiflix.Loading.circle()
    // if(!isPaging){
    //   setOptionIndex(option)
    // }
    const res = await RequestMethod('get', `rawInListSearch`,{
      path: {
        page: isPaging ?? 1,
        renderItem: 22,
      },
      params:
          order == 0 ?
              {
                exp: expState,
                nz:nzState,
                completed:nzState,
                from:selectDate.from,
                to:selectDate.to,
                keyword: keyword ?? '',
                opt: option ?? 0,
              }
              :
              {
                sorts: 'date',
                order: order == 1 ? 'ASC' : 'DESC',
                exp: expState,
                nz:nzState,
                completed:nzState,
                from:selectDate.from,
                to:selectDate.to,
                keyword: keyword ?? '',
                opt: option ?? 0,
              }
    })

    if(res){
      setPageInfo({
        page: res.page,
        total: res.totalPages
      })
      cleanUpData(res)
    }
  }

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["rawstockV1u"];
    let tmpRow = []
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
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
          ...menuData
        }
      }
    }).filter((v:any) => v)

    let additionalMenus = res.menus ? res.menus.map((menu:any) => {
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


    if(pageInfo.page > 1){
      tmpRow = [...basicRow,...res.info_list]
    }else{
      tmpRow = res.info_list
    }


    loadAllSelectItems( [
      ...tmpColumn,
      ...additionalMenus
    ] )


    let selectKey = ""
    let additionalData: any[] = []
    tmpColumn.map((v: any) => {
      if(v.selectList){
        selectKey = v.key
      }
    })

    additionalMenus.map((v: any) => {
      if(v.type === 'additional'){
        additionalData.push(v.key)
      }
    })

    let pk = "";
    Object.keys(tmpRow).map((v) => {
      if(v.indexOf('_id') !== -1){
        pk = v
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

      let random_id = Math.random()*1000;
      return {
        ...row,
        code : row.raw_material.rm_id,
        rm_id: row.raw_material.code,
        name: row.raw_material.name,
        texture: row.raw_material.texture,
        depth: row.raw_material.depth,
        width: row.raw_material.width,
        height: row.raw_material.height,
        type: TransferCodeToValue(row.raw_material.type, 'rawMaterialType'),
        customer_id: row.raw_material?.customer?.name ?? "-",
        expiration: row.raw_material.expiration,
        exhaustion: row.current ? '-' : '사용완료',
        current: row.is_complete? 0 : row.current,
        realCurrent: row.current,
        ...appendAdditional,
        id: `rawin_${random_id}`,
        onClickEvent: (row) =>  row.is_complete ? SaveBasic(row)
          : Notiflix.Confirm.show(`재고 수량이 '0'으로 변경됩니다. 진행 하시겠습니까?`, '*사용완료 처리된 자재는 작업이력 수정 시 수정불가해집니다.', '예','아니오', () => SaveBasic(row), ()=>{},
            {width: '400px'})
      }
    })
    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }

  async function SaveBasic(row: any) {
    let res: any
    res = await RequestMethod('post', `lotRmComplete`,{...row, current: row.realCurrent, is_complete: !row.is_complete})
      .catch((error) => {
        if(error.status === 409){
          Notiflix.Report.warning("경고", error.data.message, "확인",)
          return true
        }
        return false
      })

    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => {
        loadPage(1)
      });
    }
  }

  const DeleteBasic = async () => {

    const res = await RequestMethod('delete', `rawinDelete`,
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

          return {
            ...row,
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

    if(res) {
      Notiflix.Report.success('삭제되었습니다.','','확인', () => {
        loadPage(1)
        setSelectList(new Set)
      });
    }

  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, `mold`, "mold", tmpSelectList)
  }

  const onClickHeaderButton = (index: number) => {
    const noneSelected = selectList.size <= 0
    if(noneSelected){
      return Notiflix.Report.warning("데이터를 선택해주세요.","","확인")
    }
    switch(index){
      case 0:
        setModal({type : 'quantity' , isVisible : true})
        return;
      case 1:
        const selectedRows = basicRow.filter(v => selectList.has(v.id))
        const completeSelected = selectedRows.some(row => row.is_complete )
        if(completeSelected){
          Notiflix.Report.warning("사용 완료된 자재는 수정할 수 없습니다.","","확인")
        } else {
          dispatch(setModifyInitData({
            modifyInfo: selectedRows,
            type: "rawin"
          }))
          router.push('/mes/rawmaterialV1u/modify')
        }
        return;
      case 2:
        Notiflix.Confirm.show("경고","데이터를 삭제하시겠습니까?", "확인", "취소", () => DeleteBasic())
        return;
    }
  }

  const handleBarcode = async (dataurl : string , clientIP : string) => {
    Notiflix.Loading.circle()
    const data = {
      "functions":
          {"func0":{"checkLabelStatus":[]},
            "func1":{"clearBuffer":[]},
            "func2":{"drawBitmap":[dataurl,20,0,800,0]},
            "func3":{"printBuffer":[]}
          }
    }

    await fetch(`http://${clientIP}:18080/WebPrintSDK/Printer1`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : JSON.stringify(data)
    }).then((res)=>{
      Notiflix.Loading.remove(2000)
    }).catch((error) => {
      Notiflix.Loading.remove()
      if(error){
        Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        return false
      }
    })
  }

  const handleModal = (type : 'barcode',isVisible) => {
    setModal({type , isVisible})
  }

  const convertBarcodeData = (quantityData) => {
    console.log(quantityData,'quantityDataquantityDataquantityData')
    return [{
      material_id: quantityData.code ?? 0,
      material_type: 0,
      material_lot_id : quantityData.lot_rm_id,
      material_lot_number: quantityData.lot_number,
      material_quantity : quantityData.quantity,
      material_name: quantityData.name ?? "-",
      material_code: quantityData.rm_id,
      material_customer: quantityData.customer_id ?? "-",
      material_model: quantityData.model ?? "-",
    }]
  }


  const getCheckItems= () => {
    const tempList = []
    basicRow.map((data) => selectList.has(data.id) && tempList.push(data))
    return tempList
  }

  const onClickQuantity = (quantity) => {
    const items = getCheckItems()
    const item = items[0]
    const convertedData = convertBarcodeData({...item , quantity})
    setBarcodeData(convertedData)
    setModal({isVisible : true , type : 'barcode'})
  }

  const onCloseQuantity = () => {
    setModal({isVisible : false , type : 'quantity'})
  }

  return (
    <div>
      <PageHeader
        isNz
        isExp
        nz={nzState}
        exp={expState}
        onChangeNz={(e) => {
          setSelectList(new Set)
          changeNzState(e)
        }}
        onChangeExp={(e) => {
          setSelectList(new Set)
          changeExpState(e)
        }}
        isSearch
        searchKeyword={keyword}
        onChangeSearchKeyword={(keyword) => {
          setSelectList(new Set)
          setKeyword(keyword);
          // 
          SearchBasic(keyword, optionIndex, 1).then(() => {
            Notiflix.Loading.remove();
          });
          // setPageInfo({ page: 1, total: 1 });
        }}

        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option)
        }}
        calendarTitle={'입고일'}
        optionIndex={optionIndex}
        isCalendar
        calendarType={'period'}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={(date) => {
          setSelectList(new Set)
          setSelectDate(date as {from:string, to:string})
          setPageInfo({page:1, total:1})
        }}
        title={"원자재 재고 현황"}
        buttons={
          selectList.size > 1
              ?
              ['', '수정하기', '삭제']:
              ['바코드 미리보기', '수정하기', '삭제']
        }
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
        // setRow={setBasicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList
          e.map(v => {
            if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
          })
          setSelectList(tmp)
          setBasicRow(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={settingHeight(basicRow.length)}
        scrollEnd={(value) => {
          if(value){
            if(pageInfo.total > pageInfo.page){
              setSelectList(new Set)
              setPageInfo({...pageInfo, page:pageInfo.page+1})
            }
          }
        }}
      />
      <BarcodeModal
          title={'바코드 미리보기'}
          handleBarcode={handleBarcode}
          handleModal={handleModal}
          type={'rawMaterial'}
          data={barcodeData}
          isVisible={modal.type === 'barcode' && modal.isVisible}
      />
      <QuantityModal
          onClick={onClickQuantity}
          onClose={onCloseQuantity}
          isVisible={modal.type === 'quantity' && modal.isVisible}
      />
      {/*<ExcelDownloadModal*/}
      {/*  isOpen={excelOpen}*/}
      {/*  column={column}*/}
      {/*  basicRow={basicRow}*/}
      {/*  filename={`금형기준정보`}*/}
      {/*  sheetname={`금형기준정보`}*/}
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

export {MesRawMaterialStock};

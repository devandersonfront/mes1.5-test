import React, {useEffect, useState} from 'react'
import {
  BarcodeModal,
  columnlist,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  TextEditor, UnitContainer
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {TransferCodeToValue} from 'shared/src/common/TransferFunction'
import {useDispatch, useSelector} from 'react-redux'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {additionalMenus, getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import {BarcodeDataType} from "shared/src/common/barcodeType";
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'
import {CompleteButton} from "shared/src/components/Buttons/CompleteButton";
import { alertMsg } from 'shared/src/common/AlertMsg';
import {selectUserInfo} from "shared/src/reducer/userInfo";
import {barcodeOfCompany} from "../../../../shared/src/common/companyCode/companyCode";

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

const optionList = ['원자재 CODE', '원자재 품명', '재질', '원자재 LOT 번호', '거래처']

const MesRawMaterialStock = ({page, search, option}: IProps) => {
  const userInfo = useSelector(selectUserInfo)
  const router = useRouter()
  const dispatch = useDispatch()
  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockV1u"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });
  const [nzState, setNzState] = useState<boolean>(false);
  const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
  const [expState, setExpState] = useState<boolean>(false);
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })

  const onSelectDate = (date: {from:string, to:string}) => {
    setSelectDate(date)
    reload(undefined, date)
  }

  const onCompRadioChange = (hideComplete:boolean) => {
    setNzState(hideComplete)
    reload(undefined, undefined, undefined, hideComplete)
  }

  const onExpRadioChange = (onlyExpired:boolean) => {
    setExpState(onlyExpired)
    reload(undefined, undefined, undefined, undefined, onlyExpired)
  }

  const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType, _nzState?: boolean, _expState?: boolean) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, date, sortingOptions, _nzState, _expState)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({main:"원자재 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}, _nzState?:boolean, _expState?:boolean ) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(undefined, date, _sortingOptions, _nzState, _expState)
    }
    let tmpColumn = column.map((v: any) => {
      const sortIndex = sortingOptions.sorts.findIndex(value => value === v.key)
      return {
        ...v,
        pk: v.unit_id,
        sortOption: sortIndex !== -1 ? sortingOptions.orders[sortIndex] : v.sortOption ?? null,
        sorts: v.sorts ? sortingOptions : null,
        result: v.sortOption ? changeOrder : null,
      }
    });
    setColumn(tmpColumn);
  }

  const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType, _nzState?: boolean, _expState?:boolean) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    params['from'] = date ? date.from: selectDate.from
    params['to'] = date ? date.to : selectDate.to
    params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
    params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    params['exp'] = _expState !== undefined && _expState !== null ? _expState : expState
    params['nz'] = _nzState !== undefined && _nzState !== null ? _nzState : nzState
    params['completed'] = params['nz']
    params['status'] = [0,1]
    return params
  }

  const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType, _nzState?:boolean, _expState?:boolean) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'lotRmSearch' : 'lotRmList', {
      path: {
        page: page,
        renderItem: 18,
      },
      params: getRequestParams(keyword, date, _sortingOptions,_nzState, _expState)
    });
    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res, date, _nzState, _expState);
      }
    }
    Notiflix.Loading.remove()
  };

  const cleanUpData = (res: any, date?: {from:string, to:string}, _nzState?:boolean, _expState?:boolean) => {
    let tmpColumn = columnlist["rawstockV1u"];
    tmpColumn = tmpColumn.map((column: any) => {
      let menuData: object | undefined;
      res.menus && res.menus.map((menu: any) => {
        if(menu.colName === column.key){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit,
            sequence:menu.sequence
          }
        } else if(menu.colName === 'id' && column.key === 'tmpId'){
          menuData = {
            id: menu.id,
            name: menu.title,
            width: menu.width,
            tab:menu.tab,
            unit:menu.unit,
            sequence:menu.sequence
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


    loadAllSelectItems( [...tmpColumn, ...additionalMenus(res)], date, _nzState, _expState )


    let selectKey = ""
    let additionalData: any[] = []
    tmpColumn.map((v: any) => {
      if(v.selectList){
        selectKey = v.key
      }
    })


    let pk = "";
    Object.keys(res.info_list).map((v) => {
      if(v.indexOf('_id') !== -1){
        pk = v
      }
    })

    let tmpBasicRow = res.info_list.map((row: any, index: number) => {

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
            {width: '400px'}),
        onClickReturnEvent: (row, remark) => Notiflix.Confirm.show(`경고`, '출고 처리 하시겠습니까?', '예','아니오', () => SaveBasic(row, true), ()=>{}, {width: '400px'})
      }
    })
    setSelectList(new Set)
    setBasicRow([...tmpBasicRow])
  }

  async function SaveBasic(row: any, isExport?:boolean) {
    let res: any
    res = await RequestMethod('post', isExport ? `shipmentExportSave` : `lotRmComplete`, isExport ?
       [{
        ...row,
        material_type:0,
        remark:row.remark ?? "",
      }]
          : {...row, current: row.realCurrent, is_complete: !row.is_complete,})
        .catch((error) => {
          if(error.status === 409){
            Notiflix.Report.warning("경고", error.data.message, "확인",)
            return true
          }
          return false
        })

    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => reload())
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
      Notiflix.Report.success('삭제되었습니다.','','확인', () => reload());
    }

  }


  const onClickHeaderButton = (index: number) => {
    const noneSelected = selectList.size === 0
    if(noneSelected && index !== 1){
      return Notiflix.Report.warning('경고', alertMsg.noSelectedData,"확인")
    }
    switch(index){
      case 0:
        openBarcodeModal()
        break
      case 1:
        router.push(`/mes/item/manage/rawInputlist`);
        break
      case 2:
        const selectedRows = basicRow.filter(v => selectList.has(v.id))
        const exported = selectedRows.some(row => row.warehousing !== row.current )
        if(exported){
          Notiflix.Report.warning('경고',alertMsg.exportedNotUpdatable,"확인")
        } else {
          dispatch(setModifyInitData({
            modifyInfo: selectedRows,
            type: "rawin"
          }))
          router.push('/mes/rawmaterialV1u/modify')
        }
        return;
      case 3:
        Notiflix.Confirm.show("경고","데이터를 삭제하시겠습니까?", "확인", "취소", () => DeleteBasic())
        return;
    }
  }

  const filterBarcode = (barcode : string) => {

    return {
      "functions":
              {"func0":{"checkLabelStatus":[]},
                "func1":{"clearBuffer":[]},
                "func2":{"drawBitmap":[barcode,0,0,barcodeOfCompany(userInfo.companyCode).ri_drawBitMap,0]},
                "func3":{"printBuffer":[]}
              }
    }
  }

  const requestPrintApi = async (clientIP,data) => {
    Notiflix.Loading.circle()
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
        Notiflix.Report.failure('프린터 없음', '프린터 연결을 확인해 주세요.', '확인')
        return false
      }
    })
  }

  const printBarcodes = async (barcodes : string[], ip : string) => {
    const convertBarcodes = barcodes.map((barcode)=>(filterBarcode(barcode)))
    convertBarcodes.map(async (data)=>{
      await requestPrintApi(ip,data)
    })
  }


  const printBarcode = async (barcode : string , ip : string) => {
    const convertBarcode = filterBarcode(barcode)
    await requestPrintApi(ip,convertBarcode)
  }

  const handleBarcode = async (dataurl: string[] | string, clientIP : string) => {
    typeof dataurl === 'string' ? await printBarcode(dataurl,clientIP) : await printBarcodes(dataurl,clientIP)
  }



  const handleModal = (type : 'barcode',isVisible) => {
    setModal({type , isVisible})
  }

  const getCheckItems= () => {
    const tempList = []
    basicRow.map((data) => selectList.has(data.id) && tempList.push(data))
    return tempList
  }

  const convertBarcodeData = (items) => {
    return items.map((item)=>(
      {
        material_id: item.code ?? 0,
        material_type: barcodeOfCompany(userInfo.companyCode).ri_materialType,
        material_lot_id : item.lot_rm_id,
        material_lot_number: item.lot_number,
        material_quantity : item?.realCurrent ?? 0,
        material_name: !!item.name ? item.name : '-',
        material_code: item.rm_id,
        material_customer: item.customer_id ?? "-",
        material_model: item.model?.model ?? "-",
        material_machine_name : null,
        material_size : barcodeOfCompany(userInfo.companyCode, item).ri_materialSize,
        material_texture : item?.texture,
        material_unit : TransferCodeToValue(item?.raw_material.unit,'rawMaterialUnit') as string,
        material_texture_type : item?.type,
        material_import_date : item?.date,
        material_bom_lot: null,
      }
    ))
  }

  const openBarcodeModal = () => {
    if(selectList.size > 0){
      const items = getCheckItems()
      if(!items.some((item)=>item.is_complete)){
        const convertedData = convertBarcodeData(items)
        setBarcodeData(convertedData)
        setModal({type : 'barcode' , isVisible : true})
      }else{
        Notiflix.Report.warning("경고", "사용 완료된 원자재 재고가 존재합니다.", "확인")
      }
      } else{
      Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
    }
  }

  return (
    <div className={'excelPageContainer'}>
      <PageHeader
        isNz
        isExp
        nz={nzState}
        exp={expState}
        onChangeNz={onCompRadioChange}
        onChangeExp={onExpRadioChange}
        isSearch
        searchKeyword={keyword}
        onSearch={reload}
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
        setSelectDate={onSelectDate}
        title={"원자재 입고 현황"}
        buttons={
              ['바코드 미리보기', '항목관리', '수정하기', '삭제']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        selectable
        headerList={[
          SelectColumn,
        ...addColumnClass(column)
        ]}
        row={basicRow}
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
        height={setExcelTableHeight(basicRow.length)}
      />
      <BarcodeModal
          multiple
          title={'바코드 미리보기'}
          handleBarcode={handleBarcode}
          handleModal={handleModal}
          type={'rawMaterial'}
          data={barcodeData}
          isVisible={modal.type === 'barcode' && modal.isVisible}
      />
      <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo, page:page})
          }}
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

export {MesRawMaterialStock};

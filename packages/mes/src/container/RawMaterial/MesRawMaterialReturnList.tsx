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
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import {BarcodeDataType} from "shared/src/common/barcodeType";
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { TableSortingOptionType } from 'shared/src/@types/type'
import {CompleteButton} from "shared/src/components/Buttons/CompleteButton";

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

const MesRawMaterialReturnList = ({page, search, option}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockReturn"])
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
        params['status'] = 2
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
        let tmpColumn = columnlist["rawstockReturn"];
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
            // {key: 'return', name: '반납처리', formatter: CompleteButton, width: 118, beforeEventTitle:'사용 완료', afterEventTitle:'사용 완료 취소'}
            if(column.key == "return") menuData = {id:"return", name:column.name, width:column.width, }
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

        // tmpRow = res.info_list

        loadAllSelectItems( [
            ...tmpColumn,
            ...additionalMenus
        ], date, _nzState, _expState )


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
                onClickEvent: (row) =>
                    Notiflix.Confirm.show(`경고`, '반납취소 하시겠습니까?', '예','아니오', () => SaveBasic(row), ()=>{},
                        {width: '400px'}),
            }
        })
        setSelectList(new Set)
        setBasicRow([...tmpBasicRow])
    }

    async function SaveBasic(row: any) {
        let res: any

        res = await RequestMethod('post', `lotRmSave`,
            [{
                ...row,
                status:0,
                remark:null
            }])
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
        const noneSelected = selectList.size <= 0
        if(noneSelected){
            return Notiflix.Report.warning("데이터를 선택해주세요.","","확인")
        }
        switch(index){
            case 0:
                openBarcodeModal()
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

    const getCheckItems= () => {
        const tempList = []
        basicRow.map((data) => selectList.has(data.id) && tempList.push(data))
        return tempList
    }

    const convertBarcodeData = (quantityData) => {

        return [{
            material_id: quantityData.code ?? 0,
            material_type: 3,
            material_lot_id : quantityData.lot_rm_id,
            material_lot_number: quantityData.lot_number,
            material_quantity : quantityData?.realCurrent ?? 0,
            material_name: !!quantityData.name ? quantityData.name : '-',
            material_code: quantityData.rm_id,
            material_customer: quantityData.customer_id ?? "-",
            material_model: quantityData.model?.model ?? "-",
        }]
    }

    const openBarcodeModal = () => {
        if(selectList.size > 0){
            const items = getCheckItems()
            if(!items[0].is_complete){
                const convertedData = convertBarcodeData(items[0])
                setBarcodeData(convertedData)
                setModal({type : 'barcode' , isVisible : true})
            }else{
                Notiflix.Report.warning("경고", "사용 완료된 원자재 재고입니다.", "확인")
            }
        }else{
            Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
        }
    }

    return (
        <div>
            <PageHeader
                // isNz
                // isExp
                // nz={nzState}
                // exp={expState}
                // onChangeNz={onCompRadioChange}
                // onChangeExp={onExpRadioChange}
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
                title={"원자재 반납 현황"}
                // buttons={['', '수정하기', '삭제']}
                // buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable
                editable
                resizable
                selectable
                headerList={[
                    SelectColumn,
                    ...column
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

export {MesRawMaterialReturnList};
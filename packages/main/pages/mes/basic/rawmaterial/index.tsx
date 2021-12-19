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
import {MAX_VALUE} from '../../../../common/configset'
import DropDownEditor from '../../../../component/Dropdown/ExcelBasicDropdown'
import TextEditor from '../../../../component/InputBox/ExcelBasicInputBox'
import {excelDownload} from '../../../../common/excelDownloadFunction'
import {loadAll} from 'react-cookies'
import PaginationComponent from '../../../../component/Pagination/PaginationComponent'
import {NextPageContext} from 'next'
import ExcelDownloadModal from '../../../../component/Modal/ExcelDownloadMoadal'
import ExcelUploadModal from "../../../../component/Modal/ExcelUploadModal";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicContainer = ({page, keyword, option}: IProps) => {
    const router = useRouter()

    const [excelOpen, setExcelOpen] = useState<boolean>(false)
    const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false)

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        name: "", id: ""
    }])

    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["rawmaterial"]);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['고객사명', '모델명', 'CODE', '품명', '재질'])
    const [optionIndex, setOptionIndex] = useState<number>(0)

    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    useEffect(() => {
        setOptionIndex(option)
        if(keyword){
            SearchBasic(keyword, option, page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            LoadBasic(page).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [page, keyword, option])

    const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
        let tmpColumn = column.map(async (v: any) => {
            if(v.selectList && v.selectList.length === 0){
                let tmpKey = v.key

                if(tmpKey === 'customer_id'){
                    tmpKey = 'customer'
                }else if(tmpKey === 'cm_id'){
                    tmpKey = 'model'
                }
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
                        pk: v.unit_id
                    }
                }else{
                    return v
                }
            }
        })

        // if(type !== 'productprocess'){
        Promise.all(tmpColumn).then(res => {
            setColumn([...res.map(v=> {
                return {
                    ...v,
                    name: v.moddable ? v.name+'(필수)' : v.name
                }
            })])
        })
        // }
    }

    const SaveBasic = async () => {
        let res: any
            res = await RequestMethod('post', `rawmaterialSave`,
                {
                    ['raw_materials']: basicRow.map((row, i) => {
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
                                customer_id: row.customer_idPK,
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
                })


        if(res){
            if(res.status === 200){
                Notiflix.Report.success('저장되었습니다.','','확인');
                if(keyword){
                    SearchBasic(keyword, option, page).then(() => {
                        Notiflix.Loading.remove()
                    })
                }else{
                    LoadBasic(page).then(() => {
                        Notiflix.Loading.remove()
                    })
                }
            }
        }
    }


    const LoadBasic = async (page?: number) => {
        Notiflix.Loading.circle()
            const res = await RequestMethod('get', `rawmaterialList`,{
                path: {
                    page: (page || page !== 0) ? page : 1,
                    renderItem: 18,
                }
            })

            if(res && res.status === 200){
                if(res.results.totalPages < page){
                    LoadBasic(page - 1).then(() => {
                        Notiflix.Loading.remove()
                    })
                }else{
                    setPageInfo({
                        ...pageInfo,
                        page: res.results.page,
                        total: res.results.totalPages
                    })
                    cleanUpData(res)
                }
            }

    }

    const SearchBasic = async (keyword: any, option: number, isPaging?: number) => {
        Notiflix.Loading.circle()
        if(!isPaging){
            setOptionIndex(option)
        }
        const res = await RequestMethod('get', `rawmaterialSearch`,{
            path: {
                page: isPaging ?? 1,
                renderItem: 18,
            },
            params: {
                keyword: keyword ?? '',
                opt: option ?? 0
            }
        })

        if(res && res.status === 200){
            setPageInfo({
                ...pageInfo,
                page: res.results.page,
                total: res.results.totalPages
            })
            cleanUpData(res)
        }
    }

    const cleanUpBasicData = (res:any) => {
        let tmpRow = []
        tmpRow = res.results.info_list
    }

    const cleanUpData = (res: any) => {
        let tmpColumn = columnlist['rawmaterial'];
        let tmpRow = []
        tmpColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            res.results.menus && res.results.menus.map((menu: any) => {
                if(menu.colName === column.key){
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab:menu.tab,
                        unit:menu.unit,
                        moddable: !menu.moddable
                    }
                } else if(menu.colName === 'id' && column.key === 'tmpId'){
                    menuData = {
                        id: menu.id,
                        name: menu.title,
                        width: menu.width,
                        tab:menu.tab,
                        unit:menu.unit,
                        moddable: !menu.moddable
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


        tmpRow = res.results.info_list

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
                rm_id:row.rm_id,
                customer_id:row.model.customer.name,
                customer_idPK: row.model.customer.customer_id,
                cm_id:row.model.model,
                cm_idPK:row.model.cm_id,
                type:row.type,
                code: row.code,
                name: row.name,
                texture: row.texture,
                depth: row.depth,
                width: row.width,
                height: row.height,
                ...appendAdditional,
                id: `rawmaterial_${random_id}`,
            }
        })

        setBasicRow([...tmpBasicRow])
    }

    const downloadExcel = () => {
        let tmpSelectList: boolean[] = []
        basicRow.map(row => {
            tmpSelectList.push(selectList.has(row.id))
        })
        excelDownload(column, basicRow, `rawmaterial`, "rawmaterial", tmpSelectList)
    }

    const onClickHeaderButton = (index: number) => {
        switch(index){
            case 0:
                setExcelOpen(true)
                break;
            case 1:
                router.push(`/mes/item/manage/rawmaterial`)
                break;
            case 2:
                SaveBasic()
                break;
        }
    }

    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <PageHeader
                    isSearch
                    searchKeyword={keyword}
                    onChangeSearchKeyword={(keyword) => {
                        if(keyword){
                            router.push(`/mes/basic/rawmaterial?page=1&keyword=${keyword}&opt=${optionIndex}`)
                        }else{
                            router.push(`/mes/basic/rawmaterial?page=1&keyword=`)
                        }
                    }}
                    searchOptionList={optionList}
                    onChangeSearchOption={(option) => {
                        setOptionIndex(option)
                    }}
                    optionIndex={optionIndex}
                    title={"원자재 기본정보"}
                    buttons={
                             ['엑셀로 받기', '항목관리', '저장하기']
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
                            if(v.isChange) tmp.add(v.id)
                        })
                        setSelectList(tmp)
                        setBasicRow(e)
                    }}
                    selectList={selectList}
                    //@ts-ignore
                    setSelectList={setSelectList}
                    height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
                />
                <PaginationComponent
                  currentPage={pageInfo.page}
                  totalPage={pageInfo.total}
                  setPage={(page) => {
                      if(keyword){
                          router.push(`/mes/basic/rawmaterial?page=${page}&keyword=${keyword}&opt=${option}`)
                      }else{
                          router.push(`/mes/basic/rawmaterial?page=${page}`)
                      }
                  }}
                />
            </div>
            <ExcelDownloadModal
              isOpen={excelOpen}
              column={column}
              basicRow={basicRow}
              filename={`원자재기본정보`}
              sheetname={`원자재기본정보`}
              selectList={selectList}
              tab={'ROLE_BASE_06'}
              setIsOpen={setExcelOpen}
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

// BasicContainer.getInitialProps = async ({ query }) => {
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export default BasicContainer;

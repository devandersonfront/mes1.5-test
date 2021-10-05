import React, {useEffect, useState} from "react";
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import PageHeader from "../../../component/Header/Header";
import ExcelTable from "../../../component/Excel/ExcelTable";
import {columnlist} from "../../../common/columnInit";
import {RequestMethod} from "../../../common/RequestFunctions";
import {IExcelHeaderType} from "../../../common/@types/type";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {excelDownload} from "../../../common/excelDownloadFunction";
import PaginationComponent from "../../../component/Pagination/PaginationComponent";
import {NextPageContext} from "next";
import {useRouter} from "next/router";
//@ts-ignore
import Notiflix from "notiflix";
import ExcelDownloadModal from '../../../component/Modal/ExcelDownloadMoadal'
import BasicContainer from '../basic/customer'
import TextEditor from "../../../component/InputBox/ExcelBasicInputBox";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const optList = ["고객사명", "모델", "CODE", "품명"];
const Stock = ({page, keyword, option}: IProps) => {
    const router = useRouter();

    const [excelOpen, setExcelOpen] = useState<boolean>(false)

    const [rowData, setRowData] = useState<any[]>([]);
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.stock);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [optionList, setOptionList] = useState<string[]>(optList)
    const [optionIndex, setOptionIndex] = useState<number>(0)

    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({
        page:1,
        total:1
    });

    useEffect(() => {
        setOptionIndex(option)
        if(keyword){
            SearchList(keyword, option, page).then(() => {
                Notiflix.Loading.remove()
            })
        }else{
            LoadBasic(page).then(() => {
                Notiflix.Loading.remove()
            }).then(() => {
                Notiflix.Loading.remove()
            })
        }
    }, [page, keyword, option])

    const cleanUpData = async(res: any) => {
        let tmpColumn = columnlist.stock;
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

        let additionalMenus = res.results.menus ? res.results.menus.map((menu:any) => {
            if(menu.colName === null){
                return {
                    id: menu.id,
                    name: menu.title,
                    width: menu.width,
                    key: menu.title,
                    editor: TextEditor,
                    type: 'additional',
                    unit: menu.unit,
                    tab: menu.tab
                }
            }
        }).filter((v: any) => v) : []

        tmpRow = res.results.info_list

        let selectKey = ""
        // let additionalData: any[] = []
        tmpColumn.map((v: any) => {
            if(v.selectList){
                selectKey = v.key
            }
        })

        setColumn([...tmpColumn, ...additionalMenus])

        let pk = "";
        Object.keys(tmpRow).map((v) => {
            if(v.indexOf('_id') !== -1){
                pk = v
            }
        })


        let tmpBasicRow = tmpRow.map((row: any, index: number) => {
            let random_id = Math.random()*1000;

            return {
                ...row,
                customer_id: row.product.raw_material.model.customer.name,
                cm_id:row.product.raw_material.model.model,
                model:row.product.raw_material.model.model,
                code:row.product.raw_material.code,
                name: row.product.raw_material.name,
                unused: row.unused,
                wip: row.wip_stock,
                current_stock: row.current_stock,
                expectation: row.expectation,
                id: `stock_${random_id}`,
            }
        })

        setPageInfo({total:res.results.totalPages ,page:res.results.page})
        setRowData([...tmpBasicRow])
        Notiflix.Loading.remove(300);
    }



    const LoadBasic = async(page?:number) => {
        Notiflix.Loading.standard();
        const res = await RequestMethod('get', "stockList",
            {
                path:
                    {
                        page:page ?? 1,
                        renderItem:17,
                    }
            } )
        if(res && res.status === 200){
            if(res.results.totalPages !== 0 && res.results.totalPages < page){
                LoadBasic(page - 1)
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

    const SearchList = async(keyword:string, option: number, isPaging?: number) => {
        if(!isPaging){
            setOptionIndex(option)
        }

        const res = await RequestMethod("get", "stockSearch", {
            path:{
                page:isPaging ?? 1,
                renderItem:17,

            },
            params:{
                keyword:keyword ?? '',
                opt:option ?? 0,
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


    const downloadExcel = () => {
        let tmpSelectList: boolean[] = []
        rowData.map(row => {
            tmpSelectList.push(selectList.has(row.id))
        })
        excelDownload(column, rowData, "stock", "stock", tmpSelectList)
    }

    const buttonClickEvents = (number:number) => {
        switch(number) {
            case 0 :
                router.push(`/mes/item/manage/stock`)
                return

            case 1:
                setExcelOpen(true)
                return
            default :
                return

        }
    }


    useEffect(() => {
        Notiflix.Loading.standard();
        setOptionIndex(option)
        if(keyword){
            SearchList(keyword, option, page)
        }else{
            LoadBasic(page).then(() => {})
        }
    }, [page, keyword, option])


    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={3}/>
            <div style={{}}>
                <ProfileHeader/>
                    <PageHeader
                        title={"재고 현황"}
                        buttons={["항목관리","엑셀로 받기"]}
                        buttonsOnclick={buttonClickEvents}
                        isSearch={true}
                        searchKeyword={keyword}
                        onChangeSearchKeyword={(keyword) => {
                            // if(keyword){
                                router.push(`/mes/stock?page=1&keyword=${keyword}&opt=${optionIndex}`)
                            // }else{
                            //     router.push(`/mes/stock?page=1&keyword=${keyword}&opt=${optionIndex}`)
                            // }
                        }}

                        searchOptionList={optionList}

                        onChangeSearchOption={(option) => {
                            setOptionIndex(option)
                        }}
                        optionIndex={optionIndex}
                    />
                <ExcelTable
                    editable
                    headerList={[
                        SelectColumn,
                        ...column
                    ]}
                    row={rowData}
                    setRow={setRowData}
                    setSelectList={setSelectList}
                    selectList={selectList}
                    width={1570}
                    height={rowData.length * 40 >= 40*18+56 ? 40*19 : rowData.length * 40 + 56}
                    resizable
                />
                <div style={{marginBottom:20}}>
                    <PaginationComponent
                        currentPage={pageInfo.page}
                        totalPage={pageInfo.total}
                        setPage={(page) => {
                            // if(keyword){
                                router.push(`/mes/stock?page=${page}&keyword=${keyword}&opt=${option}`)
                            // }else{
                            //     router.push(`/mes/stock?page=${page}`)
                            // }
                        }}
                    />
                </div>
            </div>
            <ExcelDownloadModal
              isOpen={excelOpen}
              column={column}
              basicRow={rowData}
              filename={`재고현황`}
              sheetname={`재고현황`}
              selectList={selectList}
              tab={'ROLE_STK_01'}
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

// Stock.getInitialProps = async ({ query }) => {
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export default Stock;

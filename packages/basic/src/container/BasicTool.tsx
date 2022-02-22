import React, {useEffect, useState} from "react";
import {
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MAX_VALUE,
    PaginationComponent,
    RequestMethod,
    TextEditor
} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import {columnlist} from "shared";
import {useRouter} from "next/router";
//@ts-ignore
import Notiflix from "notiflix";
import moment from "moment";

export interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicTool = ({page, keyword, option}: IProps) => {
    const router = useRouter();
    const [column, setColumn] = useState<any>(columnlist.toolRegister)
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [pageInfo, setPageInfo] = useState<{page:number, total:number}>({page:0, total:0});
    // const [keyword, setKeyword] = useState<string>("");
    const [optionIndex, setOptionIndex] = useState<number>(0);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [selectRow , setSelectRow] = useState<number>(0);

    const cleanUpData = (info_list:any, toolAverageArray?:number[][]) => {
        let tmpColumn = columnlist["toolRegister"];
        let tmpRow:Array<any> = []
        tmpColumn = tmpColumn.map((column: any) => {
            let menuData: object | undefined;
            info_list.menus && info_list.menus.map((menu: any) => {
                if(!menu.hide){
                    if(menu.colName === column.key){
                        menuData = {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: !menu.moddable,
                            version: menu.version,
                            sequence: menu.sequence,
                            hide: menu.hide
                        }
                    } else if(menu.colName === 'id' && column.key === 'tmpId'){
                        menuData = {
                            id: menu.mi_id,
                            name: menu.title,
                            width: menu.width,
                            tab:menu.tab,
                            unit:menu.unit,
                            moddable: !menu.moddable,
                            version: menu.version,
                            sequence: menu.sequence,
                            hide: menu.hide
                        }
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

        let additionalMenus = info_list.menus ? info_list.menus.map((menu:any) => {
            if(menu.colName === null && !menu.hide){
                return {
                    id: menu.mi_id,
                    name: menu.title,
                    width: menu.width,
                    // key: menu.title,
                    key: menu.mi_id,
                    editor: TextEditor,
                    type: 'additional',
                    unit: menu.unit,
                    tab: menu.tab,
                    version: menu.version,
                    colName: menu.mi_id,
                }
            }
        }).filter((v: any) => v) : []

        tmpRow = info_list.info_list


        loadAllSelectItems([
            ...tmpColumn,
            ...additionalMenus
        ])


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

        // let pk = "";
        // Object.keys(tmpRow).map((v) => {
        //     if(v.indexOf('_id') !== -1){
        //         pk = v
        //     }
        // })
        let tmpBasicRow = tmpRow.map((row: any) => {
            let appendAdditional: any = {}

            row.customer_id = row.customer?.name;
            row.additional && row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.mi_id]: v.value
                }
            })

            let random_id = Math.random()*1000;

            return {
                ...row,
                ...appendAdditional,
                id: `tool_${random_id}`,
                products:[...row.products.map((product,index)=>{
                    return ({...product, average:Number(toolAverageArray[index])})
                })],
            }
        })
        setBasicRow([...tmpBasicRow])
    }

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
                        pk: v.unit_id
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

    const LoadBasic = async() => {
        const res = await RequestMethod("get", "toolList", {
            path:{
                page:page,
                renderItem:18
            },
            params:{

            }
        })

        if(res){
            const productIdArrayList = [];
            res.info_list.map((row)=>{
                const productList = [];
                row?.products?.map((product) => {
                    // productList.push(product.product_id)
                    RequestMethod("get", "toolAverage", {
                        path:{
                            product_id: product.product_id,
                            tool_id: row.tool_id
                        }
                    })
                        .then((res) => {
                            productList.push(res)
                        })
                })
                productIdArrayList.push(productList);
            })
            cleanUpData(res, productIdArrayList);
            setPageInfo({...pageInfo, total:res.totalPages});
        }
    }

    const SearchBasic = async() => {
        const res = await RequestMethod("get", "toolSearch",{
            path:{
                page:page,
                renderItem:18
            },
            params:{
                opt:optionIndex,
                keyword:keyword,

            }
        })

        // console.log(res,'resresresresresresres')

        if(res){

            const productIdArrayList = [];
            res.info_list.map((row)=>{
                const productList = [];
                row?.products?.map((product) => {
                    // productList.push(product.product_id)
                    RequestMethod("get", "toolAverage", {
                        path:{
                            product_id: product.product_id,
                            tool_id: row.tool_id
                        }
                    })
                        .then((res) => {
                            productList.push(res)
                        })
                })
                productIdArrayList.push(productList);
            })

            cleanUpData(res, productIdArrayList);
            setPageInfo({...pageInfo, total:res.totalPages});

            // const resultData = cleanUpData(res);
            // console.log(resultData,'resultData')            
            // setBasicRow(resultData);
        }
    }

    const SelectData = () => {
        return basicRow.filter((row) =>selectList.has(row.id));
    }

    const SaveCleanUpData = (data:any[]) => {
        let resultData = [];
        let additional = [];
        column.map((col)=>{
            if(col.type === "additional") additional.push(col)
        })
        data.map((rowData, index) => {
            let tmpRow:any = {};
            tmpRow.unit = rowData.unit;
            tmpRow.tool_id = rowData?.tool_id;
            tmpRow.code = rowData.code;
            tmpRow.name = rowData.name;
            tmpRow.stock = rowData?.stock;
            tmpRow.customer = rowData.customer;
            tmpRow.additional = [
                ...additional.map((v, index)=>{
                if(!rowData[v.colName]) return undefined;
                return {
                    mi_id: v.id,
                    title: v.name,
                    value: rowData[v.colName] ?? "",
                    unit: v.unit,
                    version:rowData.additional[index]?.version ?? undefined
                }
            }).filter((v) => v)
            ];
            tmpRow.version = rowData?.version ?? undefined;

            resultData.push(tmpRow);
        })
        return resultData;
    }

    const SaveBasic = async() => {

        const res = await RequestMethod("post", "toolSave",SaveCleanUpData(SelectData()))

        if(res){
            Notiflix.Loading.remove(300)
            Notiflix.Report.success("저장되었습니다.","","확인",() => {
                LoadBasic();
            })
        }else{
            Notiflix.Loading.remove(300)
            Notiflix.Report.failure("에러입니다.","","확인",)
        }
    }

    console.log(basicRow,'basicRowbasicRow')

    const convertDataToMap = () => {
        const map = new Map()
        basicRow.map((v)=>map.set(v.id , v))
        return map 
      }
    
      const filterSelectedRows = () => {
        return basicRow.map((row)=> selectList.has(row.id) && row).filter(v => v)
      }
    
      const classfyNormalAndHave = (selectedRows) => {
    
        const normalRows = []
        const haveIdRows = []
    
        selectedRows.map((row : any)=>{
          if(row.tool_id){
            haveIdRows.push(row)
          }else{
            normalRows.push(row)
          }
        })
    
        return [normalRows , haveIdRows]
      }




    const DeleteBasic = async() => {


        const map = convertDataToMap()
        const selectedRows = filterSelectedRows()
        const [normalRows , haveIdRows] = classfyNormalAndHave(selectedRows)

        if(haveIdRows.length > 0){

            if(normalRows.length !== 0) selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})

            await RequestMethod('delete','toolDelete', SaveCleanUpData(haveIdRows))

        }

        Notiflix.Report.success('삭제되었습니다.','','확인');
        selectedRows.forEach((nRow)=>{ map.delete(nRow.id)})
        setBasicRow(Array.from(map.values()))
        setSelectList(new Set())


    
    }

    const buttonsEvent = (index:number) => {
        switch (index){
            case 0:
                router.push(`/mes/item/manage/tool`)
                return
            case 1:
                let items = {}

                column.map((value) => {
                    if(value.selectList && value.selectList.length){
                        items = {
                            [value.key+'PK'] : value.selectList[0].pk, //여기 봐야됨!
                            ...items,
                        }
                    }
                })
                const randomId = Math.random()*1000;
                // setBasicRow([...basicRow, {...items,id:`tool_${randomId}`, stock:0, additional:[], warehousing:0, date:moment().format("YYYY-MM-DD")}])

                setBasicRow([
                    {...items,id:`tool_${randomId}`, stock:0, additional:[], warehousing:0, date:moment().format("YYYY-MM-DD")},
                    ...basicRow
                ])
                return
            case 2:
                if(selectList.size === 0){
                    return Notiflix.Report.warning(
                    '경고',
                    '선택된 정보가 없습니다.',
                    '확인',
                );
                }
                SaveBasic()
                return
            case 3:
                if(selectList.size === 0){
                    return Notiflix.Report.warning(
                    '경고',
                    '선택된 정보가 없습니다.',
                    '확인',
                );
                }
          
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인","취소",
                    ()=>{DeleteBasic()}
                    ,()=>{}
                )
                  break;
            default:
                break;
        }
    }


    const competeTool = (rows) => {
    
        const tempRow = [...rows]
        const spliceRow = [...rows]
        spliceRow.splice(selectRow, 1)
        const isCheck = spliceRow.some((row)=> row.code === tempRow[selectRow].code && row.code !== undefined)
    
        if(spliceRow){
            if(isCheck){
                return Notiflix.Report.warning(
                    '경고',
                    `중복된 코드를 입력할 수 없습니다`,
                    '확인'
                );
            }
        }
    
        setBasicRow(rows)
        
    }

    useEffect(() => {
        // setOptionIndex(option)
        if(keyword){
            SearchBasic();
        }else{
            LoadBasic();
        }
    }, [keyword])

    return (
        <div>
            <PageHeader
                title={"공구 기본정보"}
                isSearch
                searchKeyword={keyword}
                onChangeSearchKeyword={(keyword) => {
                    if(keyword){
                        router.push(`/mes/basic/tool?page=1&keyword=${keyword}&opt=${optionIndex}`);
                    }else{
                        router.push(`/mes/basic/tool?page=1&keyword=`);
                    }
                }}
                searchOptionList={["공구 CODE", "공구 품명", "거래처"]}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option);
                }}
                optionIndex={optionIndex}
                buttons={["항목관리","행 추가","저장하기","삭제"]}
                buttonsOnclick={buttonsEvent}
            />
            <ExcelTable
                resizable
                headerList={[SelectColumn, ...column]}
                row={basicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    setSelectList(tmp)
                    competeTool(e)
                    // setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                setSelectRow={setSelectRow}
            />
            <PaginationComponent totalPage={pageInfo.total} currentPage={pageInfo.page} setPage={(page) => setPageInfo({...pageInfo, page:page})} />
        </div>
    )
}

export {BasicTool}


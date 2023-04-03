import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  TextEditor,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from "shared/src/common/Util";
import {TableSortingOptionType} from "shared/src/@types/type";
import styles from "../../../../styles/mes/basic/factory/index.module.css"
import addColumnClass from '../../../main/common/unprintableKey'

export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

const BasicFactory = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [excelOpen, setExcelOpen] = useState<boolean>(false)
    const [basicRow, setBasicRow] = useState<Array<any>>([])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["factory"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>(['공장명', '주소', '담당자명', '담당자 직책', '담당자 휴대폰 번호'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
    const [selectRow, setSelectRow] = useState<number>(0);
    const [keyword, setKeyword] = useState<string>();
    const [pageInfo, setPageInfo] = useState<{ page: number, total: number }>({
        page: 1,
        total: 1
    })

    const reload = (keyword?:string, sortingOptions?: TableSortingOptionType) => {
        setKeyword(keyword)
        if(pageInfo.page > 1) {
            setPageInfo({...pageInfo, page: 1})
        } else {
            getData(undefined, keyword, sortingOptions)
        }
    }

    useEffect(() => {
        getData(pageInfo.page, keyword)
    }, [pageInfo.page]);

    useEffect(() => {
        dispatch(
            setMenuSelectState({main: "공장 기준정보", sub: router.pathname})
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);


    const valueExistence = () => {
        const selectedRows = filterSelectedRows();

        if (selectedRows.length > 0) {
            const nameCheck = selectedRows.every((data) => data.name);

            if (!nameCheck) {
                return "공장명";
            }
        }

        return false;
    };

    const SaveBasic = async () => {
        const existence = valueExistence();

        if (selectList.size === 0) {
            return Notiflix.Report.warning("경고", "선택된 정보가 없습니다.", "확인");
        }

        if (!existence) {
            const searchAiID = (rowAdditional: any[], index: number) => {
                let result: number = undefined;
                rowAdditional.map((addi, i) => {
                    if (index === i) {
                        result = addi.ai_id;
                    }
                });

                return result;
            };

            let res: any;
            res = await RequestMethod(
                "post",
                `factorySave`,
                basicRow
                    .map((row, i) => {
                        if (selectList.has(row.id)) {
                            let additional: any[] = [];
                            column.map((v) => {
                                if (v.type === "additional") {
                                    additional.push(v);
                                }
                            });
                            return {
                                ...row,
                                // id: row.tmpId,
                                authority: row.authorityPK,
                                manager: row.user?.id ? row.user : null,
                                version: row.version ?? null,
                                additional: [
                                    ...additional
                                        .map((v, index) => {
                                            //if(!row[v.colName]) return undefined;
                                            // result.push(
                                            return {
                                                mi_id: v.id,
                                                title: v.name,
                                                value: row[v.colName] ?? "",
                                                unit: v.unit,
                                                ai_id: searchAiID(row.additional, index) ?? undefined,
                                                version: row.additional[index]?.version ?? undefined,
                                            };
                                            // )
                                        })
                                        .filter((v) => v),
                                ],
                            };
                        }
                    })
                    .filter((v) => v)
            ).catch((error) => {
                return (
                    error.data &&
                    Notiflix.Report.warning("경고", `${error.data.message}`, "확인")
                );
            });

            if (res) {
                Notiflix.Report.success("저장되었습니다.", "", "확인", () => reload());
            }
        } else {
            return Notiflix.Report.warning(
                "경고",
                `"${existence}"은 필수적으로 들어가야하는 값 입니다.`,
                "확인"
            );
        }
    };

    const setAdditionalData = () => {
        const addtional = [];
        basicRow.map((row) => {
            if (selectList.has(row.id)) {
                column.map((v) => {
                    if (v.type === "additional") {
                        addtional.push(v);
                    }
                });
            }
        });

        return addtional;
    };

    const convertDataToMap = () => {
        const map = new Map();
        basicRow.map((v) => map.set(v.id, v));
        return map;
    };

    const filterSelectedRows = () => {
        return basicRow
            .map((row) => selectList.has(row.id) && row)
            .filter((v) => v);
    };

    const classfyNormalAndHave = (selectedRows) => {
        const haveIdRows = [];

        selectedRows.map((row: any) => {
            if (row.factory_id) {
                haveIdRows.push(row);
            }
        });

        return haveIdRows;
    };

    const DeleteBasic = async () => {
        const map = convertDataToMap();
        const selectedRows = filterSelectedRows();
        const haveIdRows = classfyNormalAndHave(selectedRows);
        const additional = setAdditionalData();
        let deletable = true;

        if (haveIdRows.length > 0) {
            deletable = await RequestMethod(
                "delete",
                "factoryDelete",
                haveIdRows.map((row) => ({
                    ...row,
                    manager: row.user,
                    additional: [
                        ...additional
                            .map((v) => {
                                if (row[v.name]) {
                                    return {
                                        id: v.id,
                                        title: v.name,
                                        value: row[v.name],
                                        unit: v.unit,
                                    };
                                }
                            })
                            .filter((v) => v),
                    ],
                }))
            );
            reload()
        } else {
            selectedRows.forEach((row) => {
                map.delete(row.id);
            });
            setBasicRow(Array.from(map.values()));
            setPageInfo({page: pageInfo.page, total: pageInfo.total});
            setSelectList(new Set());
        }

        if (deletable) {
            Notiflix.Report.success("삭제되었습니다.", "", "확인");
        }
    };
    const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
        let params = {}
        if(keyword) {
            params['keyword'] = keyword
            params['opt'] = optionIndex
        }
        if(sortingOptions.orders.length > 0){
            params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
            params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
        }
        return params
    }
    const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle();
        const res = await RequestMethod("get", keyword ? 'factorySearch' : 'factoryList', {
            path: {
                page: page ?? 1,
                renderItem: 18,
            },
            params: getRequestParams(keyword, _sortingOptions)
        });
        if (res) {
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    ...pageInfo,
                    page: res.page,
                    total: res.totalPages,
                });
                cleanUpData(res);
            }
        }

        setSelectList(new Set());
        Notiflix.Loading.remove()
    };

    const cleanUpData = (res: any) => {

        loadAllSelectItems({column:additionalMenus(columnlist["factory"], res), sortingOptions, setSortingOptions, reload, setColumn});

        let tmpBasicRow = res.info_list.map((row: any, index: number) => {
            let appendAdditional: any = {};

            row.additional &&
            row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.mi_id]: v.value,
                };
            });

            let random_id = Math.random() * 1000;
            return {
                ...row,
                ...appendAdditional,
                user: row.manager ?? undefined,
                managerPk: row.manager ? row.manager.user_id : '',
                manager: row.manager ? row.manager.name : '',
                appointment: row.manager ? row.manager.appointment : '',
                telephone: row.manager ? row.manager.telephone : '',
                id: `factory_${random_id}`,
                reload
            }
        })
        setBasicRow([...tmpBasicRow])
    }

    const downloadExcel = () => {
        let tmpSelectList: boolean[] = []
        basicRow.map(row => {
            tmpSelectList.push(selectList.has(row.id))
        })
        excelDownload(column, basicRow, `mold`, "mold", tmpSelectList)
    }

    const onClickHeaderButton = (index: number) => {
        switch (index) {
            case 0:
                setExcelOpen(true)
                break;
            case 1:
                // SaveBasic()
                router.push(`/mes/item/manage/factory`)
                break;
            case 2:
                const random_id = Math.random() * 1000

                setBasicRow([
                    {
                        id: `factory_${random_id}`,
                        additional: [],
                    },
                    ...basicRow
                ])
                break;
            case 3:
                SaveBasic();
                break;
            case 4:

                if (selectList.size === 0) {
                    return Notiflix.Report.warning(
                        '경고',
                        '선택된 정보가 없습니다.',
                        '확인',
                    );
                }
                Notiflix.Confirm.show("경고", "삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)", "확인", "취소", () => DeleteBasic())
                break;
        }
    }

    const competefactory = (rows) => {

        const tempRow = [...rows]
        const spliceRow = [...rows]
        spliceRow.splice(selectRow, 1)
        const isCheck = spliceRow.some((row) => row.name === tempRow[selectRow].name && row.name !== undefined && row.name !== '')

        if (spliceRow) {
            if (isCheck) {
                return Notiflix.Report.warning(
                    '공장명 경고',
                    `중복된 공장명을 입력할 수 없습니다`,
                    '확인'
                );
            }
        }

        setBasicRow(rows)
    }

    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                searchOptionList={optionList}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                optionIndex={optionIndex}
                title={"공장 기준정보"}
                buttons={
                    ['', '항목관리', '행추가', '저장하기', '삭제']
                }
                buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable
                editable
                resizable
                resizeSave
                selectable
                headerList={[
                    SelectColumn,
                    ...addColumnClass(column)
                ]}
                row={basicRow}
                // setRow={setBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if (v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                    })
                    setSelectList(tmp)
                    competefactory(e)
                }}
                selectList={selectList}
                setSelectList={(e) => {
                    //@ts-ignore
                    setSelectList(e)
                }}
                onRowClick={(clicked) => {const e = basicRow.indexOf(clicked)
                    setSelectRow(e)
                }}
                width={1576}
                height={setExcelTableHeight(basicRow.length)}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo, page: page})
                }}
            />
            {/*<ExcelDownloadModal*/}
            {/*    isOpen={excelOpen}*/}
            {/*    column={column}*/}
            {/*    basicRow={basicRow}*/}
            {/*    filename={`금형기준정보`}*/}
            {/*    sheetname={`금형기준정보`}*/}
            {/*    selectList={selectList}*/}
            {/*    tab={'ROLE_BASE_07'}*/}
            {/*    setIsOpen={setExcelOpen}*/}
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
    },
  };
};

// BasicContainer.getInitialProps = async ({ query }) => {
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export { BasicFactory };

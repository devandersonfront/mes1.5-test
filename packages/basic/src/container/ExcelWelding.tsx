import React, { useEffect, useState } from "react";
import {
    columnlist,
    ExcelTable, ExcelUploadModal,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
    deleteMenuSelectState,
    setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
import {TableSortingOptionType} from "shared/src/@types/type";

export interface IProps {
    children?: any;
    page?: number;
    keyword?: string;
    option?: number;
}

const ExcelWelding = ({}: IProps) => {
    const router = useRouter()
    const dispatch = useDispatch();
    const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
    const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
    const [basicRow, setBasicRow] = useState<Array<any>>([
        {
            name: "",
            id: "",
        },
    ]);

    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.welding)
    const [selectList, setSelectList] = useState<Set<any>>(new Set());
    const [keyword, setKeyword] = useState<string>();

    const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
        page: 1,
        total: 1,
    });

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
            setMenuSelectState({
                main: "사용자 권한 관리",
                sub: router.pathname,
            })
        );
        return () => {
            dispatch(deleteMenuSelectState());
        };
    }, []);


    const checkValid = (input: string, type:'password' | 'id' | 'telephone') => {
        let regex = undefined
        if(input.length > 0){
            switch (type){
                case 'id':
                    regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
                    break;
                case 'password':
                    regex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
                    break;
                case 'telephone':
                    regex = /^010-?([0-9]{4})-?([0-9]{4})$/
                    break;
            }
            return regex.test(input)
        } else {
            return true
        }
    }


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
            if (row.user_id) {
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
                "memberDelete",
                haveIdRows.map((row) => ({
                    ...row,
                    id: row.tmpId,
                    authority: row.authorityPK,
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
            reload();
        } else {
            selectedRows.forEach((row) => {
                map.delete(row.id);
            });
            setBasicRow(Array.from(map.values()));
            setPageInfo({ page: pageInfo.page, total: pageInfo.total });
            setSelectList(new Set());
        }

        if (deletable) {
            Notiflix.Report.success("삭제되었습니다.", "", "확인");
        }
    };

    const getRequestParams = (_sortingOptions?: TableSortingOptionType) => {
        let params = {}
        if(sortingOptions.orders.length > 0){
            params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
            params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
            params['sorts'] = params['sorts']?.map(sort => sort === 'tmpId' ? 'id' : sort)
        }
        return params
    }

    const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
        Notiflix.Loading.circle()
        const res = await RequestMethod("get",  'weldingList', {
            path: {
                page: page ?? 1,
                renderItem: 18,
            },
            params: getRequestParams(_sortingOptions)
        });
        if (res) {
            if (res.totalPages > 0 && res.totalPages < res.page) {
                reload();
            } else {
                setPageInfo({
                    page: res.page,
                    total: res.totalPages,
                });
                cleanUpData(res);
            }
        }
        Notiflix.Loading.remove()

    };

    const changeRow = (row: any) => {
        let tmpData = {};

        if (row.additional && row.additional.length) {
            row.additional.map((v) => {
                tmpData = {
                    ...tmpData,
                    [v.key]: v.value,
                };
            });
        }

        return {
            id: row.id,
            machineId:row.machineId,
            period:row.year + "." + (row.month).padStart(2,'0') + "." + (row.date).padStart(2,'0') + " " + (row.hour).padStart(2,'0') + ":" + (row.min).padStart(2,'0') + ":" + (row.sec).padStart(2,'0'),
            ch:row.ch,
            type:row.type,
            voltOutput:row.voltOutput,
            voltMax:row.voltMax,
            voltMin:row.voltMin,
            voltErrorTime:row.voltErrorTime,
            voltErrorDurationTime:row.voltErrorDurationTime,
            currentOutput:row.currentOutput,
            currentMax:row.currentMax,
            currentMin:row.currentMin,
            currentErrorTime:row.currentErrorTime,
            currentErrorDurationTime:row.currentErrorDurationTime,
            gasOutput:row.gasOutput,
            gasMax:row.gasMax,
            gasMin:row.gasMin,
            gasErrorTime:row.gasErrorTime,
            gasErrorDurationTime:row.gasErrorDurationTime,
            weldingTime:row.weldingTime,
            timeMax:row.timeMax,
            timeMin:row.timeMin,
            timeErrorOnOff:row.timeErrorOnOff,
            wireLength:row.wireLength,
            lengthMax:row.lengthMax,
            lengthMin:row.lengthMin,
            lengthError:row.lengthError,
            quantity:row.quantity,
        };
    };

    const cleanUpData = (res: any) => {
        let tmpColumn = columnlist.welding;
        let tmpRow = [];

        tmpRow = res.info_list;
        loadAllSelectItems({column:tmpColumn, sortingOptions, setSortingOptions, reload, setColumn});

        let tmpBasicRow = tmpRow.map((row: any, index: number) => {
            let realTableData: any = changeRow(row);
            let appendAdditional: any = {};

            row.additional &&
            row.additional.map((v: any) => {
                appendAdditional = {
                    ...appendAdditional,
                    [v.mi_id]: v.value,
                };
            });

            return {
                ...row,
                ...realTableData,
            };
        });
        setBasicRow([...tmpBasicRow]);
    };

    const onClickHeaderButton = (index: number) => {
        switch (index) {
            case 0:
                setExcelUploadOpen(true);
                break;
            default:
                break;
        }
    };

    return (
        <div className={'excelPageContainer'}>
            <PageHeader
                title={"용접 정보 리스트"}
                buttons={["엑셀 업로드"]}
                buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable
                resizable
                headerList={column}
                row={basicRow}
                width={1576}
                height={setExcelTableHeight(basicRow.length)}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({ ...pageInfo, page: page });
                }}
            />
            <ExcelUploadModal
                cleanUpBasicData={() => reload()}
                isOpen={excelUploadOpen}
                setIsOpen={setExcelUploadOpen}
                tab={"excel"}
            />
        </div>
    );
};

export { ExcelWelding };

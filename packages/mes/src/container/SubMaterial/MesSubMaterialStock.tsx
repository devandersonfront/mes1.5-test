import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE, PaginationComponent,
  RequestMethod,
  TextEditor,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "../../../../shared/src/reducer/menuSelectState";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { TableSortingOptionType } from 'shared/src/@types/type'

interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const optionList = ["부자재 CODE", "부자재 품명", "부자재 LOT 번호", "거래처",]

const MesSubMaterialStock = ({ page, search, option }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["substockV1u"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  const [selectDate, setSelectDate] = useState<{ from: string; to: string }>({
    from: moment().subtract(1, "month").format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
  });

  const onSelectDate = (date: {from:string, to:string}) => {
    setSelectDate(date)
    reload(undefined, date)
  }

  const reload = (keyword?:string, date?:{from:string, to:string}, sortingOptions?: TableSortingOptionType) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword, date, sortingOptions)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(
      setMenuSelectState({ main: "부자재 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const loadAllSelectItems = (column: IExcelHeaderType[], date?: {from:string, to:string}) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(undefined, date, _sortingOptions)
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
    params['status'] = [0,1]
    return params
  }

  const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'lotSmSearch' : 'lotSmList', {
      path: {
        page: page,
        renderItem: 18,
      },
      params: getRequestParams(keyword, date, _sortingOptions)
    });
    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res, date);
      }
    }
    Notiflix.Loading.remove()
  };

  const cleanUpData = (res: any, date?: {from:string, to:string}) => {
    let tmpColumn = columnlist["substockV1u"];
    let tmpRow = [];
    tmpColumn = tmpColumn
      .map((column: any) => {
        let menuData: object | undefined;
        res.menus &&
          res.menus.map((menu: any) => {
            if (menu.colName === column.key) {
              menuData = {
                id: menu.id,
                name: menu.title,
                width: menu.width,
                tab: menu.tab,
                unit: menu.unit,
              };
            } else if (menu.colName === "id" && column.key === "tmpId") {
              menuData = {
                id: menu.id,
                name: menu.title,
                width: menu.width,
                tab: menu.tab,
                unit: menu.unit,
              };
            }
          });

        menuData = {
          id: "sub_return_1",
          name: column.name,

        }
        if (menuData) {
          return {
            ...column,
            ...menuData,
          };
        }
      })
      .filter((v: any) => v);

    let additionalMenus = res.menus
      ? res.menus
        .map((menu: any) => {
          if (menu.colName === null) {
            return {
              id: menu.id,
              name: menu.title,
              width: menu.width,
              key: menu.title,
              editor: TextEditor,
              type: "additional",
              unit: menu.unit,
            };
          }
        })
        .filter((v: any) => v)
      : [];

    if (pageInfo.page > 1) {
      tmpRow = [...basicRow, ...res.info_list];
    } else {
      tmpRow = res.info_list;
    }

    loadAllSelectItems([...tmpColumn, ...additionalMenus], date);

    let selectKey = "";
    let additionalData: any[] = [];
    tmpColumn.map((v: any) => {
      if (v.selectList) {
        selectKey = v.key;
      }
    });

    additionalMenus.map((v: any) => {
      if (v.type === "additional") {
        additionalData.push(v.key);
      }
    });

    let pk = "";
    Object.keys(tmpRow).map((v) => {
      if (v.indexOf("_id") !== -1) {
        pk = v;
      }
    });

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let appendAdditional: any = {};

      row.additional &&
        row.additional.map((v: any) => {
          appendAdditional = {
            ...appendAdditional,
            [v.title]: v.value,
          };
        });

      let random_id = Math.random() * 1000;
      return {
        ...row,
        wip_id: row.sub_material?.code,
        unit: row.sub_material?.unit,
        name: row.sub_material?.name,
        customer_id: row.sub_material?.customer?.name ?? "-",
        ...appendAdditional,
        id: `subin_${random_id}`,
        onClickReturnEvent: (row, remark) => Notiflix.Confirm.show(`경고`, '반납처리하겠습니까?', '예','아니오', () => ReturnSaveBasic(row, remark,2), ()=>{}, {width: '400px'})
      };
    });
    setSelectList(new Set());
    setBasicRow([...tmpBasicRow]);
  };

  const ReturnSaveBasic = async(row:any, remark:string, status:number) => {
    const res = await RequestMethod('post', `lotSmSave`,
            [{
              ...row,
              status:status,
              remark:remark
            }]
          )
    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => reload())
    }
  }
  const DeleteBasic = async () => {
    Notiflix.Loading.circle();

    const res = await RequestMethod(
      "delete",
      `subinDelete`,
      basicRow
        .map((row, i) => {
          if (selectList.has(row.id)) {
            let selectKey: string[] = [];
            let additional: any[] = [];
            column.map((v) => {
              if (v.selectList) {
                selectKey.push(v.key);
              }

              if (v.type === "additional") {
                additional.push(v);
              }
            });

            return {
              ...row,
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
            };
          }
        })
        .filter((v) => v)
    );

    if (res) {
      Notiflix.Loading.remove(200);
      Notiflix.Report.success("삭제되었습니다.", "", "확인", () => reload())
    }
  };

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = [];
    basicRow.map((row) => {
      tmpSelectList.push(selectList.has(row.id));
    });
    excelDownload(column, basicRow, `mold`, "mold", tmpSelectList);
  };

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        if (selectList.size <= 0) {
          Notiflix.Report.warning("데이터를 선택해주세요.", "", "확인");
          return;
        }
        dispatch(
          setModifyInitData({
            modifyInfo: [
              ...basicRow
                .map((v) => {
                  if (selectList.has(v.id)) {
                    return v;
                  }
                  return false;
                })
                .filter((v) => v),
            ],
            type: "subin",
          })
        );
        router.push("/mes/submaterialV1u/modify");
        break;
      case 2:
        router.push(`/mes/item/manage/mold`);
        break;
      case 1:
        if (selectList.size === 0) {
          return Notiflix.Report.warning(
            "경고",
            "데이터를 선택해 주시기 바랍니다.",
            "확인"
          );
        }
        Notiflix.Confirm.show(
          "경고",
          "삭제하시겠습니까?",
          "확인",
          "취소",
          () => {
            DeleteBasic();
          },
          () => { }
        );
        break;
    }
  };

  return (
    <div>
      <PageHeader
        isSearch
        searchKeyword={keyword}
        onSearch={reload}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option);
        }}
        calendarTitle={"입고일"}
        optionIndex={optionIndex}
        isCalendar
        calendarType={"period"}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={onSelectDate}
        title={"부자재 재고 현황"}
        buttons={["수정하기", "삭제"]}
        buttonsOnclick={onClickHeaderButton}
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
          let tmp: Set<any> = selectList;
          e.map((v) => {
            if (v.isChange) tmp.add(v.id);
          });
          setSelectList(tmp);
          setBasicRow(e);
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={setExcelTableHeight(basicRow.length) }
      />
      <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo, page: page})
          }}
      />
    </div>
  );
};

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    },
  };
};

export { MesSubMaterialStock };

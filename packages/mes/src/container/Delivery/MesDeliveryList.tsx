import React, { useEffect, useState } from "react";
import {
  columnlist,
  ExcelDownloadModal,
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
import { TransferCodeToValue } from "shared/src/common/TransferFunction";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import { getTableSortingOptions, setExcelTableHeight } from 'shared/src/common/Util'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'
import { alertMsg } from 'shared/src/common/AlertMsg'
interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const optionList = ["납품 번호", "수주 번호", "거래처", "모델", "CODE", "품명",]

const MesDeliveryList = ({ page, search, option }: IProps) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["deliveryList"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [selectDate, setSelectDate] = useState<{ from: string; to: string }>({
    from: moment().subtract(1, "months").format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
  });
  const [keyword, setKeyword] = useState<string>("");
  const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  const onSelectDate = (date: {from:string, to:string}) => {
    setSelectDate(date)
    reload(null, date)
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
      setMenuSelectState({ main: "영업 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const loadAllSelectItems = (column: IExcelHeaderType[],date?: {from:string, to:string}) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(null, date, _sortingOptions)
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
  };

  const getRequestParams = (keyword?: string, date?: {from:string, to:string},  _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    params['from'] = date ? date.from: selectDate.from
    params['to'] = date ? date.to : selectDate.to
    params['order'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
    params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    return params
  }

  const getData = async (page: number = 1, keyword?: string, date?: {from:string, to:string}, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'shipmentSearch' : 'shipmentList', {
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
        cleanUpData(res,date)
      }
    }
    Notiflix.Loading.remove()
  };

  const deleteApi = async (filtered) => {
    const result = await RequestMethod('delete', 'shipmentDelete', filtered)
    if(result){
      Notiflix.Report.success(
        '성공',
        '삭제가 되었습니다.',
        '확인',
        () => getData())
    }
    setSelectList(new Set())
  };

  const cleanUpData = (res: any,date?: {from:string, to:string}) => {
    let tmpColumn = columnlist["deliveryList"];
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

    tmpRow = res.info_list;

    loadAllSelectItems([...tmpColumn, ...additionalMenus],date);

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

      const reducer = (accumulator, curr) => {
        if (typeof accumulator === "object") {
          return accumulator.amount + curr.amount;
        } else if (typeof accumulator === "number") {
          return accumulator + curr.amount;
        }
      };

      let random_id = Math.random() * 1000;
      let tmpAmount = 0;
      if (row.lots && row.lots.length) {
        tmpAmount =
          row.lots.length > 1 ? row.lots.reduce(reducer) : row.lots[0].amount;
      }
      return {
        ...row,
        ...appendAdditional,
        status: TransferCodeToValue(row.status, "workStatus"),
        status_no: row.status,
        contract_id: row.contract?.identification ?? "-",
        // operation_sheet: row.
        customer_id: row.product.customer?.name ?? "-",
        cm_id: row.product.model?.model ?? "-",
        product_id: row.product.code ?? "-",
        code: row.product.code ?? "-",
        name: row.product.name ?? "-",
        type: TransferCodeToValue(row.product.type, "product"),
        product_type: TransferCodeToValue(row.product.type, "productType"),
        unit: row.product?.unit ?? "-",
        process_id: row.product?.process?.name ?? "-",
        amount: tmpAmount,
        id: `delivery_${random_id}`,
      };
    });

    setBasicRow(tmpBasicRow);
  };

  const filterSelectedRows = () => {
    return basicRow.filter((row) => selectList.has(row.id))
  };

  const moveModifyPage = (filtered) => {
    Notiflix.Loading.circle();
    dispatch(setModifyInitData({modifyInfo: filtered, type: "delivery"}));
    router.push("/mes/delivery/modify").then(() => Notiflix.Loading.remove());
  }

  return (
    <div className={'excelPageContainer'}>
      <PageHeader
        isSearch
        isCalendar
        searchOptionList={optionList}
        searchKeyword={keyword}
        onSearch={reload}
        onChangeSearchOption={(option) => {
          setOptionIndex(option);
        }}
        calendarTitle={"납품 날짜"}
        calendarType={"period"}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={onSelectDate}
        title={"납품 현황"}
        buttons={["", "수정하기", "삭제"]}
        buttonsOnclick={
          (e) => {
            switch (e) {
              case 1:
                try {
                  if(selectList?.size === 0) throw(alertMsg.noSelectedData)
                  if(selectList.size > 1) throw(alertMsg.onlyOne)
                  const filtered = filterSelectedRows()
                  moveModifyPage(filtered)
                } catch(errMsg){
                  Notiflix.Report.warning('경고',errMsg,"확인")
                }
                break
              case 2:
                selectList?.size > 0 ?
                  Notiflix.Confirm.show("경고", "삭제하시겠습니까?", "확인", "취소",
                    () => {
                      const filtered = filterSelectedRows()
                      deleteApi(filtered)})
                  : Notiflix.Report.warning('선택 경고','선택된 정보가 없습니다.','확인')
                break;
            }
          }
          // onClickHeaderButton
        }
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

export { MesDeliveryList };

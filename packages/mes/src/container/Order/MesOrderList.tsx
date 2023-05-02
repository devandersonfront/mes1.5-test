import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  columnlist,
  ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader, IExcelHeaderType, PaginationComponent,
  RequestMethod,
  TextEditor
} from 'shared'
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { NextPageContext } from "next";
import moment from "moment";
import { useDispatch } from "react-redux";
import { TransferCodeToValue } from "shared/src/common/TransferFunction";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { TableSortingOptionType } from 'shared/src/@types/type'
import addColumnClass from '../../../../main/common/unprintableKey'

interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const optionList = ["수주 번호", "거래처명", "모델", "CODE", "품명"]

const MesOrderList = ({ page, search, option }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["orderList"]);
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [selectDate, setSelectDate] = useState<{ from: string; to: string }>({
    from: moment(new Date()).subtract(1, "month").format("YYYY-MM-DD"),
    to: moment(new Date()).add(1, "month").format("YYYY-MM-DD"),
  });
  const [sortingOptions, setSortingOptions] = useState<{orders:string[], sorts:string[]}>({orders:[], sorts:[]})
  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  const onSelectDate = (date: {from:string, to:string}) => {
    setSelectDate(date)
    reload(null, null, date)
  }

  const reload = (keyword?:string, sortingOptions?: TableSortingOptionType, date?:{from:string, to:string}) => {
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
    const res = await RequestMethod("get", keyword ? 'contractSearch' : 'contractList', {
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

  const cleanUpData = (res: any,date?: {from:string, to:string}) => {


    loadAllSelectItems({column:additionalMenus(columnlist["orderList"], res), sortingOptions, setSortingOptions, reload, setColumn, date});

    let tmpBasicRow = res.info_list.map((row: any, index: number) => {
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
        ...appendAdditional,
        code: row.product.code,
        customer_id: row.product.customer?.name,
        cm_id: row.product.model?.model,
        modelArray: row.model,
        process_id: row.product.process?.name,
        product_id: row.product.code,
        name: row.product.name,
        type: TransferCodeToValue(row.product.type, "product"),
        unit: row.product.unit,
        processArray: row.process,
        shipment_id: row.shipment_amount,
        id: `order_${random_id}`,
        reload
      };
    });
    setSelectList(new Set());
    setBasicRow([...tmpBasicRow]);
  };

  const DeleteBasic = async () => {
    const res = await RequestMethod(
      "delete",
      `contractDelete`,
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

            let selectData: any = {};

            Object.keys(row).map((v) => {
              if (v.indexOf("PK") !== -1) {
                selectData = {
                  ...selectData,
                  [v.split("PK")[0]]: row[v],
                };
              }

              if (v === "unitWeight") {
                selectData = {
                  ...selectData,
                  unitWeight: Number(row["unitWeight"]),
                };
              }

              if (v === "tmpId") {
                selectData = {
                  ...selectData,
                  id: row["tmpId"],
                };
              }
            });
            return {
              ...row,
              ...selectData,
              type: row.type_id,
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
      Notiflix.Report.success("삭제 성공!", "", "확인", () => reload());
    }
  };

  const buttonEvents = (btnIdx: number) => {
    switch (btnIdx) {
      case 0:
        router.push(`/mes/item/manage/order`)
        break;
      case 1:
        Notiflix.Loading.circle();
        let check = false;
        basicRow.map((v) => {
          if (selectList.has(v.id)) {
            check = true;
          }
        });
        if (check) {
          dispatch(
            setModifyInitData({
              modifyInfo: basicRow
                .map((v) => {
                  if (selectList.has(v.id)) {
                    return v;
                  }
                })
                .filter((v) => v),
              type: "order",
            })
          );
          Notiflix.Loading.remove(300);
          router.push("/mes/order/modify");
        } else {
          Notiflix.Loading.remove(300);
          Notiflix.Report.warning("데이터를 선택해주세요.", "", "확인");
        }
        break;
      case 2:
        Notiflix.Confirm.show(
          "경고",
          "삭제하시겠습니까?",
          "확인",
          "취소",
          () => {
            DeleteBasic();
          },
          () => {}
        );
        break;
    }
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
        calendarTitle={"납품 기한"}
        calendarType={"period"}
        selectDate={selectDate}
        //@ts-ignore
        setSelectDate={onSelectDate}
        title={"수주 현황"}
        buttons={["항목 관리", "수정하기", "삭제"]}
        buttonsOnclick={buttonEvents}
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

export { MesOrderList };

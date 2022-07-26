import React, { useEffect, useState } from "react";
import {
  columnlist,
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
import { TransferCodeToValue } from "shared/src/common/TransferFunction";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "../../../../shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'

interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const MesStockList = ({ page, search, option }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["stockV2"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionList, setOptionList] = useState<string[]>([
    "거래처",
    "모델",
    "CODE",
    "품명" /*'품목종류'*/,
  ]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  useEffect(() => {
    if (keyword) {
      SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
        Notiflix.Loading.remove();
      });
    } else {
      LoadBasic(pageInfo.page).then(() => {
        Notiflix.Loading.remove();
      });
    }
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(
      setMenuSelectState({ main: "재고 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    let tmpColumn = column.map(async (v: any) => {
      if (v.selectList && v.selectList.length === 0) {
        let tmpKey = v.key;

        let res: any;
        res = await RequestMethod("get", `${tmpKey}List`, {
          path: {
            page: 1,
            renderItem: MAX_VALUE,
          },
        });

        let pk = "";

        res.info_list &&
          res.info_list.length &&
          Object.keys(res.info_list[0]).map((v) => {
            if (v.indexOf("_id") !== -1) {
              pk = v;
            }
          });
        return {
          ...v,
          selectList: [
            ...res.info_list.map((value: any) => {
              return {
                ...value,
                name: tmpKey === "model" ? value.model : value.name,
                pk: value[pk],
              };
            }),
          ],
        };
      } else {
        if (v.selectList) {
          return {
            ...v,
            pk: v.unit_id,
          };
        } else {
          return v;
        }
      }
    });

    // if(type !== 'productprocess'){
    Promise.all(tmpColumn).then((res) => {
      setColumn([...res]);
    });
    // }
  };

  const LoadBasic = async (page?: number) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", `stockList`, {
      path: {
        page: page || page !== 0 ? page : 1,
        renderItem: 20,
      },
    });

    if (res) {
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      });
      cleanUpData(res, page);
    }
  };

  const SearchBasic = async (
    keyword: any,
    option: number,
    isPaging?: number
  ) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", `stockSearch`, {
      path: {
        page: isPaging ?? pageInfo.page ?? 1,
        renderItem: 20,
      },
      params: {
        keyword: keyword ?? "",
        opt: optionIndex ?? 0,
      },
    });

    if (res) {
      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      });
      cleanUpData(res, isPaging ?? pageInfo);
    }
  };

  const cleanUpData = (res: any , page?) => {
    let tmpColumn = columnlist["stockV2"];
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

    loadAllSelectItems([...tmpColumn, ...additionalMenus]);
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
        ...appendAdditional,
        customer_name: row.customer?.name ?? "-",
        customer_model: row.model?.model ?? "-",
        customer_id: row.customer?.name ?? "-",
        cm_id: row.model?.model ?? "-",
        product_id: row.code ?? "-",
        productId: row.product_id ?? "-",
        process_id: row.processId ?? "-",
        modelArray: { model: row.model?.model ?? "-" },
        processArray: { name: row.process?.name ?? "-" },
        customerArray: { name: row.customer?.name ?? "-" },
        name: row.name ?? "-",
        type: !Number.isNaN(row.type)
          ? TransferCodeToValue(row.type, "productType")
          : "-",
        unit: row.unit ?? "-",
        id: `stock${random_id}`,
        sum_stock: row.stock_sum
      };
    });
    if (page === 1) {
      setBasicRow([...tmpBasicRow])
    } else {
      setBasicRow([...basicRow, ...tmpBasicRow])
    }
  };

  const stockSave = async(data) => {
    const res = await RequestMethod("post", "stockSave",data)

    if(res){
      Notiflix.Report.success("저장되었습니다.","","확인", () => {
        setSelectList(new Set())
        LoadBasic(1)
      })

    }else{
      Notiflix.Report.failure("서버에러 입니다.","","확인")
    }
  }
  return (
    <div>
      <PageHeader
        isSearch
        onChangeSearchKeyword={setKeyword}
        onSearch={() =>  SearchBasic(keyword, optionIndex, 1).then(() => {
          Notiflix.Loading.remove();
        })}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option);
        }}
        optionIndex={optionIndex}
        title={"재고 현황"}
        buttons={["저장"]}
        buttonsOnclick={(buttonIndex) => {
          switch(buttonIndex){
            case 0:
              const result = basicRow.map((row) => {
                if(selectList.has(row.id)){
                  return {product_id:row.productId, stock:row?.basic_stock}
                }
              }).filter(row => row)

              stockSave(result)
          }
        }}
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
        scrollEnd={(value) => {
          if (value) {
            if (pageInfo.total > pageInfo.page) {
              setSelectList(new Set());
              setPageInfo({ ...pageInfo, page: pageInfo.page + 1 });
            }
          }
        }}
      />

      {/*<ExcelDownloadModal*/}
      {/*  isOpen={excelOpen}*/}
      {/*  column={column}*/}
      {/*  basicRow={basicRow}*/}
      {/*  filename={`금형기준정보`}*/}
      {/*  sheetname={`금형기준정보`}*/}
      {/*  selectList={selectList}*/}
      {/*  tab={'ROLE_BASE_07'}*/}
      {/*  setIsOpen={setExcelOpen}*/}
      {/*/>*/}
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

export { MesStockList };

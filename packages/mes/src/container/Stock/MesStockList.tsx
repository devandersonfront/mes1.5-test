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
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist["stockV2"]);
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  const loadPage = (page: number) => {
    if (keyword) {
      SearchBasic(keyword,page).then(() => {
        Notiflix.Loading.remove()
      })
    } else {
      LoadBasic(page).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }

  useEffect(() => {
    loadPage(pageInfo.page)
  }, [pageInfo.page])

  useEffect(() => {
    dispatch(
        setMenuSelectState({ main: "재고 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const LoadBasic = async (page: number = 1) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", `stockList`, {
      path: {page: page, renderItem: 18}
    });

    if (res) {
      setPageInfo({...pageInfo, page: res.page, total: res.totalPages});
      cleanUpData(res);
    }
  };

  const SearchBasic = async (keyword: string, page : number = 1) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", `stockSearch`, {
      path: { page: page, renderItem: 18},
      params: { keyword: keyword ?? "", opt: optionIndex ?? 0},
    });

    if (res) {
      setPageInfo({...pageInfo, page: res.page, total: res.totalPages});
      cleanUpData(res);
    }
  };

  const convertData = (infoList) => {

    const data = infoList.map((row: any) => {
      let random_id = Math.random() * 1000;
      return {
        ...row,
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

    return data
  }
  const convertColumn = (column) => {
    const columns = []
    columnlist["stockV2"].map((data)=>{
      column.map((menu) => {
        if(menu.colName === data.key){
          columns.push(data)
        }
      })
    })
    return columns
  }

  const cleanUpData = (res: any) => {
    const renewalData = convertData(res.info_list)
    const renewalColumn = convertColumn(res.menus)
    setColumn(renewalColumn)
    setBasicRow(renewalData)
  };

  const stockSave = async(data) => {
    const res = await RequestMethod("post", "stockSave",data)
    if(res){
      Notiflix.Report.success("저장되었습니다.","","확인", () => {
        setSelectList(new Set())
      })
    }else{
      Notiflix.Report.failure("서버에러 입니다.","","확인")
    }
  }

  const buttonsOnclick = (index) => {
    switch(index){
      case 0:
        const filterRow = basicRow.filter(row => selectList.has(row.id))
        const renewalRow = filterRow.map(row => ({ product_id:row.productId, stock : row?.basic_stock}))
        stockSave(renewalRow)
    }
  }


  return (
      <div>
        <PageHeader
            isSearch
            onChangeSearchKeyword={setKeyword}
            onSearch={() => SearchBasic(keyword).then(() => {Notiflix.Loading.remove()})}
            searchOptionList={["거래처", "모델", "CODE", "품명"]}
            onChangeSearchOption={setOptionIndex}
            optionIndex={optionIndex}
            title={"재고 현황"}
            buttons={["저장"]}
            buttonsOnclick={buttonsOnclick}
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

export { MesStockList };

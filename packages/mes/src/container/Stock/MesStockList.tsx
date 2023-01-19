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
import addColumnClass from '../../../../main/common/unprintableKey'
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
  const [types, setTypes] = useState<string>(undefined);
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({page: 1, total: 1,});
  const [stock , setStock] = useState<number>(0)

  const onColumnFilter = (value:string, key:string) => {
    switch(key){
      case 'type':
        setTypes(value ?? undefined)
        break;
    }
    setPageInfo({page:1, total:1})
  }
  const reload = (keyword?:string ) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(undefined, keyword)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page, types]);

  useEffect(() => {
    dispatch(
        setMenuSelectState({ main: "재고 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const getRequestParams = (keyword?: string) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    if(types !== undefined) params['types'] = types
    return params
  }


  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page, stock]);

  const getData = async (page: number = 1, keyword?: string) => {
    Notiflix.Loading.circle();

    const selectApi = () => {
      if(stock === 1){
        return keyword ? 'stockInsufficientSearch' : 'stockInsufficientList'
      }else{
        return keyword ? 'stockSearch' : 'stockList'
      }
    }

    const res = await RequestMethod("get", selectApi(), {
      path: {page: page, renderItem: 12},
      params: getRequestParams(keyword)
    });

    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res)
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
  };

  const getDetail = async (row) => {
    const postBody = [row.product.product_id]
    return await RequestMethod('post', 'stockBomLoad', postBody)
  }

  const convertData = (infoList) => (infoList.map((row: any) => {
      let random_id = Math.random() * 1000;
      return {
        ...row,
        product: row,
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
            ? TransferCodeToValue(row.type, "product")
            : "-",
        unit: row.unit ?? "-",
        id: `stock${random_id}`,
        expanded : false,
        safety_stock : row.safetyStock,
        // detailType : 'MASTER',
        getDetail,
        reload,
      };
    }))

  const setNewColumn = () => {
    const newColumn = column.map(col => ({
      ...col,
      result: col.options ? onColumnFilter : null,
    }))
    setColumn(newColumn)
  }

  const cleanUpData = (res: any) => {
    const newData = convertData(res.info_list)
    setNewColumn()
    setBasicRow(newData)
    // setColumn(column)
  };

  const stockSave = async(data) => {
    const res = await RequestMethod("post", "stockSave",data)
    if(res){
      Notiflix.Report.success("저장되었습니다.","","확인", () => reload())
    }
  }

  const buttonsOnclick = (index) => {
    switch(index){
      case 0:
        const filterRow = basicRow.filter(row => selectList.has(row.id))
        const renewalRow = filterRow.map(row => ({ product:row.product, stock : row?.basic_stock}))
        stockSave(renewalRow)
    }
  }

  return (
      <div className={'excelPageContainer'}>
        <PageHeader
            isSearch
            searchKeyword={keyword}
            onSearch={reload}
            searchOptionList={["거래처", "모델", "CODE", "품명"]}
            onChangeSearchOption={setOptionIndex}
            optionIndex={optionIndex}
            title={"재고 현황"}
            buttons={["저장"]}
            buttonsOnclick={buttonsOnclick}
            isRadio
            radioValue={stock}
            onChangeRadioValues={(e) => {
              setStock(e)
            }}
            radioTexts={["전체", "재고 부족"]}
        />
        <ExcelTable
            editable
            resizable
            selectable
            headerList={[SelectColumn, ...addColumnClass(column)]}
            row={basicRow}
            setRow={(e, index) => {
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
            //@ts-ignore
            rowHeight={(args) => (args.row.rowType === 'DETAIL' ? 300 : 40)}
            selectList={selectList}
            //@ts-ignore
            setSelectList={setSelectList}
            width={1576}
            height={setExcelTableHeight(Math.min(basicRow.length, 18)) + (basicRow.length && basicRow.length < 12 && basicRow.filter(row => row.expanded).length > 0 ? 260 : 0)}
            type={'expandable'}
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

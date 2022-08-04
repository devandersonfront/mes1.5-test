import React, { useEffect, useState } from "react";
import {
  columnlist,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  MAX_VALUE,
  PaginationComponent,
  RequestMethod,
  TextEditor,
} from "shared";
import { useRouter } from "next/router";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";

interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const optionList = ["거래처", "모델", "코드", "품명",]

const MesWorkStandardList = ({ search, option }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["workStandardList"]
  );
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

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
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(
      setMenuSelectState({ main: "품질 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const getRequestParams = (keyword?: string, date?: {from:string, to:string}) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string ) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', keyword ? 'productSearch': 'productList', {
      path: {
        page: page,
        renderItem: 18,
      },
      params: getRequestParams(keyword)
    })

    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res);
      }
    }
    Notiflix.Loading.remove()
  }

  const cleanUpData = (res: any) => {
    let tmpRow = [];
    tmpRow = res.info_list.map((v, i) => {
      return {
        customer: v.customer?.name ?? "-",
        model: v.model?.model ?? "-",
        code: v.code ?? "-",
        material_name: v.name ?? "-",
        type: column[4].selectList[v.type].name,
        work_standard_image: v.work_standard_image,
      };
    });
    setBasicRow([...tmpRow]);
  };


    return (
        <div>
            <PageHeader
                isSearch
                searchKeyword={keyword}
                onSearch={reload}
                searchOptionList={optionList}
                onChangeSearchOption={(option) => {
                    setOptionIndex(option)
                }}
                title={"작업 표준서 리스트"}
            />
            <ExcelTable
                resizable
                headerList={column}
                width={1576}
                row={basicRow}
                setRow={setBasicRow}
            />
            <PaginationComponent
                currentPage={pageInfo.page}
                totalPage={pageInfo.total}
                setPage={(page) => {
                    setPageInfo({...pageInfo,page:page})
                }}
            />
        </div>
    );

};

export { MesWorkStandardList };

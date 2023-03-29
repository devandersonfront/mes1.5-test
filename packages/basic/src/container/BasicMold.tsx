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
import addColumnClass from '../../../main/common/unprintableKey'

export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

const BasicMold = ({}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [excelOpen, setExcelOpen] = useState<boolean>(false);

  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["moldV2"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionList, setOptionList] = useState<string[]>(["CODE", "금형명"]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [selectRow, setSelectRow] = useState<number>(0);

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
    getData(pageInfo.page, keyword, sortingOptions)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({ main: "금형 기준정보", sub: "/mes/basic/moldV1u" }));
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);


  const SaveBasic = async () => {
    let res: any;
    let selectCheck = false;
    let codeCheck = true;
    const searchAiID = (rowAdditional: any[], index: number) => {
      let result: number = undefined;
      rowAdditional.map((addi, i) => {
        if (index === i) {
          result = addi.ai_id;
        }
      });
      return result;
    };

    const result = basicRow
      .map((row, i) => {
        if (selectList.has(row.id)) {
          selectCheck = true;
          if (!row.code) codeCheck = false;
          let additional: any[] = [];
          column.map((v) => {
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
            product_id:null,
            additional: [
              ...additional
                .map((v, index) => {
                  //if(!row[v.colName]) return undefined;
                  return {
                    mi_id: v.id,
                    title: v.name,
                    value: row[v.colName] ?? "",
                    unit: v.unit,
                    ai_id: searchAiID(row.additional, index) ?? undefined,
                    version: row.additional[index]?.version ?? undefined,
                  };
                })
                .filter((v) => v),
            ],
          };
        }
      })
      .filter((v) => v);
    if (selectCheck && codeCheck) {
      res = await RequestMethod("post", `moldSave`, result).catch((error) => {
        return (
          error.data &&
          Notiflix.Report.warning("경고", `${error.data.message}`, "확인")
        );
      });

      if (res) {
        Notiflix.Report.success("저장되었습니다.", "", "확인", () => reload());
      }
    } else if (!selectCheck) {
      Notiflix.Report.warning(
        "경고",
        "데이터를 선택해주시기 바랍니다.",
        "확인"
      );
    } else if (!codeCheck) {
      Notiflix.Report.warning("경고", "CODE를 입력해주시기 바랍니다.", "확인");
    }
  };

  const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    //이 부분 해제하면됨
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'moldSearch' : 'moldList', {
      path: {
        page: page ?? 1,
        renderItem: 18,
      },
      params: getRequestParams(keyword, _sortingOptions)
    });

    if(res){
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages
        })
        cleanUpData(res)
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
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
      if (row.mold_id) {
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


    if(haveIdRows.length > 0){

      deletable = await RequestMethod('delete','moldDelete', haveIdRows.map((row) => (
          {...row , additional : [...additional.map(v => {
            if(row[v.name]) {
              return {id : v.id, title: v.name, value: row[v.name] , unit: v.unit}
            }
          }).filter(v => v)
          ]}
      )))

      reload()
    }else{
      selectedRows.forEach((row)=>{map.delete(row.id)})
      setBasicRow(Array.from(map.values()))
      setPageInfo({page: pageInfo.page, total: pageInfo.total})
      setSelectList(new Set())
    }

    if (deletable) {
      Notiflix.Report.success("삭제되었습니다.", "", "확인");
    }
    setSelectList(new Set());
  };

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist["moldV2"];
    let tmpRow = [];
    tmpColumn = tmpColumn
      .map((column: any) => {
        let menuData: object | undefined;
        res.menus &&
          res.menus.map((menu: any) => {
            if (!menu.hide) {
              if (menu.colName === column.key) {
                menuData = {
                  id: menu.mi_id,
                  name: menu.title,
                  width: menu.width,
                  tab: menu.tab,
                  unit: menu.unit,
                  moddable: !menu.moddable,
                  version: menu.version,
                  sequence: menu.sequence,
                  hide: menu.hide,
                };
              } else if (menu.colName === "id" && column.key === "tmpId") {
                menuData = {
                  id: menu.mi_id,
                  name: menu.title,
                  width: menu.width,
                  tab: menu.tab,
                  unit: menu.unit,
                  moddable: !menu.moddable,
                  version: menu.version,
                  sequence: menu.sequence,
                  hide: menu.hide,
                };
              }
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


    tmpRow = res.info_list;

    loadAllSelectItems({column:tmpColumn.concat(additionalMenus(res)), sortingOptions, setSortingOptions, reload, setColumn});

    let selectKey = "";
    let additionalData: any[] = [];
    tmpColumn.map((v: any) => {
      if (v.selectList) {
        selectKey = v.key;
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
            [v.mi_id]: v.value,
          };
        });

      let random_id = Math.random() * 1000;
      return {
        ...row,
        ...appendAdditional,
        id: `mold_${random_id}`,
        readonly:true
      };
    });

    setBasicRow([...tmpBasicRow]);
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
        setExcelOpen(true);
        break;
      case 1:
        router.push(`/mes/item/manage/mold`);
        break;
      case 2:
        const random_id = Math.random() * 1000;

        setBasicRow([
          {
            period: 0,
            period_unit: 0,
            id: `mold_${random_id}`,
            name: null,
            additional: [],
          },
          ...basicRow,
        ]);
        break;

      case 3:
        SaveBasic();

        break;
      case 4:
        if (selectList.size === 0) {
          return Notiflix.Report.warning(
            "경고",
            "선택된 정보가 없습니다.",
            "확인"
          );
        }

        Notiflix.Confirm.show(
          "경고",
          "삭제하시겠습니까?(기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)",
          "확인",
          "취소",
          () => {
            DeleteBasic();
          },
          () => {}
        );
        break;
    }
  };

  const competeMoldV1u = (rows) => {
    const tempRow = [...rows];
    const spliceRow = [...rows];
    spliceRow.splice(selectRow, 1);
    const isCheck = spliceRow.some(
      (row) =>
        row.code === tempRow[selectRow].code &&
        row.code !== undefined &&
        row.code !== ""
    );

    if (spliceRow) {
      if (isCheck) {
        return Notiflix.Report.warning(
          "코드 경고",
          `중복된 코드를 입력할 수 없습니다`,
          "확인"
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
          title={"금형 기준정보"}
          buttons={
            ['엑셀', '항목관리', '행추가', '저장하기', '삭제']
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
          setRow={(e) => {
            let tmp: Set<any> = selectList
            e.map(v => {
              if(v.isChange) {
                tmp.add(v.id)
                v.isChange = false
              }
            })
            setSelectList(tmp)
            competeMoldV1u(e)
          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          onRowClick={(clicked) => {const e = basicRow.indexOf(clicked)
              setSelectRow(e)}}
          width={1576}
          height={setExcelTableHeight(basicRow.length)}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
              setPageInfo({...pageInfo,page:page})
          }}
        />
      <ExcelDownloadModal
        isOpen={excelOpen}
        resetFunction={() => reload()}
        category={"mold"}
        title={"금형 기준정보"}
        setIsOpen={setExcelOpen}
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

export { BasicMold };

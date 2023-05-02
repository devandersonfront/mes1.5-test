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
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
import {TableSortingOptionType} from "shared/src/@types/type";
import addColumnClass from '../../../main/common/unprintableKey'

export interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const BasicSubMaterial = ({ }: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [excelOpen, setExcelOpen] = useState<boolean>(false);
  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["subMaterial"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionList, setOptionList] = useState<string[]>([
    "부자재 CODE",
    "부자재 품명",
    "거래처",
  ]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [selectRow, setSelectRow] = useState<any>(undefined);
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
    dispatch(setMenuSelectState({ main: "부자재 기준정보", sub: "/mes/basic/submaterial" }));
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);


  const SaveBasic = async () => {
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
    let result = basicRow.map((row, i) => {
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
            customer: row.customer?.customer_id ? row.customer : null,
            additional: [
              ...additional
                .map((v, index) => {
                  // if(!row[v.colName]) return undefined;
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
      let res = await RequestMethod("post", `subMaterialSave`, result)
      if (res) {
        Notiflix.Report.success("저장되었습니다.", "", "확인", () => reload());
      }
    } else if (!selectCheck) {
      Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인");
    } else if (!codeCheck) {
      Notiflix.Report.warning("경고", "CODE를 입력해주세요.", "확인");
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
      if (row.sm_id) {
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
        "subMaterialDelete",
        haveIdRows.map((row) => ({
          ...row,
          customer: row.customerArray,
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
      setPageInfo({ page: pageInfo.page, total: pageInfo.total });
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
    //이 부분 해제하면됨
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'subMaterialSearch' : 'subMaterialList', {
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
        cleanUpData(res);
      }
    }
    setSelectList(new Set())
    Notiflix.Loading.remove()
  };

  const cleanUpData = (res: any) => {

    loadAllSelectItems({column:additionalMenus(columnlist["subMaterial"], res), sortingOptions, setSortingOptions, reload, setColumn});

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
        // customer_id: row.customer?.name ?? "",
        customer_id: row.customer && row.customer.name,
        id: `submaterial_${random_id}`,
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
        // setExcelUploadOpen(true)
        break;
      case 1:
        setExcelOpen(true);
        break;
      case 2:
        router.push(`/mes/item/manage/submaterial`);
        break;
      case 3:
        let items = {};

        column.map((value) => {
          if (value.selectList && value.selectList.length) {
            items = {
              ...value.selectList[0],
              [value.key]: value.selectList[0].name,
              [value.key + "PK"]: value.selectList[0].pk, //여기 봐야됨!
              ...items,
            };
          }
        });

        const random_id = Math.random() * 1000;

        setBasicRow([
          {
            ...items,
            id: `submaterial_${random_id}`,
            name: null,
            additional: [],
          },
          ...basicRow,
        ]);
        break;

      case 4:
        SaveBasic();

        break;
      case 5:
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
          () => { }
        );
        break;
    }
  };

  const competeSubMaterial = (rows) => {
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
        title={"부자재 기준정보"}
        buttons={
          ['', '엑셀', '항목관리', '행추가', '저장하기', '삭제']
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
          e.map((value, index) => {
            if (value?.customerArray?.customer_id) {
              basicRow[index].customer = value.customerArray;
            }
          })

            // setBasicRow([...basicRow])
            competeSubMaterial(e)
          }}
          selectList={selectList}
          //@ts-ignore
          setSelectList={setSelectList}
          onRowClick={(clicked) => {
            const e = basicRow.indexOf(clicked)
            setSelectRow(e)}
          }
          width={1576}
          height={setExcelTableHeight(basicRow.length)}
        />
        <PaginationComponent
          currentPage={pageInfo.page}
          totalPage={pageInfo.total}
          setPage={(page) => {
            setPageInfo({...pageInfo, page:page})
          }}
        />
      <ExcelDownloadModal
        isOpen={excelOpen}
        setIsOpen={setExcelOpen}
        category={"sub_material"}
        title={"부자재 기준정보"}
        resetFunction={() => reload()}
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

export { BasicSubMaterial };

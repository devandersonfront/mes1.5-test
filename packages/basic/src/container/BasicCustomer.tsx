import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload, ExcelDownloadModal,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  PaginationComponent,
  RequestMethod,
  TextEditor,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
// @ts-ignore
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import { useDispatch } from "react-redux";
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from "shared/src/common/Util";
import {TableSortingOptionType} from "shared/src/@types/type";
import addColumnClass from '../../../main/common/unprintableKey'
export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

const BasicCustomer = ({}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [excelOpen, setExcelOpen] = useState<boolean>(false);
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["customer"]
  );
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionList, setOptionList] = useState<string[]>([
    "거래처명",
    "대표자명",
    "담당자명",
    "전화 번호",
    "휴대폰 번호",
    "팩스 번호",
    "주소",
    "사업자 번호",
  ]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [selectRow, setSelectRow] = useState<number>(0);
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
      setMenuSelectState({ main: "거래처 관리", sub: router.pathname })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const valueExistence = () => {
    const selectedRows = filterSelectedRows();

    // 내가 선택을 했는데 새롭게 추가된것만 로직이 적용되어야함
    if (selectedRows.length > 0) {
      const nameCheck = selectedRows.every((data) => data.name);

      if (!nameCheck) {
        return "거래처명";
      }
    }

    return false;
  };


  const getPostBody =() => {
    return basicRow.filter(row => selectList.has(row.id)).map(row => {
      const additional = column.filter(col => col.type === "additional").map((col: any, idx) => ({
        mi_id: col.id,
        title: col.name,
        value: row[col.colName] ?? "",
        unit: col.unit,
        ai_id: row.additional[idx],
        version: row.additional[idx]?.version ?? undefined,
      }))

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

        if (v === "photo") {
          selectData = {
            ...selectData,
            photo: row["photo"]?.uuid,
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
        additional
      }
    })
  }

  const SaveBasic = async () => {
    const existence = valueExistence();

    if (selectList.size === 0) {
      return Notiflix.Report.warning("경고", "선택된 정보가 없습니다.", "확인");
    }

    if (!existence) {
      let res: any;
      res = await RequestMethod(
        "post",
        `customerSave`,
        getPostBody()
      ).catch((error) => {
        return (
          error.data &&
          Notiflix.Report.warning("경고", `${error.data.message}`, "확인")
        );
      });

      if (res) {
        Notiflix.Report.success("저장되었습니다.", "", "확인", () => reload());
      }
    } else {
      return Notiflix.Report.warning(
        "경고",
        `"${existence}"은 필수적으로 들어가야하는 값 입니다.`,
        "확인"
      );
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
      if (row.customer_id) {
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
        "customerDelete",
        haveIdRows.map((row) => ({
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

  const getRequestParams = (keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    let params = {}
    if(keyword) {
      params['keyword'] = keyword
      params['opt'] = optionIndex
    }
    if(sortingOptions.orders.length > 0){
      params['orders'] = _sortingOptions ? _sortingOptions.orders : sortingOptions.orders
      params['sorts'] = _sortingOptions ? _sortingOptions.sorts : sortingOptions.sorts
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword? 'customerSearch':'customerList', {
      path: {
        page: page ?? 1,
        renderItem: 18,
      },
      params: getRequestParams(keyword, _sortingOptions)
    });

    if (res) {
      if (res.totalPages > 0 && res.totalPages < res.page) {
        reload();
      } else {
        setPageInfo({
          ...pageInfo,
          page: res.page,
          total: res.totalPages,
        });
        cleanUpData(res);
      }
    }

    setSelectList(new Set());
    Notiflix.Loading.remove()
  };


  const cleanUpData = async (res: any) => {

    loadAllSelectItems({column:additionalMenus(columnlist["customer"], res), sortingOptions, setSortingOptions, reload, setColumn});

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
        customer_id: row.customer_id,
        name: row.name,
        rep: row.rep,
        telephone: row.telephone,
        manager: row.manager,
        cellphone: row.cellphone,
        fax: row.fax,
        photo: row.photo,
        crn: row.crn,
        address: row.address,
        password: "-",
        ...appendAdditional,
        id: `customer_${random_id}`,
      };
    });

    setBasicRow([...tmpBasicRow]);
  };

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = [];
    basicRow.map((row) => {
      tmpSelectList.push(selectList.has(row.id));
    });
    excelDownload(column, basicRow, `${"customer"}`, "customer", tmpSelectList);
  };

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        setExcelUploadOpen(true);
        break;
      case 1:
        setExcelOpen(true);
        break;
      case 2:
        router.push(`/mes/item/manage/customer`);

        break;
      case 3:
        let items = {};
        let random_id = Math.random() * 1000;
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

        setBasicRow([
          {
            ...items,
            id: `customer_${random_id}`,
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

        return Notiflix.Confirm.show(
          "경고",
          "삭제하시겠습니까? (기존 데이터를 삭제할 경우 저장하지 않은 데이터는 모두 사라집니다.)",
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

  const competeCustom = (rows) => {
    const tempRow = [...rows];
    const spliceRow = [...rows];
    spliceRow.splice(selectRow, 1);
    const isCheck = spliceRow.some(
      (row) =>
        row.name === tempRow[selectRow].name &&
        row.name !== null &&
        row.name !== ""
    );

    if (spliceRow) {
      if (isCheck) {
        return Notiflix.Report.warning(
          "거래처명 경고",
          `중복된 거래처명을 입력할 수 없습니다`,
          "확인"
        );
      }
    }

    setBasicRow(rows);
  };

  return (
      <div className={'excelPageContainer'}>
        <PageHeader
            isSearch
            searchKeyword={keyword}
            onSearch={reload}
            searchOptionList={optionList}
            onChangeSearchOption={setOptionIndex}
            optionIndex={optionIndex}
            title={"거래처 정보 관리"}
            buttons={
              // ["",'', '항목관리', '행 추가', '저장하기', '삭제']
              ["",'엑셀', '항목관리', '행 추가', '저장하기', '삭제']
            }
            buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
            className={'customer'}
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
                if(v.isChange) {
                  tmp.add(v.id)
                  v.isChange = false
                }
              })
              setSelectList(tmp)
              competeCustom(e)
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
            setIsOpen={setExcelOpen}
            category={"customer"}
            title={"거래처 정보 관리"}
            resetFunction={() => reload()}
        />
      </div>
  );
};

const HeaderButton = styled.button`
  height: 32px;
  color: white;
  border-radius: 6px;
  font-size: 15px;
  font-weight: bold;
  background: #717c90;
  padding: 0 20px;
  cursor: pointer;
  display: flex;
  margin-left: 16px;
  justify-content: center;
  align-items: center;
`;

export { BasicCustomer };

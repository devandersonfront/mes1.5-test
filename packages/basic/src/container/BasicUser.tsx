import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload,
  ExcelTable,
  Header as PageHeader,
  IExcelHeaderType,
  PaginationComponent,
  RequestMethod,
  TextEditor,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import {getTableSortingOptions, setExcelTableHeight} from 'shared/src/common/Util'
import {TableSortingOptionType} from "shared/src/@types/type";

export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

const title = "유저 관리";
const optList = ["성명", "이메일", "직책명", "전화번호"];

const BasicUser = ({}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [excelDownOpen, setExcelDownOpen] = useState<boolean>(false);
  const [excelUploadOpen, setExcelUploadOpen] = useState<boolean>(false);
  const [sortingOptions, setSortingOptions] = useState<TableSortingOptionType>({orders:[], sorts:[]})
  const [basicRow, setBasicRow] = useState<Array<any>>([
    {
      name: "",
      id: "",
    },
  ]);

  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.member)
  const [selectList, setSelectList] = useState<Set<any>>(new Set());
  const [optionList, setOptionList] = useState<string[]>(optList);
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
      setMenuSelectState({
        main: "사용자 권한 관리",
        sub: router.pathname,
      })
    );
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const loadAllSelectItems = async (column: IExcelHeaderType[]) => {
    const changeOrder = (sort:string, order:string) => {
      const _sortingOptions = getTableSortingOptions(sort, order, sortingOptions)
      setSortingOptions(_sortingOptions)
      reload(null, _sortingOptions)
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

    Promise.all(tmpColumn).then((res) => {
      setColumn([
        ...res.map((v) => {
          return {
            ...v,
            name: v.moddable ? v.name + "(필수)" : v.name,
          };
        }),
      ]);
    });
  };

  // 내가 선택한 Row의 성명, 권한 , 아이디 ,비밀번호 , 비밀번호 확인등 값이 존재하지 않을경우 해당 Row의 컬럼명을 리턴해준다.
  // Map으로 변환하는 함수
  const covertDataToMap = (data: Array<any>) => {
    const rowMap = new Map();
    data.map((row) => {
      rowMap.set(row.id, row);
    });
    return rowMap;
  };

  // 내가 선택한 Row
  const selectRowList = () => {
    let temp = [];

    const convertMap = covertDataToMap(basicRow);
    selectList.forEach((list) => {
      if (convertMap.has(list)) {
        return temp.push(convertMap.get(list));
      }
    });
    return temp;
  };

  // 선택을 했는데, isChange가 바뀌지 않은 것들만 예외 처리

  const valueExistence = () => {
    const selectedRows = selectRowList();
    const newRows = selectedRows.filter((row) => row.user_id === undefined);

    // 내가 선택을 했는데 새롭게 추가된것만 로직이 적용되어야함
    if (newRows.length > 0) {
      const nameCheck = newRows.every((data) => data.name);
      const idCheck = newRows.every((data) => data.tmpId);
      const authorityCheck = newRows.every((data) => data.authority);
      const passwordCheck = newRows.every((data) => data.password);
      const passwordConfirmCheck = newRows.every(
        (data) => data["password-confirm"]
      );

      if (!nameCheck) {
        return "성명";
      } else if (!authorityCheck) {
        return "권한";
      } else if (!idCheck) {
        return "아이디";
      } else if (!passwordCheck) {
        return "비밀번호";
      } else if (!passwordConfirmCheck) {
        return "비밀번호 확인";
      }
    } else {
      const nameCheck = selectedRows.every((data) => data.name);
      const authorityCheck = selectedRows.every((data) => data.authority);

      if (!nameCheck) {
        return "성명";
      } else if (!authorityCheck) {
        return "권한";
      }
    }

    return false;
  };

  const passwordCompete = () => {
    const selectedRows = selectRowList();

    return selectedRows.every((row) => {
      const passwordConfirm = row["password-confirm"] ?? null;
      return row.password === passwordConfirm;
    });
  };

  const SaveBasic = async () => {
    const existence = valueExistence();

    if (selectList.size === 0) {
      return Notiflix.Report.warning(
        "선택 경고",
        `선택된 정보가 없습니다.`,
        "확인"
      );
    }

    if (!existence) {
      const passwordCheck = passwordCompete();

      if (passwordCheck) {
        const searchAiID = (rowAdditional: any[], index: number) => {
          let result: number = undefined;
          rowAdditional.map((addi, i) => {
            if (index === i) {
              result = addi.ai_id;
            }
          });
          return result;
        };

        basicRow.map((row) => {
        });

        let res = await RequestMethod(
          "post",
          `memberSave`,
          basicRow
            .map((row, i) => {
              if (selectList.has(row.id)) {
                let additional: any[] = [];
                column.map((v) => {
                  if (v.type === "additional") {
                    additional.push(v);
                  }
                });

                return {
                  ...row,
                  id: row.tmpId,
                  authority: row.authorityPK,
                  // user_id: row.tmpId,
                  profile: row.profile?.uuid,
                  version: row.version ?? null,
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
            .filter((v) => v)
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
        Notiflix.Report.warning(
          "비밀번호 경고",
          `비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.`,
          "확인"
        );
      }
    } else {
      return Notiflix.Report.warning(
        "필수값 경고",
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
      if (row.user_id) {
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
        "memberDelete",
        haveIdRows.map((row) => ({
          ...row,
          id: row.tmpId,
          authority: row.authorityPK,
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
      params['sorts'] = params['sorts']?.map(sort => sort === 'tmpId' ? 'id' : sort)
    }
    return params
  }

  const getData = async (page: number = 1, keyword?: string, _sortingOptions?: TableSortingOptionType) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod("get", keyword ? 'memberSearch' : 'memberList', {
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
          page: res.page,
          total: res.totalPages,
        });
        cleanUpData(res);
      }
    }
    setSelectList(new Set());
    Notiflix.Loading.remove()
  };

  const changeRow = (row: any) => {
    let tmpData = {};

    if (row.additional && row.additional.length) {
      row.additional.map((v) => {
        tmpData = {
          ...tmpData,
          [v.key]: v.value,
        };
      });
    }

    return {
      user_id: row.user_id,
      name: row.name,
      appointment: row.appointment,
      telephone: row.telephone,
      email: row.email,
      authority: row.authority.name,
      authorityPK: row.authority.ca_id,
      tmpId: row.id,
      password: null,
      ...tmpData,
    };
  };

  const cleanUpData = (res: any) => {
    let tmpColumn = columnlist.member;
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

    let additionalMenus = res.menus
      ? res.menus
          .map((menu: any) => {
            if (menu.colName === null && !menu.hide) {
              return {
                id: menu.mi_id,
                name: menu.title,
                width: menu.width,
                // key: menu.title,
                key: menu.mi_id,
                editor: TextEditor,
                type: "additional",
                unit: menu.unit,
                tab: menu.tab,
                version: menu.version,
                colName: menu.mi_id,
              };
            }
          })
          .filter((v: any) => v)
      : [];
    // let additionalData: any[] = []

    // additionalMenus.map((v: any) => {
    //   if(v.type === 'additional'){
    //     additionalData.push(v.key)
    //   }
    // })

    tmpRow = res.info_list;
    loadAllSelectItems([...tmpColumn, ...additionalMenus]);

    let tmpBasicRow = tmpRow.map((row: any, index: number) => {
      let realTableData: any = changeRow(row);
      let appendAdditional: any = {};

      row.additional &&
        row.additional.map((v: any) => {
          appendAdditional = {
            ...appendAdditional,
            [v.mi_id]: v.value,
          };
        });

      return {
        ...row,
        ...realTableData,
        ...appendAdditional,
        authority: row.ca_id.name,
        authorityPK: row.ca_id.ca_id,
      };
    });
    setBasicRow([...tmpBasicRow]);
  };

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = [];
    basicRow.map((row) => {
      tmpSelectList.push(selectList.has(row.id));
    });
    excelDownload(column, basicRow, `process`, "process", tmpSelectList);
  };

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        setExcelUploadOpen(true);
        break;
      case 1:
        setExcelDownOpen(true);
        break;
      case 2:
        router.push(`/mes/item/manage/member`);
        break;
      case 3:
        let items = {};

        column.map((value) => {
          if (value.selectList && value.selectList.length) {
            items = {
              ...value.selectList[0],
              [value.key]: value.selectList[0].name,
              [value.key + "PK"]: value.selectList[0].ca_id,
              ...items,
            };
          }
        });

        const random_id = Math.random() * 1000;

        setBasicRow([
          {
            ...items,
            id: `user_${random_id}`,
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
            "선택 경고",
            `선택된 정보가 없습니다.`,
            "확인"
          );
        } else {
          const haveMaster = haveMasterAuthority();
          if (!haveMaster) {
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
          } else {
            return Notiflix.Report.warning(
              "권한 경고",
              `마스터 권한은 삭제하실수 없습니다.`,
              "확인"
            );
          }
        }
        break;
    }
  };

  const haveMasterAuthority = () => {
    // 내가 선택한것중에 Master가 있어면 return false
    let isAuthority = false;
    basicRow.forEach((row) => {
      if (selectList.has(row.id)) {
        if (row.authority === "MASTER") {
          isAuthority = true;
        }
      }
    });
    return isAuthority;
  };

  const competeId = (rows) => {
    const tempRow = [...rows];
    const spliceRow = [...rows];
    spliceRow.splice(selectRow, 1);
    const isCheck = spliceRow.some(
      (row) =>
        row.tmpId === tempRow[selectRow].tmpId &&
        row.tmpId !== undefined &&
        row.tmpId !== ""
    );

    if (spliceRow) {
      if (isCheck) {
        return Notiflix.Report.warning(
          "아이디 경고",
          `중복되는 아이디가 존재합니다.`,
          "확인"
        );
      }
    }

    setBasicRow(rows);
  };


  return (
    <div>
      <PageHeader
        isSearch
        searchKeyword={keyword}
        onSearch={(keyword) => reload(keyword,sortingOptions)}
        searchOptionList={optionList}
        onChangeSearchOption={(option) => {
          setOptionIndex(option);
        }}
        optionIndex={optionIndex}
        title={title}
        buttons={["", "", "항목관리", "행 추가", "저장하기", "삭제"]}
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        resizeSave
        selectable
        headerList={[SelectColumn, ...column]}
        row={basicRow}
        // setRow={setBasicRow}
        setRow={(e) => {
          let tmp: Set<any> = selectList;

          e.map((v, i) => {
            if (v.isChange) {
              tmp.add(v.id)
              v.isChange = false
            }
          });
          setSelectList(tmp);
          competeId(e);
        }}
        onRowClick={(clicked) => {
          const e = basicRow.indexOf(clicked)
          setSelectRow(e)}
        }
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
          setPageInfo({ ...pageInfo, page: page });
        }}
      />

    </div>
  );
};

export { BasicUser };

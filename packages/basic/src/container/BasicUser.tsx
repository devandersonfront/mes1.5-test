import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload,
  ExcelTable, FileEditer,
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
import addColumnClass from '../../../main/common/unprintableKey'
import { alertMsg } from 'shared/src/common/AlertMsg'
import Checkbox from "shared/src/components/InputBox/Checkbox";

export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

const title = "유저 관리";
const optList = ["성명", "이메일", "직책명", "전화번호"];
const email_reg = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
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

  const checkValid = (input: string, type:'password' | 'id' | 'telephone') => {
    let regex = undefined
    if(input.length > 0){
      switch (type){
        case 'id':
          regex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
          break;
        case 'password':
          regex = /^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/;
          break;
        case 'telephone':
          regex = /^010-?([0-9]{4})-?([0-9]{4})$/
          break;
      }
      return regex.test(input)
    } else {
      return true
    }
  }

  const validate = (row) =>{
      if(!!!row.name) throw('이름은 필수입니다.')
      if(!!!row.authorityPK) throw('권한은 필수입니다.')
      if(!!!row.tmpId) throw('아이디는 필수입니다.')
      if(!!row.tmpId && checkValid(row.tmpId, 'id')) throw('아이디에 한글이 들어갈 수 없습니다.')
      if(!!!row.password) throw('비밀번호는 필수입니다.')
      if(!!!row['password-confirm']) throw('비밀번호 확인은 필수입니다.')
      if(!!row.password && !!row['password-confirm'] && row.password !== row['password-confirm']) throw('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.')
      if(!!row.password && !checkValid(row.password, 'password')) throw('비밀번호는 8자 이상 16자 이하이어야 하며, 숫자/영문/특수문자(#?!@$%^&*-)를 모두 포함해야 합니다.')
      if(row.alarm && !row.email) throw('이메일을 입력해주세요.')
      if(row.telephone && !checkValid(row.telephone, "telephone")) throw('전화번호 양식을 맞추주세요.')
      if(alarmValidate("alarm", 1)) throw("SMS 알람은 1개 이상 선택할 수 없습니다.")
      if(alarmValidate("email_alarm", 1)) throw("Email 알람은 1개 이상 선택할 수 없습니다.")
  }

  const alarmValidate = (key:string, length:number) => {
    let count = 0
    basicRow.map((row) => {
      if(row[key] && row[key] !== undefined) count++
    })
    //true가 나오면 length보다 값이 많다는 뜻
    if(count > length) return true
  }
  const SaveBasic = async () => {
    try{
      if(selectList.size === 0){
        throw(alertMsg.noSelectedData)
      }

      const addedColumn = column.filter(col => col.type === 'additional')
      const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => {
        validate(row)
        return {
          ...row,
          id: row.tmpId,
          authority: row.authorityPK,
          profile: row.profile?.uuid,
          version: row.version ?? undefined,
          additional: addedColumn.map((col,colIdx) => ({
            mi_id: col.id,
            title: col.name,
            value: row[col.key] ?? "",
            unit: col.unit,
            ai_id: row.additional[colIdx]?.ai_id ?? undefined,
            version: row.additional[colIdx]?.version ?? undefined,
          }))
        }
      })
      Notiflix.Loading.circle()
      const res = await RequestMethod('post', 'memberSave',postBody)
      if (res) {
              Notiflix.Report.success("저장되었습니다.", "", "확인", () => reload());
      }
    } catch(errMsg){
      Notiflix.Report.warning('경고', errMsg, '확인')
      Notiflix.Loading.remove()
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
      .map((column: any, index) => {
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

    tmpRow = res.info_list;
    tmpColumn.push({ key: 'alarm', name:"SMS 알람", formatter: Checkbox, width:118},)
    tmpColumn.push({ key: 'email_alarm', name:"Email 알람", formatter: Checkbox, width:118},)
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

  // 데이터를 받아올때, print되지 말아야할 header에 클래스명을 부여한다.
  // 그리고 그 나머지 애들한테는 어떻게 이동하라는 클래스를 부여한다.
  // 각 cell과 해더에 클래스명을 준다. 하나씩 땡기고 , 어떤건 두개씩 땡긴다.





  return (
    <div className={'excelPageContainer'}>
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
        headerList={[SelectColumn, ...addColumnClass(column)]}
        row={basicRow}
        // setRow={setBasicRow}
        setRow={(e) => {
          try{
            let newSelectList: Set<any> = selectList;
            e.map((v, i) => {

              if (v.isChange) {
                newSelectList.add(v.id)
                v.isChange = false
              }
              if(v.email?.length > 0 && !email_reg.test(v.email)){
                throw("이메일 형식을 지켜주세요.")
              }
            });
            setSelectList(newSelectList);
            competeId(e);
          }catch(err){
            console.log("err : ", err)
            Notiflix.Report.warning("경고",err,"확인")
          }
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

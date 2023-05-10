import React, { useEffect, useState } from "react";
import {
  columnlist,
  excelDownload, ExcelDownloadModal,
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
import {additionalMenus, getTableSortingOptions, loadAllSelectItems, setExcelTableHeight} from 'shared/src/common/Util'
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
  const [excelOpen, setExcelOpen] = useState<boolean>(false);
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
      if(!!!row.id) throw('아이디는 필수입니다.')
      if(!!row.id && checkValid(row.id, 'id')) throw('아이디에 한글이 들어갈 수 없습니다.')
      if(!!!row.password) throw('비밀번호는 필수입니다.')
      if(!!!row['password-confirm']) throw('비밀번호 확인은 필수입니다.')
      if(!!row.password && !!row['password-confirm'] && row.password !== row['password-confirm']) throw('비밀번호와 비밀번호 확인이 서로 일치하지 않습니다.')
      if(!!row.password && !checkValid(row.password, 'password')) throw('비밀번호는 8자 이상 16자 이하이어야 하며, 숫자/영문/특수문자(#?!@$%^&*-)를 모두 포함해야 합니다.')
      if(row.alarm && !row.email) throw('이메일을 입력해주세요.')
      if(row.telephone && !checkValid(row.telephone, "telephone")) throw('전화번호 양식을 맞추주세요.')
      checkAlarmLimit(row)
  }

  const checkAlarmLimit = (row: any) => {
    const alarmKeys = ["alarm", "email_alarm", "product_email_alarm"]
    const filtered = Object.keys(row).filter(key => alarmKeys.includes(key) && row[key])
    if(filtered.length > 1) {
      throw("알람 설정은 (SMS, Email, Email(제품)) 알람 중 1개만 선택할 수 있습니다.")
    }
  }

  const SaveBasic = async () => {
    try{
      if(selectList.size === 0){
        throw(alertMsg.noSelectedData)
      }
      basicRow.forEach((v,i) => {
        if(selectList.has(v.rowKey) && v?.email && v?.email.length < 0 && !email_reg.test(v.email)) {
          throw("Email 형식을 맞춰주시기 바랍니다.")
        }
      })
      const addedColumn = column.filter(col => col.type === 'additional')
      const postBody = basicRow.filter(row => selectList.has(row.rowKey)).map(row => {
        validate(row)
        return {
          ...row,
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

  const convertDataToMap = () => {
    const map = new Map();
    basicRow.map((v) => map.set(v.rowKey, v));
    return map;
  };

  const filterSelectedRows = () => {
    return basicRow.filter(row => selectList.has(row.rowKey))
  };

  const savedRows = (selectedRows) => {
    return selectedRows.filter(row => row.user_id)
  };

  const notSavedRows = (selectedRows) => {
    return selectedRows.filter(row => !!!row.user_id )
  };

  const DeleteBasic = async () => {
    const map = convertDataToMap();
    const selectedRows = filterSelectedRows();
    const haveIdRows = savedRows(selectedRows);
    let deletable = true;

    if (haveIdRows.length > 0) {
      const toDelete = haveIdRows.map((row) => ({
        ...row,
        authority: row.authorityPK,
      }))
      deletable = await RequestMethod(
        "delete",
        "memberDelete",
        toDelete
      );
      reload();
    } else {
      selectedRows.forEach((row) => {
          map.delete(row.rowKey);
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
    const additional: any = (row.additional || {}).reduce((acc, curr) => {
      acc[curr.mi_id] = curr.value
      return acc
    }, {});

    const random_id = Math.random() * 1000;

    return {
      ...row,
      authority: row.ca_id.name,
      authorityPK: row.ca_id.ca_id,
      rowKey: `user_${random_id}`,
      password: null,
      additional: row.additional,
      ...additional,
    };
  };

  const cleanUpData = (res: any) => {
    loadAllSelectItems({column:additionalMenus(columnlist.member, res), sortingOptions, setSortingOptions, reload, setColumn});

    let tmpBasicRow = res.info_list.map((row: any, index: number) => {
      return changeRow(row);
    });
    setBasicRow(tmpBasicRow);
  };


  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        setExcelOpen(true);
        break;
      case 1:
        router.push(`/mes/item/manage/member`);
        break;
      case 2:
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
            rowKey: `user_${random_id}`,
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
      if (selectList.has(row.rowKey)) {
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
        buttons={["엑셀", "항목관리", "행 추가", "저장하기", "삭제"]}
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
            e.map((v) => {
              if (v.isChange) {
                newSelectList.add(v.rowKey)
                v.isChange = false
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
        rowKeyGetter={(row) => row.rowKey}
      />
      <PaginationComponent
        currentPage={pageInfo.page}
        totalPage={pageInfo.total}
        setPage={(page) => {
          setPageInfo({ ...pageInfo, page: page });
        }}
      />

      <ExcelDownloadModal
          isOpen={excelOpen}
          category={"member"}
          title={"유저 관리"}
          setIsOpen={setExcelOpen}
          resetFunction={() => reload()}
      />

    </div>
  );
};

export { BasicUser };

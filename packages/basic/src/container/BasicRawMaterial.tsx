import React, { useEffect, useState } from "react";
import {
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
  MAX_VALUE,
  DropDownEditor,
  TextEditor,
  excelDownload,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType,
  IItemMenuType,
  BarcodeModal,
  columnlist,
} from "shared";
// @ts-ignore
import { SelectColumn } from "react-data-grid";
import Notiflix from "notiflix";
import { useRouter } from "next/router";
import { loadAll } from "react-cookies";
import { NextPageContext } from "next";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  deleteMenuSelectState,
  setMenuSelectState,
} from "shared/src/reducer/menuSelectState";
import { setExcelTableHeight } from 'shared/src/common/Util'
import {BarcodeDataType} from "shared/src/common/barcodeType";
import {QuantityModal} from "shared/src/components/Modal/QuantityModal";

export interface IProps {
  children?: any;
  page?: number;
  keyword?: string;
  option?: number;
}

type ModalType = {
  type : 'barcode' | 'quantity'
  isVisible : boolean
}

const BasicRawMaterial = ({}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [excelOpen, setExcelOpen] = useState<boolean>(false);
  const [barcodeOpen, setBarcodeOpen] = useState<boolean>(false);
  const [basicRow, setBasicRow] = useState<Array<any>>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(
    columnlist["rawmaterialForBasicMaterial"]
  );  
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [optionList, setOptionList] = useState<string[]>([
    "원자재 CODE",
    "원자재 품명",
    "재질",
    "거래처",
  ]);
  const [optionIndex, setOptionIndex] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>();
  const [selectRow, setSelectRow] = useState<any>(undefined);
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })

  const [pageInfo, setPageInfo] = useState<{ page: number; total: number }>({
    page: 1,
    total: 1,
  });

  const reload = (keyword?:string) => {
    setKeyword(keyword)
    if(pageInfo.page > 1) {
      setPageInfo({...pageInfo, page: 1})
    } else {
      getData(null, keyword)
    }
  }

  useEffect(() => {
    getData(pageInfo.page, keyword)
  }, [pageInfo.page]);

  useEffect(() => {
    dispatch(setMenuSelectState({ main: "원자재 기준정보", sub: "" }));
    return () => {
      dispatch(deleteMenuSelectState());
    };
  }, []);

  const settingType = (type: any) => {
    switch (type) {
      case 1:
        return "COIL";

      case 2:
        return "SHEET";

      case "COIL":
        return 1;

      case "SHEET":
        return 2;

      default:
        break;
    }
  };

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

    let result = basicRow
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
          });

          return {
            ...row,
            ...selectData,
            type: settingType(row.type),
            customer: row.customer?.id ? row.customer : null,
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
      let res = await RequestMethod("post", `rawMaterialSave`, result).catch(
        (error) => {
          return (
            error.data &&
            Notiflix.Report.warning("경고", `${error.data.message}`, "확인")
          );
        }
      );

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

  const getData = async (page?: number, keyword?: string) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod("get", keyword ? 'rawmaterialSearch' : 'rawMaterialList', {
      path: {
        page: page ?? 1,
        renderItem: 18,
      },
      params: keyword ? {
        keyword,
        opt: optionIndex
      } : null,
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
    let tmpColumn = columnlist["rawmaterialForBasicMaterial"];
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
            [v.mi_id]: v.value,
          };
        });

      let random_id = Math.random() * 1000;
      return {
        ...row,
        ...appendAdditional,
        type: settingType(row.type),
        customer_id: row.customer && row.customer.name,
        id: `rawmaterial_${random_id}`,
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
      if (row.rm_id) {
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
        "rawMaterialDelete",
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
          type: settingType(row.type),
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

  const onClickHeaderButton = (index: number) => {
    switch (index) {
      case 0:
        if (selectList.size === 0) {
          return Notiflix.Report.warning(
            "오류",
            "선택을 하셔야 합니다.",
            "Okay"
          );
        }
        setModal({type : 'quantity' , isVisible : true})
        break;
      case 1:
        setExcelOpen(true)
        return
      case 2:
        router.push(`/mes/item/manage/rawmaterial`);
        break;
      case 3:
        let items = {};

        column.map((value) => {
          if (value.selectList && value.selectList.length) {
            items = {
              ...value.selectList[0],
              [value.key]: value.selectList[0].name,
              [value.key + "PK"]: value.selectList[0].pk,
              ...items,
            };
          }
        });

        const random_id = Math.random() * 1000;

        setBasicRow([
          {
            ...items,
            id: `rawmaterial_${random_id}`,
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
          () => {}
        );
        break;
    }
  };

  const competeRawMaterial = (rows) => {
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

    setBasicRow(rows);
  };

  const handleBarcode = async (dataurl : string , clientIP : string) => {
    Notiflix.Loading.circle()
    const data = {
      "functions":
          {"func0":{"checkLabelStatus":[]},
            "func1":{"clearBuffer":[]},
            "func2":{"drawBitmap":[dataurl,20,0,800,0]},
            "func3":{"printBuffer":[]}
          }
    }

    await fetch(`http://${clientIP}:18080/WebPrintSDK/Printer1`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : JSON.stringify(data)
    }).then((res)=>{
      Notiflix.Loading.remove(2000)
    }).catch((error) => {
      Notiflix.Loading.remove()
      if(error){
        Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        return false
      }
    })

  }

  const handleModal = (type : 'barcode',isVisible) => {
    setModal({type , isVisible})
  }

  const convertBarcodeData = (quantityData) => {

    return [{
      material_id: quantityData.rm_id,
      material_type: 0,
      material_lot_id : 0,
      material_lot_number: '0',
      material_quantity : quantityData.quantity,
      material_name: quantityData.name ?? '-',
      material_code: quantityData.code,
      material_customer: quantityData.customer?.name ?? "-",
      material_model: quantityData.model?.model ?? "-",
    }]
  }

  const getCheckItems= () => {
    const tempList = []
    basicRow.map((data) => selectList.has(data.id) && tempList.push(data))
    return tempList
  }

  const onClickQuantity = (quantity) => {
    const items = getCheckItems()
    const item = items[0]
    const convertedData = convertBarcodeData({...item , quantity})
    setBarcodeData(convertedData)
    setModal({isVisible : true , type : 'barcode'})
  }

  const onCloseQuantity = () => {
    setModal({isVisible : false , type : 'quantity'})
  }


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
          optionIndex={optionIndex}
          title={"원자재 기준정보"}
          buttons={[ (selectList.size === 1 && "바코드 미리보기"), "엑셀", "항목관리", "행추가", "저장하기", "삭제", ]}
          buttonsOnclick={onClickHeaderButton}
        />
        <ExcelTable
          editable
          resizable
          resizeSave
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
            competeRawMaterial(e)
          }}
          selectList={selectList}
          onRowClick={(clicked) => {const e = basicRow.indexOf(clicked) 
              setSelectRow(e)}}
          //@ts-ignore
          setSelectList={setSelectList}
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
      <BarcodeModal
          title={'바코드 미리보기'}
          handleBarcode={handleBarcode}
          handleModal={handleModal}
          type={'rawMaterial'}
          data={barcodeData}
          isVisible={modal.type === 'barcode' && modal.isVisible}
      />

      <QuantityModal
          onClick={onClickQuantity}
          onClose={onCloseQuantity}
          isVisible={modal.type === 'quantity' && modal.isVisible}
      />

      <ExcelDownloadModal
        isOpen={excelOpen}
        category={"raw_material"}
        title={"원자재 기준정보"}
        setIsOpen={setExcelOpen}
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

export { BasicRawMaterial };

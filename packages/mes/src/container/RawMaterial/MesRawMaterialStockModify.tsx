import React, {useEffect, useState} from 'react'
import {
    columnlist,
    excelDownload,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    MAX_VALUE,
    RequestMethod,
    RootState,
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {deleteMenuSelectState, setMenuSelectState} from "../../../../shared/src/reducer/menuSelectState";
import { setModifyInitData } from 'shared/src/reducer/modifyInfo'
import { alertMsg } from 'shared/src/common/AlertMsg'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

// const dummyDate = moment().subtract(10, 'days')

const MesRawMaterialStockModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const selector = useSelector((state:RootState) => state.modifyInfo);
  const dispatch = useDispatch();

  const [excelOpen, setExcelOpen] = useState<boolean>(false)

  const [basicRow, setBasicRow] = useState<Array<any>>([])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["rawstockModify"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  useEffect(() => {
    if(selector && Object.keys(selector.modifyInfo).length > 0){
      setBasicRow([
        ...selector.modifyInfo
      ])
    }else{
      router.push("/mes/rawmaterialV1u/stock")
    }
  }, [selector])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"원자재 관리",sub:"/mes/rawmaterialV1u/stock"}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const validate = (row) => {
    if(!!!row.warehousing) throw(alertMsg.noImportAmount)
  }

  const SaveBasic = async () => {
    try {
      if (selectList.size === 0) throw(alertMsg.noSelectedData)
      const postBody = basicRow.filter(row => selectList.has(row.id)).map((row, i) => {
        validate(row)
        return {
          ...row,
          raw_material: {
            ...row.raw_material,
            type:row.raw_material?.type_id,
            customer : row?.customerArray?.customer_id ? row.customerArray : null,
          },
          current: row.exhaustion === "-" ? row.warehousing : 0,
        }
      })
      const res = await RequestMethod('post', `lotRmSave`, postBody)

      if (res) {
        Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
          setTimeout(() => {
            router.push("/mes/rawmaterialV1u/stock")
          }, 300)
        });
      }
    } catch (errMsg) {
      Notiflix.Report.warning("경고", errMsg, "확인",)
    }
  }

  const onClickHeaderButton = (index: number) => {
    switch(index){
      case 0:
        SaveBasic()
        break;
    }
  }

  return (
    <div>
      <PageHeader
        title={"원자재 입고 (수정)"}
        buttons={
          ['저장하기']
        }
        buttonsOnclick={
          // () => {}
          onClickHeaderButton
        }
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
          setBasicRow(e)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
        height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
      />

      {/*<ExcelDownloadModal*/}
      {/*  isOpen={excelOpen}*/}
      {/*  column={column}*/}
      {/*  basicRow={basicRow}*/}
      {/*  filename={`금형기준정보`}*/}
      {/*  sheetname={`금형기준정보`}*/}
      {/*  selectList={selectList}*/}
      {/*  tab={'ROLE_BASE_07'}*/}
      {/*  setIsOpen={setExcelOpen}*/}
      {/*/>*/}
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export {MesRawMaterialStockModify};

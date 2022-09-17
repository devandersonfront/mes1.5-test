import React, {useEffect, useState} from 'react'
import {
    columnlist,
    ExcelDownloadModal,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType,
    PaginationComponent,
    RequestMethod,
    RootState
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch, useSelector} from 'react-redux'
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesDeliveryModify = ({page, keyword, option}: IProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const selector = useSelector((state: RootState) => state.modifyInfo)
  const [basicRow, setBasicRow] = useState<Array<any>>([{
    name: "", id: "", start_date: moment().format('YYYY-MM-DD'),
    delivery_date: moment().format('YYYY-MM-DD')
  }])
  const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["deliveryModify"])
  const [selectList, setSelectList] = useState<Set<number>>(new Set())

  useEffect(() => {
    if(selector && selector.type && selector.modifyInfo){
      setBasicRow(selector.modifyInfo.map(info => ({...info, originalLots: info.lots,})))
    }else{
      router.push('/mes/delivery/list')
    }
  }, [selector])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"영업 관리",sub:"/mes/delivery/list"}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const SaveBasic = async () => {
    const postBody = basicRow.filter(row => selectList.has(row.id))
    const res = await RequestMethod('post', `shipmentSave`, postBody)
    if(res){
      Notiflix.Report.success('저장되었습니다.','','확인', () => {
        router.push('/mes/delivery/list')
      });
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
        //@ts-ignore
        setSelectDate={(date) => setSelectDate(date)}
        title={"납품 정보 (수정)"}
        buttons={
          ['저장하기']
        }
        buttonsOnclick={onClickHeaderButton}
      />
      <ExcelTable
        editable
        resizable
        selectable
        headerList={[
          SelectColumn,
          ...column]}
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
    </div>
  );
}

export {MesDeliveryModify};

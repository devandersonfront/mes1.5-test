import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ExcelTable, Header as PageHeader, PaginationComponent, RequestMethod, RootState} from "shared";
import {columnlist} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
//@ts-ignore
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import { alertMsg } from 'shared/src/common/AlertMsg'

const MesToolUpdate = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const selector = useSelector((state:RootState) => state.modifyInfo);
    const [basicRow, setBasicRow] = useState<Array<any>>([]);
    const [column, setColumn] = useState<any>(columnlist.toolWarehousingUpdate);
    const [selectList, setSelectList] = useState<Set<number>>(new Set())

    useEffect(() => {
        if(selector && selector.modifyInfo && selector.type){
            const newData = selector.modifyInfo.map((value) => (
              {
                  ...value,
                  code: value.tool_id,
                  customer: value.customer_id,
                  customerData: value.tool.customer,
              }))
            setBasicRow(newData)
        }else{
            router.push("/mes/tool/warehousinglist")
        }
    }, [selector])

    useEffect(() => {
      dispatch(setMenuSelectState({main:"공구 관리",sub:"/mes/tool/warehousinglist"}))
      return(() => {
        dispatch(deleteMenuSelectState())
      })
    },[])


  const toToolObject = (data:any) => {
      console.log(data)
    return {
      tool: data.tool,
      lot_tool_id: data.lot_tool_id,
      warehousing: data.warehousing,
      version: data.version,
      date: moment(data.date).format('YYYY-MM-DD'),
    }
  }

  const validate = (row) => {
    if(!!!row.warehousing) throw(alertMsg.noImportAmount)
  }

  const SaveBasic = async () => {
    try {
      if(selectList.size === 0) throw(alertMsg.noSelectedData)
      const selected = basicRow.filter(row => selectList.has(row.id))
      const postBody = selected.map((row, i) => {
        validate(row)
        return toToolObject(row)
      })
      const res = await RequestMethod('post', `lotToolSave`, postBody)

      if(res){
        Notiflix.Report.success('저장되었습니다.','','확인', () => {
          setTimeout(() => {
            router.push("/mes/tool/warehousinglist")
          }, 300)
        });
      }
    } catch(errMsg){
      Notiflix.Report.warning("경고", errMsg, "확인",)
    }
  }

    const buttonEvents = (number:number) => {
        switch(number) {
            case 0:
                SaveBasic();
                return
            case 1:
                Notiflix.Confirm.show("경고","삭제하시겠습니까?","확인", "취소", () => {
                    const tmpRow = basicRow.filter(({id}, index) => !selectList.has(id))
                    setBasicRow(tmpRow);
                })
                return
            default :
                return
        }
    }

    return (
        <div>
            <PageHeader
                title={"공구 입고 (수정)"}
                buttons={
                    ['저장하기', '삭제']
                }
                buttonsOnclick={buttonEvents}

            />

            <ExcelTable
                resizable
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
                    setBasicRow(e)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
            />
            {/*<PaginationComponent currentPage={} setPage={} totalPage={}  />*/}
        </div>
    )
}

export {MesToolUpdate};

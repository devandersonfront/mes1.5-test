import React, { useEffect, useState } from 'react'
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod, RootState,} from 'shared'
// @ts-ignore
import { SelectColumn } from 'react-data-grid'
import Notiflix from "notiflix";
import { deleteMenuSelectState, setMenuSelectState } from "shared/src/reducer/menuSelectState";
import {useDispatch, useSelector,} from "react-redux";
import {useRouter} from "next/router";
import moment from "moment";
import {PlaceholderBox} from "shared/src/components/Formatter/PlaceholderBox";
import { alertMsg } from 'shared/src/common/AlertMsg'



const MesOutsourcingDeliveryModify = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const selector = useSelector((state:RootState) => state.modifyInfo);
    const [selectList, setSelectList] = useState<Set<number>>(new Set());
    const [basicRow, setBasicRow] = useState<any[]>([{}])
    const [column, setColumn] = useState<any[]>(columnlist.outsourcingDeliveryModify)

    useEffect(() => {
        dispatch(
          setMenuSelectState({ main: "외주 관리", sub: router.pathname })
        )
        return () => {
            dispatch(deleteMenuSelectState())
        }
    }, [])

    useEffect(() => {
        if(selector && selector.type && selector.modifyInfo){
            setBasicRow(selector.modifyInfo.map(info => ({
                  ...info, originalLots: info.lots
              })
            ))
        }else{
            router.push('/mes/outsourcing/delivery/list')
        }
    }, [selector])

    const buttonEvent = (buttonIndex:number) => {
        switch (buttonIndex) {
            case 0:
                if(selectList.size === 0) return Notiflix.Report.warning('경고', alertMsg.noSelectedData, '확인')
                save()
                break
            default:
                break
        }
    }

    const save = async () => {
        const postBody = basicRow.filter(row => selectList.has(row.id)).map(row => {
            return { ...row,
                // identification: row.identification,
                product: {
                    ...row.product,
                    customer : row?.customerArray?.customer_id ? row.customerArray : null,
                    model : row?.modelArray?.cm_id ? row.modelArray : null,
                },
                date: row.date ?? moment().format("YYYY_MM_DD"),
                lots: row.lots,
                version: row.version,
            }
        })
        const result = await RequestMethod("post", "outsourcingShipmentSave", postBody)
        if(result){
            Notiflix.Report.success(
              '성공',
              '저장 되었습니다.',
              '확인',
              () => router.push('/mes/outsourcing/delivery/list')
            )
        }
        setSelectList(new Set())
    }

    return (
        <div>
            <PageHeader
                title={"외주 출고(수정)"}
                buttons={
                    ['저장하기']
                }
                buttonsOnclick={buttonEvent}
            />
            <ExcelTable
                editable
                resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                setRow={(row) => {
                    row.map((row) => {
                        if(row.isChange){
                            setSelectList((select) => select.add(row.id))
                        }
                    })
                    setBasicRow(row)
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
            />
        </div>
    );
}

export { MesOutsourcingDeliveryModify };

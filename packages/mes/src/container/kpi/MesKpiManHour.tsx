import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MemberSearchModal,
    OperationSearchModal, PauseModal,
    RequestMethod, TextEditor, UnitContainer
} from "shared";
import moment from "moment";
import PeriodSelectCalendar from "../../../../main/component/Header/PeriodSelectCalendar";
import ButtonGroup from "../../../../main/component/ButtonGroup";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import {SearchModalTest} from "shared/src/components/Modal/SearchModalTest";
import {DatetimePickerBox} from "shared/src/components/CalendarBox/DatetimePickerBox";

interface SelectParameter {
    from:string
    to:string
}


const MesKpiManHour = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any[]>([{
        id: '', customer_id: ''
    }]);
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiManHour`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiManHourContent`]);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf('isoWeek').format('YYYY-MM-DD'),
        to: moment(new Date()).endOf('isoWeek').format('YYYY-MM-DD')
    });

    const manDayCostLoad = async (productId: number) => {
        const res = await RequestMethod('get', `costManDayCostList`,{
            params: {
                productIds: productId,
                from: selectDate.from,
                to: selectDate.to
            },
        })

        if(res){
            const filterResponse = res.map((v)=>{
                return {
                    osd_id: v.operation_sheet.os_id,
                    code: v.operation_sheet.product.code,
                    name: v.operation_sheet.product.name,
                    process_id: v.operation_sheet.product.process.name,
                    lot_number: v.lot_number,
                    user_id: v.worker.name,
                    start: v.start,
                    end: v.end,
                    pause_time: 0,
                    good_quantity: v.good_quantity,
                    poor_quantity: v.poor_quantity,
                    manufacturing_leadtime: 0
                }
            })
            setPauseBasicRow(filterResponse)
        }
    }


    const buttonEvents = async(index:number) => {
        switch (index) {
            case 1 :
                // downloadExcel()
                return
            case 0 :
                // let deleteBasicRow = pauseBasicRow.map(row => {
                //     if(selectList.has(row.id)){
                //         return
                //     }else{
                //         return {
                //             ...row,
                //         }
                //     }
                // }).filter(v => v)
                //
                // setPauseBasicRow([...deleteBasicRow])
                return
        }
    }


    return (
        <div>
            <PageHeader title={"작업공수(C)"} />
            <ExcelTable
                editable
                headerList={[
                    ...processColumn
                ]}
                row={processBasicRow}
                setRow={(e) => {
                    const tmpBasicRow = [...e];
                    tmpBasicRow[0] = {
                        ...tmpBasicRow[0],
                        product_id: tmpBasicRow[0].product.product_id
                    }
                    manDayCostLoad(tmpBasicRow[0].product.product_id)
                    setProcessBasicRow(  tmpBasicRow.map(v => ({...v, name: v.product_name})))
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={80}
            />
            <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                {
                    processBasicRow[0].product_id
                        ? <span style={{color:"white", fontSize:22, fontWeight:"bold"}}>
                            공정별 불량 통계
                        </span>
                        : <span style={{color:"#ffffff58", fontSize:22, fontWeight:"bold"}}>
                            제품을 선택해주세요
                        </span>
                }
                <div style={{display: 'flex', }}>
                    <PeriodSelectCalendar selectDate={selectDate as SelectParameter} onChangeSelectDate={setSelectDate} dataLimit={false} />
                    <ButtonGroup buttons={['']} buttonsOnclick={buttonEvents}/>
                </div>
            </div>
            <ExcelTable
                editable
                headerList={[
                    SelectColumn,
                    ...pauseColumn
                ]}
                row={pauseBasicRow}
                setRow={(e) => {
                    setPauseBasicRow(e)
                }}
                width={1570}
                height={440}
                // setSelectList={changeSetSelectList}
                setSelectList={setSelectList}
                selectList={selectList}
            />
        </div>
    );
};

export {MesKpiManHour}

import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType} from "shared";
import moment from "moment";
import PeriodSelectCalendar from "../../../../main/component/Header/PeriodSelectCalendar";
import ButtonGroup from "../../../../main/component/ButtonGroup";
// @ts-ignore
import {SelectColumn} from "react-data-grid";


interface SelectParameter {
    from:string
    to:string
}


const MesKpiOperation = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any[]>([{
        id: '', customer_id: ''
    }]);
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiOperation`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiOperationContent`].map(v => {
        if(v.key === 'amount'){
            return {
                ...v,
                result: changeHeaderStatus
            }
        }
        return v
    }));
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf('isoWeek').format('YYYY-MM-DD'),
        to: moment(new Date()).endOf('isoWeek').format('YYYY-MM-DD')
    });

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
            <PageHeader title={"설비가동률(P)"} />
            <ExcelTable
                editable
                headerList={[
                    ...processColumn
                ]}
                row={processBasicRow}
                setRow={(e) => {
                    const tmpBasicRow = [...e];

                    setProcessBasicRow(tmpBasicRow)
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

export {MesKpiOperation};

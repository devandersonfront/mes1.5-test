import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import PeriodSelectCalendar from "../../../../main/component/Header/PeriodSelectCalendar";
import ButtonGroup from "../../../../main/component/ButtonGroup";

interface SelectParameter {
    from:string
    to:string
}


const MesLeadtimeManufacture = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any[]>([{
        id: '', customer_id: ''
    }]);
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeManufacture`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeManufactureContent`].map(v => {
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

    const productLeadTimeListLoad = async (productId: number) => {
        const res = await RequestMethod('get', `productLeadTimeList`,{
            params: {
                productIds: productId,
                from: selectDate.from,
                to: selectDate.to
            },
        })

        console.log(res)
        if(res){

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
            <PageHeader title={"제조리드타임(P)"} />
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
                    productLeadTimeListLoad(tmpBasicRow[0].product.product_id)
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
                            작업이력별 제조리드타임
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

export {MesLeadtimeManufacture};

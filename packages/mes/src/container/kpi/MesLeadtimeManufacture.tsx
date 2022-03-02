import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MemberSearchModal,
    OperationSearchModal, PauseModal, ProductSearchModal,
    RequestMethod, TextEditor, UnitContainer
} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import PeriodSelectCalendar from "../../../../main/component/Header/PeriodSelectCalendar";
import ButtonGroup from "../../../../main/component/ButtonGroup";
import {SearchModalTest} from "shared/src/components/Modal/SearchModalTest";
import {DatetimePickerBox} from "shared/src/components/CalendarBox/DatetimePickerBox";

interface SelectParameter {
    from:string
    to:string
}


const MesLeadtimeManufacture = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any>({id : '' });
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeManufacture`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeManufactureContent`]);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to: moment(new Date()).format('YYYY-MM-DD')
    });

    const productLeadTimeListLoad = async (productId: number) => {
        const res = await RequestMethod('get', `productLeadTimeList`,{
            params: {
                productIds: productId,
                from: selectDate.from,
                to: selectDate.to,
                rangeNeeded: true
            },
        })

        if(res){
            const filterResponse = res.map((v)=>{
                return {
                    osd_id: v.operation_sheet.os_id,
                    code: v.operation_sheet.product.code,
                    name: v.operation_sheet.product.name,
                    process_id: v.operation_sheet.product.process?.name,
                    lot_number: v.lot_number,
                    user_id: v.worker.name,
                    start: v.start,
                    end: v.end,
                    paused_time: 0,
                    good_quantity: v.good_quantity,
                    poor_quantity: v.poor_quantity,
                    manufacturing_leadtime: v.lead_time
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

    // Date 변화에 따른 API 요청
    React.useEffect(()=>{

        if(processBasicRow.id){
            productLeadTimeListLoad(processBasicRow.id)
        }

    },[processBasicRow.id,selectDate])


    React.useEffect(()=>{

        if(pauseBasicRow.length){

            const rowLenth = pauseBasicRow.length;
            let sum = 0;
            if(rowLenth){
                pauseBasicRow.map((row)=> {
                    sum += row.manufacturing_leadtime
                })
                setProcessBasicRow({...processBasicRow , manufacturing_leadtime_average : `${Math.round(sum/rowLenth)}`})
            }
        }else{

            setProcessBasicRow({...processBasicRow , manufacturing_leadtime_average : '-'})
        }


    },[pauseBasicRow])

    return (
        <div>
            <PageHeader title={"제조리드타임(P)"} />
            <ExcelTable
                editable
                headerList={[
                    ...processColumn
                ]}
                row={[processBasicRow]}
                setRow={(row) => {
                    setProcessBasicRow({...processBasicRow,
                        id : row[0].product.product_id,
                        customer_id : row[0].customer_id,
                        cm_id : row[0].cm_id,
                        code : row[0].code,
                        name: row[0].product_name,
                    })
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={80}
            />
            <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                {
                    processBasicRow?.id
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

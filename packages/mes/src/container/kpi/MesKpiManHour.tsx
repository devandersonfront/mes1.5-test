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
import DateRangeCalendar from "../../../../shared/src/components/Header/DateRangeCalendar";
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";

interface SelectParameter {
    from:string
    to:string
}


const MesKpiManHour = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any>({
        id: '', customer_id: ''
    });


    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiManHour`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiManHourContent`]);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to: moment(new Date()).subtract(1,"day").format('YYYY-MM-DD')
    });

    const manDayCostLoad = async (productId: number) => {
        if(moment(selectDate.from).add(3,'month') < moment(selectDate.to)){
            return Notiflix.Report.warning("경고", "최대 검색 기간을 초과하였습니다.", "확인",)
        }

        const res = await RequestMethod('get', `costManDayCostList`,{
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
                    ...v,
                    osd_id: v.operation_sheet.os_id,
                    code: v.operation_sheet.product.code,
                    name: v.operation_sheet.product.name,
                    process_id: v.operation_sheet.product.process?.name,
                    lot_number: v.lot_number,
                    user_id: v.worker.name,
                    start: v.start,
                    end: v.end,
                    pause_time: 0,
                    good_quantity: v.good_quantity,
                    poor_quantity: v.poor_quantity,
                    manufacturing_leadtime: v.lead_time,
                    manDays : `${((v.lead_time * processBasicRow.standard_production)/86400).toFixed(1)}`
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

    React.useEffect(()=>{

        if(processBasicRow.id){
            manDayCostLoad(processBasicRow.id)
        }

    },[processBasicRow.id,selectDate])

    React.useEffect(() => {
        setPauseBasicRow(pauseBasicRow.map(row => ({...row, manDays: `${((row.lead_time * processBasicRow.standard_production)/86400).toFixed(1)}`})))
    }, [processBasicRow.standard_production])

    console.log(pauseBasicRow)
    React.useEffect(()=>{

        if(pauseBasicRow.length){
            const rowLength = pauseBasicRow.length;
            const sum = pauseBasicRow.map(row => Number(row.manDays)).reduce((prev, curr) => prev + curr)
            setProcessBasicRow({...processBasicRow , manDays_average : `${(sum/rowLength).toFixed(1)}`})
        }else{

            setProcessBasicRow({...processBasicRow , manDays_average : '-'})
        }


    },[pauseBasicRow])

    React.useEffect(() => {
        dispatch(setMenuSelectState({main:"KPI",sub:router.pathname}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    return (
        <div>
            <PageHeader title={"작업공수(C)"} />
            <ExcelTable
                editable
                resizable
                headerList={[
                    ...processColumn
                ]}
                row={[processBasicRow]}
                setRow={(row) => {
                    setProcessBasicRow({...processBasicRow,
                        id : row[0].product?.product_id?? row[0].id,
                        customer_id : row[0].customer_id,
                        cm_id : row[0].cm_id,
                        code : row[0].code,
                        name: row[0].product_name?? row[0].name,
                        standard_production : row[0].standard_production?? 0
                    })
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={80}
            />
            <div style={{display:"flex", justifyContent:"space-between", margin:"15px 0"}}>
                {
                    processBasicRow.id
                        ? <span style={{color:"white", fontSize:22, fontWeight:"bold"}}>
                            작업이력별 작업공수 (검색 기간은 최대 3개월 입니다.)
                        </span>
                        : <span style={{color:"#ffffff58", fontSize:22, fontWeight:"bold"}}>
                            제품을 선택해주세요
                        </span>
                }
                <div style={{display: 'flex', }}>
                    <DateRangeCalendar selectDate={selectDate as SelectParameter} onChangeSelectDate={setSelectDate} dataLimit={false} />
                    <ButtonGroup buttons={['']} buttonsOnclick={buttonEvents}/>
                </div>
            </div>
            <ExcelTable
                editable
                resizable
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

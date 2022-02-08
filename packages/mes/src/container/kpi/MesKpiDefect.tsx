import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from "shared";
import moment from "moment";
import PeriodSelectCalendar from "../../../../main/component/Header/PeriodSelectCalendar";
import ButtonGroup from "../../../../main/component/ButtonGroup";
// @ts-ignore
import {SelectColumn} from "react-data-grid";

interface SelectParameter {
    from:string
    to:string
}


const MesKpiDefect = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any>({
        id: ''});
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiDefect`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiDefectContent`]);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf('isoWeek').format('YYYY-MM-DD'),
        to: moment(new Date()).endOf('isoWeek').format('YYYY-MM-DD')
    });

    const DefectLoad = async (productId: number) => {
        const res = await RequestMethod('get', `qualityDefectRateList`,{
            params: {
                productIds: productId,
                from: selectDate.from,
                to: selectDate.to
            },
        })


        // {key: 'osd_id', name: '지시 고유 번호', width:126},
        // {key: 'code', name: 'CODE', width:120, },
        // {key: 'name', name: '품명', width:120},
        // {key: 'process_id', name: '생산 공정', width: 120},
        // {key: 'lot_number', name: 'LOT 번호', width: 120,},
        // {key: 'user_id', name: '작업자', width:120, },
        // {key: 'start', name: '작업 시작 일시', width:120, },
        // {key: 'end', name: '작업 종료 일시', width:120, },
        // {key: 'paused_time', name: '일시 정지 시간', width:120},
        // {key: 'total_quantity', name: '생산 수량', width:120, formatter: UnitContainer, unitData: 'EA'},
        // {key: 'good_quantity', name: '양품 수량', width:120, formatter: UnitContainer, unitData: 'EA'},
        // {key: 'poor_quantity', name: '불량 수량', width:120, formatter: UnitContainer, unitData: 'EA'},
        // {key: "manufacturing_time", name: '제조리드타임 (초)', width: 120},
        // {key: "manufacturing_lead", name: '불량률(%)', width: 120},

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
                    total_quantity : v.total_quantity,
                    good_quantity: v.good_quantity,
                    poor_quantity: v.poor_quantity,
                    defective_rate : v.total_quantity !== 0 ? ((v.poor_quantity/v.total_quantity) * 100).toFixed(1) : '0.0'
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
            DefectLoad(processBasicRow.id)
        }

    },[processBasicRow.id,selectDate])


    React.useEffect(()=>{

        if(pauseBasicRow.length){
            
            const rowLenth = pauseBasicRow.length;
            let toalNumber = 0;
            let totalDefectNumber = 0;
            if(rowLenth){
                pauseBasicRow.map((row)=> {
                    toalNumber += row.total_quantity
                    totalDefectNumber += row.poor_quantity
                })
                    
                setProcessBasicRow({...processBasicRow , 
                    total_number : toalNumber,
                    total_defectNumber : `${totalDefectNumber}`, 
                    defectiveRate_average : `${((totalDefectNumber/toalNumber)*100).toFixed(1)}`})
            }
        }else{

            setProcessBasicRow({...processBasicRow , defectiveRate_average : '-' , total_defectNumber : '-' , total_number : '-'})
        }


    },[pauseBasicRow])


    return (
        <div>
            <PageHeader title={"품질 불량률(Q)"} />
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
                        name : row[0].product_name,
                        unit : row[0].unit
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
                            작업이력별 불량률
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

export {MesKpiDefect}

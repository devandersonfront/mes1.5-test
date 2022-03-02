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

const MesLeadtimeOrder = () => {
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any>({
        id: ''
    });
    const changeHeaderStatus = (value:number) => {
        setHeaderStatus(value);
    }

    const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeOrder`] );
    const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`kpiLeadtimeOrderContent`]);
    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
    const [headerStatus, setHeaderStatus] = useState<number | string>("");

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to: moment(new Date()).format('YYYY-MM-DD')
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


    const leadtimeOrder = async (productId: number) => {
        const res = await RequestMethod('get', `deliveryLoadTimeList`,{
            params: {
                productIds: productId,
                sorts : 'date',
                from: selectDate.from,
                to: selectDate.to
            },
        })

        if(res){
            const filterResponse = res.map((v)=>{

                return {
                    identification: v.identification,
                    date: v.date,
                    deadline: v.deadline,
                    amount: v.amount,
                    shipment_amount :v.shipment_amount,
                    shipment_date :v.shipment_date,
                    leadTime : (v.lead_time/86400).toFixed(1),
                }
            })
            setPauseBasicRow(filterResponse)
        }
    }

    React.useEffect(()=>{

        if(processBasicRow.id){
            leadtimeOrder(processBasicRow.id)
        }

    },[processBasicRow.id,selectDate])

    React.useEffect(()=>{

        if(pauseBasicRow.length){

            const rowLenth = pauseBasicRow.length;
            let sum = 0;
            if(rowLenth){
                pauseBasicRow.map((row)=> {
                    sum += row.leadTime
                })
                setProcessBasicRow({...processBasicRow , leadTime_average : `${Math.round(sum/rowLenth)}`})
            }
        }else{

            setProcessBasicRow({...processBasicRow , leadTime_average : '-'})
        }


    },[pauseBasicRow])


    return (
        <div>
            <PageHeader title={"수주/납품 리드타임(D)"} />
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
                            수주 정보별 리드타임                        </span>
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

export {MesLeadtimeOrder}

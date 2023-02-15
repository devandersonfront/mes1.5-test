import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared";
import {IExcelHeaderType} from "shared/src/@types/type"
import moment from "moment";
import ButtonGroup from 'shared/src/components/ButtonGroup';
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import DateRangeCalendar from "../../../../shared/src/components/Header/DateRangeCalendar";
import Notiflix from "notiflix";
import {useRouter} from "next/router";
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import DropDown from "shared/src/components/Dropdown/DropDown";


interface SelectParameter {
    from:string
    to:string
}


const MesKpiOperation = () => {
    const router = useRouter()
    const dispatch = useDispatch()


    const [entireRow , setEntireRow] = useState<any[]>([])
    const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
    const [processBasicRow, setProcessBasicRow] = useState<any>({id: ''});
    const [dropDown , setDropDown] = useState<string[]>([])

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
        from: moment(new Date()).subtract(1,'month').format('YYYY-MM-DD'),
        to: moment(new Date()).subtract(1,"day").format('YYYY-MM-DD')
    });

    const makeDropDownList = (rows) => {
        const rowCodes = rows.map((row)=> row.code)
        const dropDownList = rowCodes.filter((v, i) => rowCodes.indexOf(v) === i);
        setDropDown(['전체',...dropDownList])
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

    const RequestOperationApi = async (productId: number) => {
        if(moment(selectDate.from).add(3,'month') < moment(selectDate.to)){
            return Notiflix.Report.warning("경고", "최대 검색 기간을 초과하였습니다.", "확인",)
        }
        const res = await RequestMethod('get', `productCapacityUtilizationList`,{
            params: {
                machineIds: productId,
                from: selectDate.from,
                sorts : 'date',
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
                    paused_time: 0,
                    good_quantity: v.good_quantity,
                    poor_quantity: v.poor_quantity,
                    operation : v.cu_rate
                }
            })


            setPauseBasicRow(filterResponse)
            makeDropDownList(filterResponse)
            setEntireRow(filterResponse)
        }
    }

    React.useEffect(()=>{

        if(processBasicRow.id){
            RequestOperationApi(processBasicRow.id)
        }

    },[processBasicRow.id,selectDate])

    React.useEffect(()=>{

        if(pauseBasicRow.length){

            const rowLenth = pauseBasicRow.length;
            let sum = 0;
            if(rowLenth){
                pauseBasicRow.map((row)=> {
                    sum += Number(row.operation)
                })
                setProcessBasicRow({...processBasicRow , operation_average : `${Math.round(sum/rowLenth)}`})
            }
        }else{

            setProcessBasicRow({...processBasicRow , operation_average : '-'})
        }


    },[pauseBasicRow])

    React.useEffect(() => {
        dispatch(setMenuSelectState({main:"KPI",sub:router.pathname}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const filterRows = (index : number) => {
        if(index === 0){
            return setPauseBasicRow(entireRow)
        }
        setPauseBasicRow(entireRow.filter((row)=>row.code === dropDown[index]))
    }

    return (
        <div className={'excelPageContainer'}>
            <PageHeader title={"설비가동률(P)"} />
            <ExcelTable
                editable
                resizable
                headerList={processColumn}
                row={[processBasicRow]}
                setRow={(row) => {
                    console.log('row',row)
                    setProcessBasicRow({...processBasicRow,
                        id : row[0].machine_id,
                        mfrName : row[0].mfrName,
                        name : row[0].name,
                        mfrCode : row[0].mfrCode,
                        // undefined 나옴
                        machine_type: row[0].type ?? '-',
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
                            작업이력별 설비가동률 (검색 기간은 최대 3개월 입니다.)
                        </span>
                        : <span style={{color:"#ffffff58", fontSize:22, fontWeight:"bold"}}>
                            제품을 선택해주세요
                        </span>
                }
                <div style={{display: 'flex', }}>
                    <DropDown items={processBasicRow.id ? dropDown : []} onClick={(index)=>filterRows(index)}>
                        <span style={{marginLeft: 10,fontSize: '30px', color: 'white', fontWeight: 'bold'}} className="material-symbols-outlined">more_vert</span>
                    </DropDown>
                    <DateRangeCalendar selectDate={selectDate as SelectParameter} onChangeSelectDate={setSelectDate} dataLimit={false} />
                    <ButtonGroup buttons={['']} buttonsOnclick={buttonEvents}/>
                </div>
            </div>
            <ExcelTable
                editable
                resizable
                selectable
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

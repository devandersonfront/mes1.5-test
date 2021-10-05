import React, {useEffect, useState} from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import PageHeader from "../../../../component/Header/Header";
import ExcelTable from "../../../../component/Excel/ExcelTable";
import {RequestMethod} from "../../../../common/RequestFunctions";
import {columnlist} from "../../../../common/columnInit";
import {IExcelHeaderType} from "../../../../common/@types/type";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {ScrollSync, ScrollSyncPane} from "react-scroll-sync";
import ProductTitleFomatter from "../../../../component/Formatter/ProductTitleFomatter";
import moment from "moment";
import UnitContainer from "../../../../component/Unit/UnitContainer";
import {excelDownload} from "../../../../common/excelDownloadFunction";
import TitleCreateModal from "../../../../component/Modal/TitleCreateModal";
import StockSearchModal from "../../../../component/Modal/StockSearchModal";
import TextEditor from "../../../../component/InputBox/ExcelBasicInputBox";

const Productlist = () => {

    const [state, setState] = useState<"local" | "select">("local");
    const [rowData, setRowData] = useState<any[]>([]);
    const [dateData, setDateData] = useState<any[]>([]);
    const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.stockProduct);
    const [dateColumn, setDateColumn] = useState<Array<IExcelHeaderType>>(columnlist.stockDate);

    const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());

    const [selectMonth, setSelectMonth] = useState<string>(moment(new Date()).startOf("month").format('YYYY-MM'))

    const changeSelectMonth = (value:string) => {
        setSelectMonth(value);
    }

    const [keyword, setKeyword] = useState<string>("");
    const [option, setOption] = useState<number>(0)

    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
        to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
    });

    const [onTitleModal, setOnTitleModal] = useState<boolean>(false);

    const [onDataLoadModal, setOnDataLoadModal] = useState<boolean>(false);

    const changeSelectDate = (from:string, to:string) => {
        setSelectDate({from:from, to:to});
    }

    const [modalResult, setModalResult] = useState<any>();

    const [excelTableWidths, setExcelTableWidths] = useState<{model:number, data:number}>({model:0, data:0});

    const [onHide, setOnHide] = useState<boolean>(false);

    const LoadData = async() => {
        Notiflix.Loading.standard();
        const res = await RequestMethod('get', 'stockProductList', {
            path:{
              tab:"ROLE_STK_03"
            },
            params:{
                keyword:keyword,
                opt:option,
                from:selectDate.from,
                to:selectDate.to
            }
        });

        if(res && res.status === 200 ){
            // if(res.results.summaries.length > 0){
            cleanUpData(res, "model");
            cleanUpData(res, "date");
            // }
            Notiflix.Loading.remove(300);
        }
    }

    const SelectLoadData = async() => {

        Notiflix.Loading.standard();
        const res = await RequestMethod('get', 'summaryFetch', {
            path:{
                tab:"ROLE_STK_03",
                summary_id:modalResult.summary_id,
            },
            params:{
                keyword:keyword ?? "",
                opt:option,
                from:modalResult.from,
                to:modalResult.to
            }
        })
        if(res && res.status === 200 ){
            // if(res.results.summaries.length > 0){
            cleanUpData(res, "model");
            cleanUpData(res, "date");
            // }
            Notiflix.Loading.remove(300);
        }
    }

    const cleanUpData = async(res: any, version:string) => {
        let tmpColumn = columnlist.stockProduct;
        let tmpRow = [];
        let tmpRow_date = [];
        let result = [];
        let totalWidth = 0;
        switch (version){
            case "model":
                tmpColumn = columnlist.stockProduct.map((column: any, index) => {
                    let menuData: object | undefined;
                    res.results.menus && res.results.menus.map((menu: any) => {
                        if(menu.colName === column.key){
                            menuData = {
                                id: menu.id,
                                name: menu.title,
                                width: menu.width,
                                tab:menu.tab,
                                unit:menu.unit,
                            }
                        } else if(menu.colName === 'id' && column.key === 'tmpId'){
                            menuData = {
                                id: menu.id,
                                name: menu.title,
                                width: menu.width,
                                tab:menu.tab,
                                unit:menu.unit
                            }
                        }
                    })

                    if(menuData){
                        return {
                            ...column,
                            ...menuData
                        }
                    }
                }).filter((v:any) => v)

                tmpColumn.map((v)=>{
                    totalWidth +=v.width
                })
                setExcelTableWidths({data:1576-totalWidth, model:totalWidth})
                setColumn([...tmpColumn]);

                break;
                return
            case "date":

                if(res.results.summaries.length > 0){
                    tmpColumn = res.results.summaries[0].statistics.logs.map((col)=>{
                        result.push(
                            {key:col.date, name:col.date, editor: TextEditor, formatter: UnitContainer, unitData: 'EA', width:100},
                        );
                    })
                    setDateColumn([
                        {key:"title", name:"생산/납품", formatter:ProductTitleFomatter, width:100, frozen:true},
                        {key:"carryforward", name:"전월 이월", width:100, formatter: UnitContainer, unitData:"EA", frozen:true},
                        {key:"total", name:"합계", width:100, formatter: UnitContainer, unitData:"EA", frozen:true},
                        ...result,
                    ]);
                    result = [];
                }else{
                    result = [];

                }
                break;
                return
            default :
                break;
                return
        }

        tmpRow = res.results.summaries

        let tmpBasicRow_model = tmpRow.map((row: any, index: number) => {
            let random_id = Math.random()*1000;
            const summary_id = res.results.summary_id ?? undefined;
            return {
                ...row,
                customer_id: (index === 0 || tmpRow[index-1].product.raw_material.model.customer.customer_id !== row.product.raw_material.model.customer.customer_id) ?
                    row.product.raw_material.model.customer.name : undefined,
                customer_idPK: row.product.raw_material.model.customer.customer_id,
                cm_id:row.product.raw_material.model.model,
                cm_idPK: row.product.raw_material.model.cm_id,
                model:row.product.raw_material.model.model,
                code:row.product.raw_material.code,
                name: row.product.raw_material.name,
                summary_id: summary_id,
                id: `product_${random_id}`,
            }
        })

        tmpRow.map((row: any, index: number) => {
            let random = Math.random()*1000;
            let tmp_row_produced = {};
            let tmp_row_shipped = {};
            row.statistics.logs.map((log)=>{
                tmp_row_produced[log.date] = log.produced;
                tmp_row_shipped[log.date] = log.shipped;
            })

            tmp_row_produced["carryforward"] = row.statistics.carryforward;
            tmp_row_produced["total"] = row.statistics.total_produced + row.statistics.carryforward;
            tmp_row_shipped["total"] = row.statistics.total_shipped;

            tmpRow_date.push({
                title:"생산",
                id: `product_${random}`,
                ...tmp_row_produced
            })

            tmpRow_date.push({
                title:"납품",
                id: `product_${random+1}`,
                ...tmp_row_shipped
            })
        })


        if(version === "model"){
            setRowData([...tmpBasicRow_model])
        }else if(version === "date"){
            setDateData([...tmpRow_date]);
        }
    }

    const downloadExcel = () => {
        let tmpSelectList: boolean[] = []
        let tmpSelectListData:any[] = []
        rowData.map(row => {
            tmpSelectList.push(selectList.has(row.id))
            tmpSelectList.push(selectList.has(row.id))
            // if(selectList.has(row.id)){
                let sumProducedObject:any = {};
                let sumShippedObject:any = {};
                Object.keys(row).map((value)=>{
                    if(value === "statistics"){
                        row[value].logs.map((data)=>{
                            sumProducedObject[data.date] =  data.produced;
                            sumShippedObject[data.date] = data.shipped;
                        })
                    }else{
                        sumProducedObject[value] = row[value];
                    }
                })

                sumProducedObject["title"] = "생산";
                sumProducedObject["carryforward"] = row.statistics.carryforward;
                sumProducedObject["total"] = row.statistics.total_produced;

                sumShippedObject["title"] = "납품";
                // sumShippedObject["carryforward"] = row.statistics.carryforward;
                sumShippedObject["total"] = row.statistics.total_shipped;

                tmpSelectListData.push(sumProducedObject);
                tmpSelectListData.push(sumShippedObject);
            // }
        })
        excelDownload([...column, ...dateColumn], tmpSelectListData, `${selectDate.from} ~ ${selectDate.to} 생산/납품 현황(관리자)`, `${selectDate.from} ~ ${selectDate.to}`, tmpSelectList)
    }

    const buttonClickEvents = async(number:number) => {
        switch (number){
            case 0:
                setOnDataLoadModal(true)
                return
            case 1:
                let selectIndex = [];

               let tmp = rowData.map((value,index)=>{
                    if(selectList.has(value.id)){
                        return
                    }else{
                        selectIndex.push(index);
                        return {...value};
                    }

                }).filter((v)=>v)

               let temp = [];
               selectIndex.reverse().map((value,index)=>{
                   temp.push(dateData[value*2]);
                   temp.push(dateData[value*2+1]);
               })

                if(!onHide){
                    setDateData([...temp])

                   setRowData([...tmp]);
                }else{
                    if(state === "local"){
                        LoadData();
                    }else if(state === "select"){
                        SelectLoadData();
                    }

                }
                setOnHide(!onHide);


                return
            case 2:
                setOnTitleModal(true);

                return
            case 3:
                downloadExcel()
                return
            default:
                return
        }
    }

    useEffect(()=>{
        if(state === "local"){
            LoadData();
        }else if(state === "select"){
            SelectLoadData();
        }
    },[selectDate, keyword])

    useEffect(()=>{
        let modelWidth = 0;
        column.map((v)=>{
            modelWidth += v.width;
        })
            modelWidth += 36;
        setExcelTableWidths({...excelTableWidths,data:1576-modelWidth, model:modelWidth})

    },[column])

    useEffect(()=>{
        dateData.map((v,i)=>{
            Object.keys(v).map((key,index)=>{
                if(index > 1 && index < Object.keys(v).length-2 && rowData[Math.floor(i/2)].statistics.logs[index-2]){
                    if(v.title === "생산"){
                        rowData[Math.floor(i/2)].statistics.logs[index-2].produced = Number(v[key]);
                    }else if(v.title === "납품"){
                        rowData[Math.floor(i/2)].statistics.logs[index-2].shipped = Number(v[key]);
                    }
                }
            })
        })
        setRowData([...rowData])

        // tmpRow.map((row: any, index: number) => {
        //     let random = Math.random()*1000;
        //     let tmp_row_produced = {};
        //     let tmp_row_shipped = {};
        //     row.statistics.logs.map((log)=>{
        //         tmp_row_produced[log.date] = log.produced;
        //         tmp_row_shipped[log.date] = log.shipped;
        //     })
        //     tmp_row_produced["total"] = row.statistics.total_produced;
        //     tmp_row_shipped["total"] = row.statistics.total_shipped;
        //
        //     tmpRow_date.push({
        //         title:"생산",
        //         id: `product_${random}`,
        //         ...tmp_row_produced
        //     })
        //
        //     tmpRow_date.push({
        //         title:"납품",
        //         id: `product_${random+1}`,
        //         ...tmp_row_shipped
        //     })
        // })
    },[dateData])

    return(
        <ScrollSync >
            <div style={{display:"flex"}}>
            {onTitleModal && <TitleCreateModal title={"저장할 데이터 제목"} changeState={setOnTitleModal} selectList={selectList} selectDate={selectDate} rowData={rowData} LoadData={LoadData} />}
            {onDataLoadModal && <StockSearchModal
                                    onDataLoadModal={onDataLoadModal}
                                    setOnDataLoadModal={setOnDataLoadModal}
                                    onChangeSelectDate={changeSelectDate}
                                    setModalResult={setModalResult}
                                    setState={setState}
                                    changeSelectMonth={changeSelectMonth}
                                />
            }
                <MenuNavigation pageType={'MES'} subType={3}/>
                <div style={{width:1576}}>
                    <ProfileHeader/>
                    <PageHeader
                        title={"생산/납품 현황(관리자용)"}
                        buttons={["데이터 불러오기", onHide ? "선택 행 숨김 취소" : "선택 행 숨김", "저장하기", "엑셀로 받기"]}
                        buttonsOnclick={buttonClickEvents}
                        isSearch={true}
                        searchOptionList={["고객사명","고객사 모델","CODE", "품명"]}
                        onChangeSearchOption={setOption}
                        isCalendar={true}
                        searchKeyword={keyword}
                        onChangeSearchKeyword={setKeyword}
                        calendarType={"month"}
                        onChangeSelectDate={changeSelectDate}
                        selectDate={selectMonth}
                        setSelectDate={changeSelectMonth}
                        setState={setState}
                        dataLimit={true}
                    />
                    {modalResult && modalResult.name && state === "select" &&
                        <p style={{color:"white", fontSize:"20px", fontWeight:"bold"}}>{modalResult.name}</p>
                    }
                    <div style={{display:"flex",justifyContent:"center"}}>
                        <ScrollSyncPane>
                            <ExcelTable headerList={[
                                            SelectColumn,
                                            ...column
                                        ]}
                                        setHeaderList={(value) => {
                                            // value.splice(0,1);
                                            value.map((v,i)=>{
                                                if(v.name === ""){
                                                    value.splice(i, 1);
                                                }
                                            })
                                            setColumn([...value])
                                        }}
                                        selectList={selectList}
                                        setSelectList={setSelectList}
                                        row={rowData} setRow={setRowData} width={excelTableWidths.model} rowHeight={80} overflow={"hidden"}
                                        resizable
                            />
                        </ScrollSyncPane>
                        <ScrollSyncPane>
                            <ExcelTable headerList={dateColumn} row={dateData} setRow={setDateData} maxWidth={excelTableWidths.data} rowHeight={40} />
                        </ScrollSyncPane>
                    </div>
                </div>
            </div>
        </ScrollSync>
    );
}

export default Productlist;

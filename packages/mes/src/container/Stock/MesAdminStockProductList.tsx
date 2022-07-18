import React, {useEffect, useState} from 'react'
import {columnlist} from '../../../../main/common/columnInit'
import moment from 'moment'
import Notiflix from 'notiflix'
import {
  excelDownload,
  ExcelTable,
  Header as PageHeader, IExcelHeaderType,
  ProductTitleFomatter,
  ProfileHeader,
  RequestMethod,
  UnitContainer
} from 'shared'
import {ScrollSyncPane} from 'react-scroll-sync'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import TextEditor from '../../../../main/component/InputBox/ExcelBasicInputBox'
import TitleCreateModal from '../../../../main/component/Modal/TitleCreateModal'
import StockSearchModal from '../../../../main/component/Modal/StockSearchModal'

const MesAdminStockProductList = () => {
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


  const LoadMenu = async() => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', 'loadMenu', {
      path:{
        tab: 'ROLE_STK_02'
      }
    });

    return res.bases
  }

  const LoadData = async(menus?: any[]) => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', 'stockAdminList', {
      params:{
        keyword:keyword,
        opt:option,
        from:selectDate.from,
        to:selectDate.to
      }
    });

    if(res){
      let tmpRes = {}
      let tmpRow = []
      if(typeof res === 'string'){
        let tmpRowArray = res.split('\n')

        tmpRow = tmpRowArray.map(v => {
          if(v !== ""){
            let tmp = JSON.parse(v)
            return tmp
          }
        }).filter(v=>v)
      }else{
        tmpRow = [...res]
      }

      tmpRes = {
        menus: menus,
        summaries: tmpRow
      }

      cleanUpData(tmpRes, "model")
      cleanUpData(tmpRes, "date");

      // Notiflix.Loading.remove(300);
    }
  }

  const SelectLoadData = async() => {

    Notiflix.Loading.circle();
    const res = await RequestMethod('get', 'stockAdminList', {
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
    if(res ){
      // if(res.results.summaries.length > 0){
      cleanUpData(res, "model");
      cleanUpData(res, "date");
      // }
      // Notiflix.Loading.remove(300);
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
          res.menus && res.menus.map((menu: any) => {
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
        // Notiflix.Loading.remove(300);
        break;
        return
      case "date":

        if(res.summaries.length > 0){
          tmpColumn = res.summaries[0].statistics?.logs?.map((col)=>{
            result.push(
              {key:col.date, name:col.date, editor: TextEditor, formatter: UnitContainer, unitData: 'EA', width:118, type:"stockAdmin"},
            );
          })
          setDateColumn([
            {key:"title", name:"생산/납품", formatter:ProductTitleFomatter, width:100, frozen:true},
            {key:"carryforward", name:"전월 이월", width:100, formatter: UnitContainer, unitData:"EA", frozen:true},
            {key:"total", name:"합계", width:100, formatter: UnitContainer, unitData:"EA", frozen:true},
            ...result,
          ]);
          // Notiflix.Loading.remove(300);
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

    tmpRow = res.summaries
    let tmpBasicRow_model = tmpRow.map((row: any, index: number) => {
      return {
        ...row,
        customer_id: row.product?.model?.customer?.name ?? "-",
        customer_name: row.product?.model?.customer?.name ?? "-",
        customer_idPK: row.product?.model?.customer?.id ?? "-",
        cm_id:row.product?.model?.model ?? "-",
        cm_idPK:row.product?.model?.model ?? "-",
        customer_model:row.product?.model?.model ?? "-",
        code:row.product?.code ?? "-",
        name: row.product?.name ?? "-",

        id: row.product.product_id,
      }
    })

    tmpRow.map((row: any, index: number) => {
      let random = Math.random()*1000;
      let tmp_row_produced = {total: row.statistics?.carryforward};
      let tmp_row_shipped = {total: 0};
      row.statistics?.logs.map((log)=>{
        tmp_row_produced[log.date] = log.produced;
        tmp_row_shipped[log.date] = log.shipped;

        tmp_row_produced["total"] += log.produced
        tmp_row_shipped["total"] += log.shipped
      })

      tmp_row_produced["carryforward"] = row.statistics?.carryforward;

      tmpRow_date.push({
        title:"생산",
        id: `product_${random}`,
        product_id:row.product.product_id,
        ...tmp_row_produced
      })

      tmpRow_date.push({
        title:"납품",
        id: `product_${random+1}`,
        product_id:row.product.product_id,
        ...tmp_row_shipped
      })
    })


    if(version === "model"){
      setRowData([...tmpBasicRow_model])
    }else if(version === "date"){
      setDateData([...tmpRow_date]);
    }
  }


  const buttonClickEvents = async(number:number) => {
    switch (number){
      case 0:
        setOnDataLoadModal(true)
        return
      case 1:
        let summaries = [];
        const summary_id = rowData[0].summary_id ?? undefined;
        dateData.map((rowData) => {
          // if(selectList.has(rowData.product_id)){
            let rowDataArray = []
            rowData?.changeRows?.map((oneRow) => {
              let oneData:{run_date:string, product_id:string, type:number, count:number} = {run_date:"", product_id:"", type:1, count:0}
              oneData.run_date = oneRow
              oneData.product_id = rowData.product_id
              oneData.type = rowData.title === "생산" ? 1 : 2
              oneData.count = Number(rowData[oneRow])
              rowDataArray.push(oneData)
            })
            summaries.push(...rowDataArray)
          // }
        })

        await RequestMethod('post', "stockSummarySave", summaries)
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
            })

        // Notiflix.Report.success("저장되었습니다.", "", "확인", () => {
        //   LoadMenu().then((menus) => {
        //     LoadData(menus).then(() => {
        //       Notiflix.Loading.remove()
        //     }).then(() => {
        //       Notiflix.Loading.remove()
        //     })
        //   })
        // });

        return
      default:
        return

    }
  }



  useEffect(()=>{
    if(state === "local"){
      LoadMenu().then((menus) => {
        LoadData(menus).then(() => {
          // Notiflix.Loading.remove()
        }).then(() => {
          Notiflix.Loading.remove()
        })
      })
    }else if(state === "select"){
      SelectLoadData();
    }
  },[selectDate, keyword])

  useEffect(()=>{
    let modelWidth = 0;
    column.map((v)=>{
      modelWidth += v.width;
    })
    // modelWidth += 36;
    setExcelTableWidths({...excelTableWidths,data:1576-modelWidth, model:modelWidth})

  },[column])

  // useEffect(()=>{
  //   console.log("dateData : ", dateData, rowData)
  //   dateData.map((v,i)=>{
  //     Object.keys(v).map((key,index)=>{
  //       if(index > 2 && index < Object.keys(v).length-2 && rowData[Math.floor(i/2)].statistics.logs[index-2]){
          // if(v.title === "생산"){
          //   rowData[Math.floor(i/2)].statistics.logs[index-3].produced = Number(v[key]);
          // }else if(v.title === "납품"){
          //   rowData[Math.floor(i/2)].statistics.logs[index-3].shipped = Number(v[key]);
          // }
        // }
      // })
    // })
    // setRowData([...rowData])
  // },[dateData])

  return (<div style={{width:1576}}>
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
      <ProfileHeader/>
      <PageHeader
        title={"생산/납품 현황(관리자용)"}
        buttons={["", "저장하기", ""]}
        buttonsOnclick={buttonClickEvents}
        isSearch={true}
        searchOptionList={["거래처","모델","CODE", "품명"]}
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
          <ExcelTable headerList={column}
                      setHeaderList={(value) => {
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
                      // resizable
          />
        </ScrollSyncPane>
        <ScrollSyncPane>
          <ExcelTable headerList={dateColumn} row={dateData} setRow={(e) => {
            setDateData(e)
          }} maxWidth={excelTableWidths.data} rowHeight={40} />
        </ScrollSyncPane>
      </div>
    </div>)
}

export {MesAdminStockProductList}

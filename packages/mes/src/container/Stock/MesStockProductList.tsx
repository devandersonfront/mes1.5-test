import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import moment from 'moment'
import Notiflix from 'notiflix'
import {
  excelDownload,
  ExcelTable, columnlist,
  Header as PageHeader, IExcelHeaderType,
  ProductTitleFomatter,
  ProfileHeader,
  RequestMethod,
  UnitContainer, TextEditor
} from 'shared'
import {ScrollSyncPane} from 'react-scroll-sync'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "../../../../shared/src/reducer/menuSelectState";

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
  type?: 'admin' | null
}

const MesStockProductList = ({type}: IProps) => {
  const router = useRouter();
  const dispatch = useDispatch()
  const [rowData, setRowData] = useState<any[]>([]);
  const [dateData, setDateData] = useState<any[]>([]);
  const [column, setColumn] = useState<Array<IExcelHeaderType>>(columnlist.stockProduct);
  const [dateColumn, setDateColumn] = useState<Array<IExcelHeaderType>>(columnlist.stockDate);

  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
  const [keyword, setKeyword] = useState<string>("");
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [selectMonth, setSelectMonth] = useState<string>(moment(new Date()).startOf("month").format('YYYY-MM'))

  const changeSelectMonth = (value:string) => {
    setSelectMonth(value);
  }
  const [excelTableWidths, setExcelTableWidths] = useState<{model:number, data:number}>({model:0, data:0});
  const isAdminPage = type === 'admin'
  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment(new Date()).startOf("month").format('YYYY-MM-DD'),
    to: moment(new Date()).endOf("month").format('YYYY-MM-DD')
  });

  useEffect(() => {
    loadData()
  }, [selectMonth])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"재고 관리",sub:router.pathname}))
    return(() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

  const changeSelectDate = (from:string, to:string) => {
    setSelectDate({from:from, to:to});
  }

  const loadMenu = async() => {
    const res = await RequestMethod('get', 'loadMenu', {
      path:{
        tab: 'ROLE_STK_02'
      }
    });

    return res.bases
  }

  const loadData = async() => {
    Notiflix.Loading.circle();
    const res = await RequestMethod('get', isAdminPage ? 'stockAdminList' : 'stockProductList', {
      params:{
        keyword:keyword,
        opt:optionIndex,
        from:selectDate.from,
        to:selectDate.to
      }
    });

    if(res){
      let tmpRow
      if(typeof res === 'string'){
        let tmpRows = res.split('\n')

        tmpRow = tmpRows.map(row => {
          if(row !== ""){
            return JSON.parse(row)
          }
        }).filter(v=>v)
      }else{
        tmpRow = res
      }
      const newRes = {
        menus: await loadMenu(),
        summaries: tmpRow
      }

      cleanUpData(newRes, "model")
      cleanUpData(newRes, "date");
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

        break;
        return
      case "date":
        if(res.summaries.length > 0){
          tmpColumn = res.summaries[0]?.statistics?.logs?.map((col)=>{
            result.push(
              isAdminPage ? {key:col.date, name:col.date, editor: TextEditor, formatter: UnitContainer, unitData: 'EA', width:118, inputType:'number', type:'stockAdmin'}
              :{key:col.date, name:col.date, formatter: UnitContainer, unitData: 'EA', width:100},
            );
          })
          setDateColumn([
            {key:"title", name:"생산/납품",formatter:ProductTitleFomatter, width:100, frozen:true},
            {key:"carryforward", name:"전월 이월", formatter: UnitContainer, unitData:"EA",frozen:true},
            {key:"total", name:"합계", formatter: UnitContainer, unitData: 'EA',width:100, frozen:true},
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

    tmpRow = res.summaries


    let tmpBasicRow_model = tmpRow.map((row: any, index: number) => {
      let random_id = Math.random()*1000;
      return {
        ...row,
        customer_name: row.product?.customer?.name ?? "-",
        customer_model:row.product?.model?.model ?? "-",
        model:row.product?.model?.model ?? "-",
        code:row.product?.code ?? "-",
        product_id:row.product?.code ?? "-",
        name: row.product?.name ?? "-",
        id: `product_${random_id}`,
      }
    })
    tmpRow.map((row: any, index: number) => {
      let random = Math.random()*1000;
      let tmp_row_produced = {};
      let tmp_row_shipped = {};
      row?.statistics?.logs?.map((log)=>{
        tmp_row_produced[log.date] = log.produced;
        tmp_row_shipped[log.date] = log.shipped;
      })
      tmp_row_produced["carryforward"] = row?.statistics?.carryforward;
      tmp_row_produced["total"] = row?.statistics?.total_produced + row?.statistics?.carryforward;
      tmp_row_shipped["total"] = row?.statistics?.total_shipped;

      tmpRow_date.push({
        title:"생산",
        product_id:row.product.product_id,
        id: `product_${random}`,
        ...tmp_row_produced
      })

      tmpRow_date.push({
        title:"납품",
        product_id:row.product.product_id,
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
    excelDownload([...column, ...dateColumn], tmpSelectListData, `${selectDate.from} ~ ${selectDate.to} 생산/납품 현황`, `${selectDate.from} ~ ${selectDate.to}`, tmpSelectList)
  }
  const buttonClickEvents = async (number:number) => {
    switch (number){
      case 0:
        downloadExcel()
        return
      case 1:
        const postBody = dateData.map((data) => {
          return data.changeRows?.map((date) => {
            return {
              run_date: date,
              product_id: data.product_id,
              type: data.title === "생산" ? 1 : 2,
              count: Number(data[date])
            }
          })
        }).flatMap(postBody => postBody).filter(postBody => postBody)
        await RequestMethod('post', "stockSummarySave", postBody)
          .then((res) => {
            Notiflix.Report.success("저장되었습니다.", "", "확인");
            loadData()
          })
          .catch((err) => {
            console.log(err)
          })
        return
      default:
        return
    }
  }

  return (<div style={{width:1576}}>
    <ProfileHeader/>
    <PageHeader
      title={`생산/납품 현황${isAdminPage ? '(관리자용)' : ''}`}
      buttons={isAdminPage ? ["", "저장하기"] : [""]}
      buttonsOnclick={buttonClickEvents}
      isSearch={true}
      searchOptionList={["거래처", "모델",'',"품명"]}
      onChangeSearchOption={(optionIndex) => {
        setOptionIndex(optionIndex)
      }}
      isCalendar={true}
      onChangeSearchKeyword={setKeyword}
      onSearch={loadData}
      calendarType={"month"}
      onChangeSelectDate={changeSelectDate}
      selectDate={selectMonth}
      setSelectDate={changeSelectMonth}
      optionIndex={optionIndex}
      dataLimit={true}
    />
    <div style={{display:"flex",justifyContent:"center"}}>
      <ScrollSyncPane>
        <ExcelTable headerList={column}
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
                    // resizable
        />
      </ScrollSyncPane>
      <ScrollSyncPane>
        <ExcelTable headerList={dateColumn} row={dateData} setRow={setDateData} maxWidth={excelTableWidths.data} rowHeight={40}   />
      </ScrollSyncPane>
    </div>
  </div>)
}

export {MesStockProductList}

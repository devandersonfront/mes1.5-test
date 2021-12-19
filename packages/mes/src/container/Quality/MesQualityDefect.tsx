import React, {useEffect, useState} from 'react'
import {
  ExcelTable,
  Header as PageHeader,
  RequestMethod,
  columnlist,
  MAX_VALUE,
  DropDownEditor,
  TextEditor,
  excelDownload,
  PaginationComponent,
  ExcelDownloadModal,
  IExcelHeaderType, IItemMenuType
} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {loadAll} from 'react-cookies'
import {NextPageContext} from 'next'
import moment from 'moment'
import PeriodSelectCalendar from '../../../../main/component/Header/PeriodSelectCalendar'
import ButtonGroup from '../../../../main/component/ButtonGroup'

interface SelectParameter {
  from:string
  to:string
}

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const MesQualityDefect = ({page, keyword, option}: IProps) => {
  const router = useRouter()

  const changeHeaderStatus = (value:number) => {
    setHeaderStatus(value);
  }

  const [processBasicRow, setProcessBasicRow] = useState<any[]>([{
    id: '', customer_id: ''
  }]);
  const [processColumn, setProcessColumn] = useState<Array<IExcelHeaderType>>(columnlist[`qualityDefectTop`] );

  const [pauseBasicRow, setPauseBasicRow] = useState<any[]>([]);
  const [pauseColumn, setPauseColumn] = useState<Array<IExcelHeaderType>>(columnlist[`qualityDefectContents`].map(v => {
    if(v.key === 'amount'){
      return {
        ...v,
        result: changeHeaderStatus
      }
    }
    return v
  }));
  const [selectRow, setSelectRow] = useState<any>(-1);

  const [state, setState] = useState<boolean>(false);

  const [selectList, setSelectList] = useState<ReadonlySet<number>>(new Set());
  const [headerStatus, setHeaderStatus] = useState<number | string>("");

  const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
    from: moment(new Date()).startOf('isoWeek').format('YYYY-MM-DD'),
    to: moment(new Date()).endOf('isoWeek').format('YYYY-MM-DD')
  });

  const changeSelectDate = (from:string, to:string) => {

    setSelectDate({
      from:moment(new Date(from)).format('YYYY-MM-DD'),
      to:moment(new Date(to)).format('YYYY-MM-DD')
    })
  }

  useEffect(() => {
    console.log(processBasicRow)
    if(processBasicRow[0].product_id){
      LoadBasic().then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [processBasicRow, selectDate, headerStatus])

  const LoadPauseList = async (value:string) => {
    Notiflix.Loading.circle()
    const res = await RequestMethod("get", `defectReasonList`,{
      path: {
        page:1,
        renderItem:51,
        process_id:value
      }
    })

    if(res){
      let tmpColumn = columnlist[`defectReason`];
      tmpColumn = tmpColumn.map((value:any,index:number) => {
        return {...value, key:value.key, name:value.name, width:value.width}
      })
      setPauseColumn(tmpColumn);
      // tmpColumn.push({key:})
      let tmpRow = [];
      tmpRow = res.info_list.map((column: any,index:number) => {
        let menuData: object = {};

        menuData = {
          index:index+1,
          width: column.width,
          // id:Math.random()*100
          // id: info.ppr_id,
          // name: info.reason,
        }
        let random_id = Math.random()*1000;
        return {
          id: random_id,
          ...column,
          ...menuData
        }
      })
      setPauseBasicRow([...tmpRow]);
    }
  }

  const LoadBasic = async () => {
    Notiflix.Loading.circle()

    const res = await RequestMethod('get', `defectList`,{
      path: {
        product_id: processBasicRow[0].product_id,
        // process_id: processBasicRow[0].process_idPK,
        // pdr_id: processBasicRow[0].pdr_idPK
      },
      params: {
        opt: headerStatus,
        from: selectDate.from,
        to: selectDate.to,
      }
    })
    console.log(res)

    let row = [];
    if(typeof res === 'string'){
      let tmpRowArray = res.split('\n')

      row = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      row = [{...res}]
    }
    if(row){
      let tmpColumn = columnlist[`defectReason`];
      let tmpRow = []

      tmpRow = res.results

      if(row.length >= 0){
        // setPauseBasicRow(tmpRow.map(v => {
        setPauseBasicRow(row.map(v => {
          let random_id = Math.random() * 1000
          // LoadPauseList(v.process.process_id).then(() => {
          //   Notiflix.Loading.remove()
          // })
          return {
            ...v,
            id: `processDefect_${random_id}`,
            reason: v.pdr.reason,
            process_id: v.process.name
          }

        }))
      }
    }
  }

  const downloadExcel = () => {
    let tmpSelectList: boolean[] = []
    pauseBasicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(pauseColumn, pauseBasicRow, `불량통계`, "불량통계", tmpSelectList)
  }

  const buttonEvents = async(index:number) => {
    switch (index) {
      case 1 :
        downloadExcel()
        return
      case 0 :
        let deleteBasicRow = pauseBasicRow.map(row => {
          if(selectList.has(row.id)){
            return
          }else{
            return {
              ...row,
            }
          }
        }).filter(v => v)

        setPauseBasicRow([...deleteBasicRow])
        return
    }
  }

  const sortObject = (object:any) => {
    const compare_qty = (a:any, b:any) => {
      // a should come before b in the sorted order
      if(a.lengthIndex < b.lengthIndex){
        return -1;
        // a should come after b in the sorted order
      }else if(a.lengthIndex > b.lengthIndex){
        return 1;
        // a and b are the same
      }else{
        return 0;
      }
    }

    object.sort(compare_qty)
    let sortData = object.map((v:object, index:number)=>{
      return {...v, index:index+1, lengthIndex:index+1}
    });
    setPauseBasicRow([...sortData]);
  }

  useEffect(() => {
    Notiflix.Loading.remove()
  }, [])

  return (
    <div>
      <PageHeader title={"불량 통계"} />
      <ExcelTable
        editable
        resizable
        headerList={[
          SelectColumn,
          ...processColumn
        ]}
        row={processBasicRow}
        setRow={(e) => {
          console.log("e : ", e)
          const tmpBasicRow = [...e];
          console.log("tmpBasicRow : ", tmpBasicRow)
          tmpBasicRow[0] = {
            ...tmpBasicRow[0],
            // customer: tmpBasicRow[0].customer.name,
            // customerData: tmpBasicRow[0].customer,
            // model: tmpBasicRow[0].model.model,
            // modelData: tmpBasicRow[0].model,
            product_id: tmpBasicRow[0].product.product_id
          }
          console.log("tmpBasicRow : ", tmpBasicRow)
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
          <ButtonGroup buttons={['엑셀로 받기']} buttonsOnclick={buttonEvents}/>
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
          setState(true)
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
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

export {MesQualityDefect};

import React, {useEffect, useState} from 'react'
import {columnlist, excelDownload, ExcelTable, Header as PageHeader, IExcelHeaderType, RequestMethod} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import {NextPageContext} from 'next'
import moment from 'moment'
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";
import {PeriodSelectCalendar} from 'shared/src/components/Header/PeriodSelectCalendar';
import ButtonGroup from 'shared/src/components/ButtonGroup';

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
  const dispatch = useDispatch()
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
    from: moment().subtract(1,'month').format('YYYY-MM-DD'),
    to: moment().format('YYYY-MM-DD')
  });
  const changeSelectDate = (from:string, to:string) => {

    setSelectDate({
      from:moment(new Date(from)).format('YYYY-MM-DD'),
      to:moment(new Date(to)).format('YYYY-MM-DD')
    })
  }

  useEffect(() => {
    if(processBasicRow[0].product_id){
      LoadBasic().then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [processBasicRow, selectDate, headerStatus])

  useEffect(() => {
    dispatch(setMenuSelectState({main:"품질 관리",sub:router.pathname}))
    return (() => {
      dispatch(deleteMenuSelectState())
    })
  },[])

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
      row = [...res]
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
            reason: v.pdr?.reason,
            process_id: v.process?.name
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
      <PageHeader title={"불량 통계 (자주검사 관리)"} />
      <ExcelTable
        editable
        resizable
        selectable
        headerList={[
          SelectColumn,
          ...processColumn
        ]}
        row={processBasicRow}
        setRow={(e) => {
          const tmpBasicRow = [...e];
          tmpBasicRow[0] = {
            ...tmpBasicRow[0],
            product_id: tmpBasicRow[0].product.product_id,
            name: tmpBasicRow[0].product_name
          }
          setProcessBasicRow(tmpBasicRow)
        }}
        selectList={selectList}
        //@ts-ignore
        setSelectList={setSelectList}
        width={1576}
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
          setState(true)
          setPauseBasicRow(e)
        }}
        width={1576}
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

import {useEffect, useState} from 'react'
import styled from "styled-components";
// @ts-ignore
import DataGrid, {TextEditor, Row, RowRendererProps} from 'react-data-grid'
import {IExcelHeaderType} from '../../@types/type'
import {SearchModalStyle} from '../../styles/styledComponents'
import {RequestMethod} from "../../common/RequestFunctions";
//@ts-ignore
import ScrollState from "AdazzleReactDataGrid.ScrollState";
import {columnlist} from "../../common/columnInit";

interface IProps {
  headerList: Array<IExcelHeaderType>
  setHeaderList?:(value:Array<IExcelHeaderType>) => void
  row: Array<any>
  width?: number | string
  maxWidth?:number
  rowHeight?: number
  height?:number
  maxHeight?:number
  editable?: boolean
  resizable?: boolean
  resizeSave?:boolean
  selectable?: boolean
  setRow: (row: Array<any>) => void
  setSelectRow?: (index: number) => void
  setSelectList?: (selectedRows: ReadonlySet<number>) => void
  selectList?: ReadonlySet<number>
  type?: 'searchModal'
  disableVirtualization?: boolean
  selectPage?:number
  setSelectPage?:(value:number)=>void
  overflow?:"hidden"
  headerAlign?: string
  clickable?:boolean
  scrollEnd?:(value:boolean) => void
  scrollOnOff?:boolean
  customHeaderRowHeight?: number
}

const ExcelTable = ({customHeaderRowHeight,headerList, setHeaderList, row, width, maxWidth, rowHeight, height, maxHeight, editable, resizable, resizeSave, selectable, setRow, setSelectRow, selectList, setSelectList, type, disableVirtualization, selectPage, setSelectPage, overflow, headerAlign, clickable, scrollEnd, scrollOnOff}: IProps) => {
  const [ selectedRows, setSelectedRows ] = useState<ReadonlySet<number>>(selectList ?? new Set())


  useEffect(() => {
    setSelectedRows(selectList)
  }, [selectList])

  useEffect(() => {
    setSelectList && setSelectList(selectedRows)
  }, [ selectedRows ])

  const onePageHeight = 600;
  const rowKeyGetter = (row: any) => {
    return row?.id;
  }

  const scrollState = () => {
    if(overflow){
      return "0px"
    }else{
      return "8px"
    }

  }

  let tempData:any[] = [];





  useEffect(() => {
    let allWidth = 0
    headerList.map((v: any) => {
      allWidth += v.width
    })
  }, [headerList])

  function isAtBottom({ currentTarget }: React.UIEvent<HTMLDivElement>): boolean {
    return Math.ceil(currentTarget.scrollTop) >= currentTarget.scrollHeight - currentTarget.clientHeight;
  }

  function EmptyRowsRenderer() {
    return (
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center",background: type ? "white" : "#353B48", height:40, width: headerList.map(header => header.width).reduce(((prev, curr) => prev + curr)), gridColumn: '1/-1' ,color: type ? "black" : "none"}}>
          데이터가 없습니다.
        </div>
    );
  }

  const autoWidth:() => number = () => {
    return headerList.map((col) => col?.width)?.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
    )
  }

  const showDataGrid = () => {

    return <DataGridTable
      //@ts-ignore
      rowClass={(row) => row?.border ? 'selectRow' : undefined}
      headerRowHeight={customHeaderRowHeight ?? 40}
      //@ts-ignore
      rowKeyGetter={rowKeyGetter}
      //@ts-ignore
      className={'cell'}
      columns={headerList}
      rows={row.length > 0 ? row : []}
      emptyRowsRenderer={() => EmptyRowsRenderer()}
      onColumnResize={(v, i) => {
        tempData.map((time,i)=>{
            clearTimeout(time)
        })
        tempData.push(
            setTimeout(()=>{
              const tmpHeader = [];
              headerList.map((value,index)=>{
                let tmpOneLine:any = {};
                if(value.key !== "select-row"){
                  if(index === v){
                    tmpOneLine = {...value, mi_id:value.id, width:i <= 80 ? 80 : i,colName:value.key, title:value.name.split("(필수)")[0], hide:value.hide };
                  }
                  else if(value.type === "additional"){
                    tmpOneLine = {...value, mi_id:value.id, colName:value.key, title:value.name, hide:value.hide, tab:headerList[1].tab, version:headerList[1].version  };
                  }
                  else{
                    tmpOneLine = {...value, mi_id:value.id, colName:value.key, title:value.name.split("(필수)")[0], hide:value.hide };
                  }
                }
                tmpHeader.push(tmpOneLine);
              })
              headerList[v] = {...headerList[v], mi_id: headerList[v].id, width:i <= 80 ? 80 : i, }
              if(resizeSave) RequestMethod("post", "itemSave", tmpHeader.filter(v=>v.key)
              // {
              //         mi_id:headerList[v].id, width:i <= 80 ? 80 : i,title:tmpHeader, hide:false, unit:headerList[v].unitData, moddable: headerList[v].moddable
              //       }
              , undefined, undefined, undefined,headerList[v].tab )
                  .then((res)=> {
                    headerList[v].width = i <= 80 ? 80 : i;

                    setHeaderList && setHeaderList(headerList)
                  })
            },800)
        );
      }}
      rowHeight={rowHeight ?? 40}
      defaultColumnOptions={{
        resizable: resizable,
        editable: editable,
      }}
      onRowsChange={setRow}
      onSelectedRowsChange={setSelectedRows}
      selectedRows={selectedRows}
      onRowChange={(e:any)=>{
        setSelectedRows(e)
      }}
      onRowClick={(i, r) => {
        setSelectRow && setSelectRow(i)
      }}
      style={{
        border:"none",
        overflow:scrollOnOff ? "hidden" : "auto",
        // width: width ?? autoWidth ?? 1576,
        width: width ?? autoWidth() ?? 1576,
        maxWidth: maxWidth,
        height: height ?? 760,
        maxHeight:maxHeight,
        backgroundColor: '#00000000',
        textAlign: 'center',
      }}
      theme={scrollState}
      state={type}
      enableVirtualization={!disableVirtualization}
      //@ts-ignore
      onScroll={(e:ScrollState) => {
        scrollEnd && scrollEnd(isAtBottom(e))
      }}

      clickable={clickable}
    />
  }

  if(type === 'searchModal'){
    return <SearchModalStyle
      // @ts-ignore
      headerAlign={headerAlign}
    >
      {showDataGrid()}
    </SearchModalStyle>
  } else {
    return showDataGrid()
    // <ExcelDataStyle>
    // </ExcelDataStyle>
  }

}
//@ts-ignore
const DataGridTable = styled(DataGrid)`
  ::-webkit-scrollbar{
    display:block;
    width:${(props:any)=> props.theme};
    height:8px;
  }

  ::-webkit-scrollbar-thumb{
    background:#484848;
  }

  ::-webkit-scrollbar-track{
    background:none;
  }

  ::-webkit-scrollbar-corner{
    display:none;
  }

  .rdg-header-row > .rdg-cell {
    padding: 0 8px;
  }
  
  ${(props:any) => props.state === "searchModal" ? "" : 
    `
    .rdg{
        border:none;
        
    }
    .rdg-cell{
        border:none;
        margin-bottom:1px;
        border-right: 1px solid #151E2D;
        
    }
    
    .rdg-header-row{
        background:#111319;
        color:white;
        // grid-gap:1px;
        border:none;
        // grid-gap:1px;
    }
    
    .rdg-row {
        border:none;
        background:none;
        background-color:none;
        color:white;
        // grid-gap:1px;
        &:hover{
            background:none;
            background-color:none;
        }
        
    }
    .rdg-row > .rdg-cell{
        background:#353B48;
        &:hover{
          // opacity:50%;
          background-color: rgba(53,59,72,0.5);
          // background-color: #353B48;
        }
    }
    
    .rdg-row[aria-selected=true]{
        // border:1px solid white;
        background:none;
        &:hover{
            background:none;
            background-color:none;
        }
    }
    
    .editDropdown > option {
      background:#484848;
    }
   
    .rdg-row[aria-selected=true]{
        background:none;
    }

    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../../public/images/check_box_activated.png')}) ;
        background-size: 20px 20px;
    }
    
    .c1wupbe700-canary49 {
      padding: 0;
    }
    
  div .cell .rdg-row {
    background-color: #353B48;
  }
  
  .editCell {
    background-color: #00000000;
    color: white;
    width: 100%;
    height: 100%;
  }
  
  .editDropdown {
    background-color: #00000000;
    color: white;
    width: 100%;
    height: 100%;
  }
  .editDropdown > option {
    background:#484848;
  }
  `
}
    
  
`;

export {ExcelTable};

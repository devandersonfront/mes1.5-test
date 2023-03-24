import { useEffect, useState } from 'react'
import styled from "styled-components";
// @ts-ignore
import DataGrid, {
  Row,
} from 'react-data-grid'
import {IExcelHeaderType} from '../../@types/type'
import {SearchModalStyle} from '../../styles/styledComponents'
import {RequestMethod} from "../../common/RequestFunctions";
//@ts-ignore
import ScrollState from "AdazzleReactDataGrid.ScrollState";

interface IProps {
  className ?: string
  headerList: Array<IExcelHeaderType>
  setHeaderList?:(value:Array<IExcelHeaderType>) => void
  row: Array<any>
  width?: number | string
  maxWidth?:number
  rowHeight?: number
  height?:number | string
  maxHeight?:number
  editable?: boolean
  resizable?: boolean
  resizeSave?:boolean
  selectable?: boolean
  setRow?: (row: Array<any>, index: number) => void
  setSelectRow?: (index: number) => void
  setSelectList?: (selectedRows: ReadonlySet<number>) => void
  selectList?: ReadonlySet<number>
  type?: 'searchModal'| 'expandable'
  disableVirtualization?: boolean
  selectPage?:number
  setSelectPage?:(value:number)=>void
  overflow?:"hidden"
  headerAlign?: string
  clickable?:boolean
  scrollEnd?:(value:boolean) => void
  scrollOnOff?:boolean
  customHeaderRowHeight?: number
  onDoubleClick?: (row: Array<any>, col?:any) => void
  onRowClick?: (row: any) => void
}

const ExcelTable = ({className,customHeaderRowHeight,headerList, setHeaderList, row, width, maxWidth, rowHeight, height, maxHeight, editable, resizable, resizeSave, selectable, setRow, setSelectRow, selectList, setSelectList, type, disableVirtualization, selectPage, setSelectPage, overflow, headerAlign, clickable, scrollEnd, scrollOnOff, onDoubleClick, onRowClick}: IProps) => {
  const [ selectedRows, setSelectedRows ] = useState<ReadonlySet<number>>(selectList ?? new Set())

  useEffect(() => {
    setSelectedRows(selectList)
  }, [selectList])

  useEffect(() => {
    setSelectList && setSelectList(selectedRows)
  }, [ selectedRows ])

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

  let tempData:any[] = []


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
        <EmptyRows type={type} style={{width:Number(width)}}>
          데이터가 없습니다.
        </EmptyRows>
    );
  }

  const autoWidth:() => number = () => {
    return headerList.map((col) => col?.width)?.reduce(
        (previousValue, currentValue) => previousValue + currentValue,
    )
  }

  const expandRowsChange = (rows, {indexes}) => {
    const row = rows[indexes[0]];
    if (!row.expanded) {
      rows.splice(indexes[0] + 1, 1);
    } else {
      rows.splice(indexes[0] + 1, 0, {
        detail: row.detail,
        rowType: 'DETAIL',
        id: 'detail' + row.id,
      });
    }
    setSelectRow && setSelectRow(indexes)
    setRow(rows,indexes)
  }

  const showDataGrid = () => {

    return <DataGridTable
      //@ts-ignore
      rowClass={(row) => row?.border ? 'selectRow' : undefined}
      headerRowHeight={customHeaderRowHeight ?? 40}
      rowKeyGetter={rowKeyGetter}
      className={className}
      columns={headerList}
      rows={row?.length > 0 ? row : []}
      components={{noRowsFallback: <EmptyRowsRenderer />}}

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
      onRowsChange={(data, idx) => {
        if(data[idx.indexes[0]]?.hasOwnProperty('expanded') && !data[idx.indexes[0]]?.isChange){
          expandRowsChange(data,idx)
        }
        setSelectRow && setSelectRow(idx.indexes[0])
        setRow(data, idx.indexes[0])}}
      onSelectedRowsChange={(row) =>{
        setSelectedRows(row)}}
      selectedRows={selectedRows}
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
      onRowClick={(row,col) => {
        onRowClick && onRowClick(row)
      }}
      onRowDoubleClick={(row,col) => {
        onDoubleClick && onDoubleClick(row, col)
      }}
      enableVirtualization={!disableVirtualization}
      //@ts-ignore
      onScroll={(e:ScrollState) => {
        scrollEnd && scrollEnd(isAtBottom(e))
      }}
        //@ts-ignore
      rowClass={(row : any) => row?.color}
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
  
  .rdg-cell:has(+ .detail) .rdg-checkbox-label {
    display : none;
  }
  
  .detail {
    padding : 15px !important;
    background : #2d2d31 !important;
  }
  
  .detail + .rdg-cell > div {
    display : none !important;
  }
  .red .rdg-cell{
    background : #FF0000 !important;
  }
  .gray .rdg-cell{
     background : #7d7d7f !important;
  }
  .lightBlack .rdg-cell{
     background : #525555 !important;
  }
  .darkGray .rdg-cell{
     background : #282b2c !important;
  }

  ${(props:any) => props.state === "searchModal" ? `
    .rdg-checkbox-input:not(checked) + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:1px solid #b3b3b3;
        background: white;        
        outline: none;
    }
    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../../public/images/check_box_activated.png')}) ;
        background-size: 20px 20px;
        outline: none;
    }
    .rdg-cell{
        input{
          background-color: white;
          color: black;
        }
    }
   
  ` : 
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
        padding:0px;
        &:hover{
          // opacity:50%;
          background-color: rgba(53,59,72,0.5);
          // background-color: #353B48;
        }
    }
    
    .selectRow > .rdg-cell{
      background: rgba(25, 185, 223, 0.5);
      &:hover{
        background: rgba(25, 185, 223, 0.3);
      }
    }
  
    .rdg-row[aria-selected=true]{
        background:none;
        &:hover{
            background:none;
            background-color:none;
        }
    }
    
    .editDropdown > option {
      background:#484848;
    }

    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../../public/images/check_box_activated.png')}) ;
        background-size: 20px 20px;
        outline: none;
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
  `}
  `

const EmptyRows = styled.div<{type:string}>`
  display:flex;
  justify-content:center;
  height:40px;
  align-items:center;
  background: ${(props:{type:string})=> props.type == "searchModal" ? "white" : "#353B48"};
  // width:1776px;
  // grid-column: '1/-1';
  color: ${(props: { type:string })=> props.type == "searchModal" ? "black" : "none"};
  border:${(props: {type:string}) => props.type == "searchModal" ? "1px solid #B3B3B3" : "none"}
`;
export {ExcelTable};

import React, {useEffect, useState} from 'react'
import styled from "styled-components";
// @ts-ignore
import DataGrid, {TextEditor} from 'react-data-grid'
import {IExcelHeaderType} from '../../common/@types/type'
import {SearchModalStyle} from '../../styles/styledComponents'
import {RequestMethod} from "../../common/RequestFunctions";

interface IProps {
  headerList: Array<IExcelHeaderType>
  setHeaderList?:(value:Array<IExcelHeaderType>) => void
  row: Array<any>
  width?: number
  maxWidth?:number
  rowHeight?: number
  height?:number
  maxHeight?:number
  editable?: boolean
  resizable?: boolean
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
}

const ExcelTable = ({headerList, setHeaderList, row, width, maxWidth, rowHeight, height, maxHeight, editable, resizable, selectable, setRow, setSelectRow, selectList, setSelectList, type, disableVirtualization, selectPage, setSelectPage, overflow}: IProps) => {
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<number>>(selectList ?? new Set());
  // const [selectPage, setSelectPage] = useState<number>(1);
  const onePageHeight = 600;
  const rowKeyGetter = (row: any) => {
    return row.id;
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
    setSelectList && setSelectList(selectedRows)
  }, [selectedRows])

  useEffect(() => {
    let allWidth = 0
    headerList.map((v: any) => {
      allWidth += v.width
    })
  }, [headerList])



  const showDataGrid = () => {

    return <DataGridTable
        headerRowHeight={40}
      //@ts-ignore
      rowKeyGetter={rowKeyGetter}
      //@ts-ignore
      className={'cell'}
      columns={headerList}
      rows={row}
      onColumnResize={(v, i) => {
        tempData.map((time,i)=>{
            clearTimeout(time)
        })
        // headerList[v-1].width = i;
        //
        // setHeaderList && setHeaderList(headerList)
        tempData.push(
            setTimeout(()=>{
              let tmpHeader = headerList[v].name.indexOf('(필수)') === -1 ? headerList[v].name : headerList[v-1].name.split('(필수)')[0]
              RequestMethod("post", "itemSave", {tab:headerList[v].tab, menus:[{mi_id:headerList[v].id, width:i <= 80 ? 80 : i,title:tmpHeader, hide:false}]} )
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
      emptyRowsView={() => <div>empty</div>}
      onSelectedRows={(e:any)=>{
      }}
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
        overflow:"auto",
        width: width ?? 1576,
        maxWidth: maxWidth,
        height: height ?? 760,
        maxHeight:maxHeight,
        backgroundColor: '#00000000',
        textAlign: 'center',
      }}
      theme={scrollState}
      state={type}
      enableVirtualization={!disableVirtualization}
      onScroll={(e:any)=>{
        if(e.target.scrollTop > onePageHeight * (selectPage-1)){
          setSelectPage(selectPage+1);
        }
      }}

    />
  }

  if(type === 'searchModal'){
    return <SearchModalStyle>
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
        // &:hover{
        //     background:red;
        // }
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
   
    .rdg-row[aria-selected=true]{
        background:none;
    }

    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../public/images/check_box_activated.png')}) ;
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

export default ExcelTable;

import styled from 'styled-components'
import {BG_COLOR_SUB3, POINT_COLOR} from '../common/configset'
import exp from "constants";

export const Body = styled.div`
  p, span{
    font-family: NotoSansCJKkr;
    color: white;  
  }
  background: linear-gradient(90deg, #202E4A, #0F1722);
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
`

export const Profile = styled.img`
  border-radius: 15px;
  margin-right: 10px;
  width: 31px;
  min-width: 31px;
  float: left;
  height: 31px;
  object-fit: cover;

`

export const MainWrapper = styled.div`
  background: linear-gradient(90deg, #202E4A, #0F1722);
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
`

export const WelcomeInputCompo = styled.input`
  width: 100%;
  margin-top: 6px;
  margin-bottom: 11px;
  font-size: 14px;
  border-radius: 5px;
  outline: none;
  border: 0;
  background-color: #ffffff;
  font-size: 15px;
  padding: 14px;
  color: #252525;
`

export const PointColorButton = styled.div`
  padding: 12px;
  border-radius: 5px;
  click-event: none;
  color: black;
  background-color: #19B9DF;
  border: none;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
`

export const Table = styled.div`
  display: flex;
`

export const CheckBoxList = styled.div`
  width: 48px;
  margin-right: 1px;
`

export const ContentsList = styled.div`
  margin-right: 1px;
  white-space:nowrap;
  overflow: hidden;
`

export const HeaderRow = styled.div`
  width: calc(119px*56px);
  display: flex;
`

export const ContentsRow = styled.div`
  width: calc(119px*56px);
  display: flex;
`

export const NoScrollContentsWrapper = styled.div`
  ::-webkit-scrollbar{
        background:none;
        display: none;
    }
    ::-webkit-scrollbar-track{
        background:none;
    }
    ::-webkit-scrollbar-thumb{
        border-radius: 3px;
        background:none;
    }
    ::-webkit-scrollbar-corner {
        display:none;
    }
`

export const ContentsWrapper = styled.div`
  overflow: auto;
  ::-webkit-scrollbar{
      width:10px;
      height:10px;
      background:none;
  }
  ::-webkit-scrollbar-track{
      background:none;
  }
  ::-webkit-scrollbar-thumb{
      border-radius: 3px;
      background:#707070;
  }
  ::-webkit-scrollbar-corner {
      display:none;
  }
`

export const HeaderItem = styled.div`
  height: 40px;
  width: 118px;
  background-color: #111319;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-right: 1px;
`

export const ContentsItem = styled.div`
  height: 40px;
  background-color: #353b48;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  margin-top: 1px;
  margin-right: 1px;
`

export const UploadButton = styled.div<{hoverColor?:string, haveId?:boolean, status?: "table" | "modal", newRow?:boolean}>`
  width:112px;
  height: 32px;
  background-color: ${({haveId, newRow}) => haveId ? "none" : newRow ? "#19B9DF" : "#19B9DF"};
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color:white;
  p {
    // color: black;
    color: ${({haveId, status}) => status == "modal" || !haveId ? "black" : "white"};
    font-size: 15px;
    text-decoration: ${({haveId}) => haveId ? "underline" : "none"};
  }
    border:none;
  &:hover {
    opacity:70%;
    p{
        color:${({hoverColor, haveId}) => haveId ? hoverColor : "none"};
    }
    // color:red;
  }
`

export const SearchIcon = styled.div<{modalType?:boolean}>`
  display: flex;
  background-color: ${POINT_COLOR};
  width: ${({modalType}) => (modalType ? '30px' : '38px')};
  height: ${({modalType}) => (modalType ? '30px' : '38px')};
  // width: 38px;
  // height:38px;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity:70%;
  }
`;

export const DeleteImage = styled.img`
    border-radius:4px;
    width:24px;
    height:24px;
    margin-right:4px;
    margin=left:4px;
    &:hover{
        opacity:70%;
    }
`;

export const Handler = styled.div`
  position: relative;
  width: 3px;
  height: 38px;
  background-color: #1E2C46;
  opacity: 0.75;
  right:0px;
  cursor: ew-resize;
  z-index:1;
`;

export const MenuNavComponent = styled.div`
  width: 288px;
  display: flex;
`

export const MenuNavItem = styled.div`
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer
`

export const MenuText = styled.p`
  margin: 0;
  color: white;
  font-size: 12px;
`

export const SideMenuItem = styled.div`
  width: 170px;
  height: 48px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  cursor: pointer;
  p {
    padding: 0;
    margin: 0;
    text-align: left;
    font-size: 15px;
    color: white;
  }
  &:hover {
    background-color: ${BG_COLOR_SUB3};
  }
`

export const ExcelDataStyle = styled.div`
   
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

    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../public/images/check_box_activated.png')}) ;
        background-size: 20px 20px;
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

export const SearchModalStyle = styled.div`
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    .rdg{
        border:none;
    }
    
    .rdg-cell{
        //border:none;
        border: 0.5px solid #B3B3B3;
    }
    
    .rdg-header-row{
        background:#F4F6FA;
        color:black;
        text-align: left;
        //border: 0.5px solid #b3b3b3;
        ${(props:any) => props.headerAlign ? `
          text-align: ${props.headerAlign}
          ` : `
            // padding: 0 8px;
          `
        }
    }
  
    .rdg-header-row > .rdg-cell {
      padding: 0 8px;
    }
    
    .rdg-row {
        border:none;
        background:none;
        //grid-gap:1px;
        &:hover{
          background:white;
        }
    }

    .selectRow {
      background: #19B9DF79;
      &:hover {
        background-color: #19B9DFB0;
      }
    }
    .rdg-row > .rdg-cell{
        //background:#F4F6FA;
        border: 0.5px solid #b3b3b3;
        color:black;
        text-align: center;
        padding: 0;
        border-top: none;
    }
      
    .rdg-checkbox-input:checked + div{
        width:20px;
        height:20px;
        box-shadow:none;
        border:none;
        background: url(${require('../../public/images/check_box_activated.png')}) ;
        background-size: 20px 20px;
    }
    .editDropdown > option {
      background:#484848;
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
`

export const ContainerWrapper = styled.div`
  width: 100%;
`

export const TreeViewWrapper = styled.div`
  width: 1280px;
  margin-bottom: 66px;
`;

export const TreeViewHeader = styled.div`
  height: 40px;
  width: 100%;
  background-color: #111319;
  display:flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 16px;
    font-weight: bold;
  }
`;

export const TreeViewContainer = styled.div`
  width: 100%;
  min-height: 600px;
  background-color: #353b48;
  text-align: center;
  padding-top: 16px;
  padding-bottom: 74px;
  border: 1px solid #1b273f;
  p {
    font-size: 18px;
    font-weight: bold;
  }
`;

export const ArrowImageWrapper = styled.div`
  width: 16px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  marginLeft: 16
`

export const TopMenuTitle = styled.p`
  font-width: bold;
  font-size: 16px;
  color: white;
`

export const TopMenuView = styled.div`
  width: 1260px;
  display: flex;
  padding-left: 20px;
  height: 48px;
  cursor: pointer;
  display: flex;
  justify-content: left;
  align-items: center;
`

export const SecendMenuView = styled.div`
  width: auto;
  display: flex;
  height: 40px;
  cursor: pointer;
  display: flex;
  justify-content: left;
  align-items: center;
  p {
    font-size: 16px;
  }
`

export const ItemListTableWrapper = styled.div`
  min-width: 100px;
  margin-bottom: 66px;
`;

export const ItemListTableHeader = styled.div`
  width: 1576px;
  height: 48px;
  background-color: #111319;
  text-align: center;
  justify-content: center;
  align-items: center;
  display: flex;
  border: 1px solid #1b273f;
  p {
    color: white;
    font-size: 18px;
    font-weight: bold;
  }
`;

export const ItemWrapper = styled.div`
  width: 1576px;
  display: flex;
  flex-wrap: wrap;
`

export const Item = styled.div`
    width: 112.5px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #353b48;
    border: 1px solid #1b273f;
    cursor: pointer;
    p {
      font-size: 18px;
    }
`;

export const HeaderButton = styled.button`
    height:32px;
    border-radius:6px;
    color:white;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;

export const DropBoxContainer = styled.div`
    min-width: 100px;
    width: 385px;
    //height: 346px;
    z-index:1;
`

export const BoxWrap = styled.button`
    padding: 4px 0 5px 15px;
    border-radius: 5px;
    color: black;
    min-width: 100px;
    background-color: #b3b3b3;
    border: none;
    font-weight: bold;
    text-algin: center;
    font-size: 13px;
    img {
    width: 14px;
    height: 14px;
    }
    .react-calendar{
        border: 0;
    }
`

export const InnerBoxWrap = styled.div`
    //position: absolute;
    top: 0;
    right:0;
    text-align: left;
    //margin-top: 32px;
`

export const CellButton = styled.div`
  width: 112px;
  height: 32px;
 
  background-color: ${POINT_COLOR};
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  cursor: pointer;
  
  &:hover{
    opacity:70%;   
  }
`

export const UnitWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const UnitValue = styled.div`
  width: calc(100% - 40px);
  padding-left: 8px;
  p {
    margin: 0px;
    text-align: left;
  }
`

export const UnitBox = styled.div`
  span {
    text-align: right;
  }
  
  width: 40px;
  height: 40px;
`

export const TitleBox = styled.div`
    background-color: black;
    width: 120px;
    height: 40px;
    font-size: 16px;
    font-weight: bold;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
`

export const SelectButton = styled.div`
    margin: 8px;
    width: 72px;
    height: 32px;
    background-color: #19B9DF;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 15px;
`

export const MidrangeButton = styled.div`
    width: 100%;
    background-color: #111319;
    height: 40px;
    margin-bottom: 16px; 
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`

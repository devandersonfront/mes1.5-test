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
import {MesAdminStockProductList} from '../../../../../mes/src/container/Stock/MesAdminStockProductList'

const Productlist = () => {
    return(
        <ScrollSync >
            <div style={{display:"flex"}}>

                <MenuNavigation pageType={'MES'} subType={3}/>
                <MesAdminStockProductList/>
            </div>
        </ScrollSync>
    );
}

export default Productlist;

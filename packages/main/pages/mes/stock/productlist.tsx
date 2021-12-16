import React, {useEffect, useState} from "react";
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import PageHeader from "../../../component/Header/Header";
import ExcelTable from "../../../component/Excel/ExcelTable";
import {RequestMethod} from "../../../common/RequestFunctions";
import {columnlist} from "../../../common/columnInit";
import {IExcelHeaderType} from "../../../common/@types/type";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {ScrollSync, ScrollSyncPane} from "react-scroll-sync";
import ProductTitleFomatter from "../../../component/Formatter/ProductTitleFomatter";
import moment from "moment";
import UnitContainer from "../../../component/Unit/UnitContainer";
import {excelDownload} from "../../../common/excelDownloadFunction";
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import BasicContainer from '../basic/customer'
import {MesStockProductList} from 'mes'


interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const Productlist = ({page, keyword, option}: IProps) => {

    return(
        <ScrollSync horizontal={false}>
            <div style={{display:"flex"}}>
                <MenuNavigation pageType={'MES'} subType={3}/>
                <MesStockProductList page={page} keyword={keyword} option={option}/>
            </div>
        </ScrollSync>
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

// Productlist.getInitialProps = async ({ query }) => {
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export default Productlist;

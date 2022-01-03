import React from "react";
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {ScrollSync} from "react-scroll-sync";
import {NextPageContext} from "next";
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

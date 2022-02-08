import React from "react";
import MenuNavigation from "../../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../../component/Profile/ProfileHeader";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {MesProductChangeList} from 'mes'
import {NextPageContext} from "next";


interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const RegisterBasicContainer = ({page, keyword, option}: IProps) => {


    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesProductChangeList page={page} keyword={keyword} option={option}/>
            </div>
        </div>
    )
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


export default RegisterBasicContainer;

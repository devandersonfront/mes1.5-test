import React from 'react';
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {MesWorkStandardList} from "mes";
import {NextPageContext} from "next";

interface IProps {
    children?: any
    page?: number
    search?: string
    option?: number
}

const BasicContainer = ({page, search, option}: IProps) => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesWorkStandardList page={page} search={search} option={option}/>
            </div>
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


export default BasicContainer;

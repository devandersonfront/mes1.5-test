import React from "react";
import MenuNavigation from "../../../../main/component/MenuNav/MenuNavigation";
import {NextPageContext} from "next";
import {MesToolWarehousingList} from "mes";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import {MesToolList} from "mes/src/container/Tool/MesToolList";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const ToolList = ({page, keyword, option}: IProps) => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesToolList page={page} search={keyword} option={option} />
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

export default ToolList;

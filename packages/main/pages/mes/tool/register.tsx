import React from "react";
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import {MesToolRegister} from "mes";
import {NextPageContext} from "next";
import ProfileHeader from "../../../component/Profile/ProfileHeader";

const ToolRegister = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesToolRegister/>
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
export default ToolRegister;

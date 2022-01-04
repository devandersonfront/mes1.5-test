import React from "react";
import MenuNavigation from "../../../../main/component/MenuNav/MenuNavigation";
import {NextPageContext} from "next";
import {MesToolList} from "mes";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
// import {MesFinishList} from "../../../../mes";


const ToolList = () => {
    return (
        <div style={{display: 'flex', }}>
            <ProfileHeader/>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <MesToolList/>
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

import React from "react";
import MenuNavigation from "../../../../main/component/MenuNav/MenuNavigation";
import {NextPageContext} from "next";
import {MesToolList} from "mes";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
// import {MesFinishList} from "../../../../mes";


const ToolList = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesToolList/>
            </div>
        </div>
    );
}

export default ToolList;

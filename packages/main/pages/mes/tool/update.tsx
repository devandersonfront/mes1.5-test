import React from "react";
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import {MesToolUpdate} from "mes";

const ToolUpdate = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesToolUpdate/>
            </div>
        </div>
    );
}

export default ToolUpdate;

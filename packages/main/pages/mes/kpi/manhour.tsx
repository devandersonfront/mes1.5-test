import React from 'react';
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import {MesKpiManHour, MesQualityDefect} from "mes";

const BasicContainer = () => {

    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesKpiManHour/>
            </div>
        </div>
    )
};

export default BasicContainer;

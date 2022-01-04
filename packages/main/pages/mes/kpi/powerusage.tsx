import React from 'react';
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import {MesKpiPowerUsage, MesQualityDefect} from "mes";

const BasicContainer = () => {

    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesKpiPowerUsage/>
            </div>
        </div>
    )
};

export default BasicContainer;

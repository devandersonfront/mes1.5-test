import React from 'react';
import MenuNavigation from "../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../component/Profile/ProfileHeader";
import {MesKpiUph, MesQualityDefect} from "mes";

const BasicContainer = () => {

    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesKpiUph/>
            </div>
        </div>
    )
};

export default BasicContainer;

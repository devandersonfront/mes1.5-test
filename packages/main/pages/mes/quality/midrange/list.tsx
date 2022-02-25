import React from 'react';
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {MesMidrangeList} from "mes";

const BasicContainer = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'MES'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <MesMidrangeList/>
            </div>
        </div>
    );
};

export default BasicContainer;

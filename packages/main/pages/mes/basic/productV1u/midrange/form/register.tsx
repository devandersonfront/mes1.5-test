import React from 'react';
import MenuNavigation from "../../../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../../../component/Profile/ProfileHeader";
import {BasicMidrangeRegister} from "../../../../../../../basic";

const BasicContainer = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicMidrangeRegister/>
            </div>
        </div>
    );
};

export default BasicContainer;

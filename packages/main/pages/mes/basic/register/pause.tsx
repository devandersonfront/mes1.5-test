import React from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {BasicPause} from 'basic'

const RegisterBasicContainer = () => {


    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'BASIC'} subType={2}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicPause/>
            </div>
        </div>
    )
}

export default RegisterBasicContainer;

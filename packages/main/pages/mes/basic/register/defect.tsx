import React, {useEffect, useState} from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {BasicDefect} from 'basic'

const RegisterBasicContainer = () => {

    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'BASIC'} subType={3}/>
            <div>
                <ProfileHeader/>
                <BasicDefect/>
            </div>
        </div>
    )
}

export default RegisterBasicContainer;

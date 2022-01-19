import React from "react";
import MenuNavigation from "../../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../../component/Profile/ProfileHeader";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {MesProductChangeDetail} from 'mes'


const RegisterBasicContainer = () => {


    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesProductChangeDetail/>
            </div>
        </div>
    )
}

export default RegisterBasicContainer;

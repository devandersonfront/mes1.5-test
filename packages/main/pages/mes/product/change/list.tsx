import React from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
//@ts-ignore
import Notiflix from "notiflix";
import {MesProductChangeList} from '../../../../../mes'


const RegisterBasicContainer = () => {


    return (
        <div style={{display:"flex"}}>
            <MenuNavigation pageType={'MES'} subType={2}/>
            <div>
                <ProfileHeader/>
                <MesProductChangeList/>
            </div>
        </div>
    )
}

export default RegisterBasicContainer;

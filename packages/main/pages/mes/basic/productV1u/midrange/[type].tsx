import React from 'react'
import MenuNavigation from '../../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../../component/Profile/ProfileHeader'
import {BasicMidrange} from 'basic'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'

const BasicContainer = () => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicMidrange/>
            </div>
        </div>
    );
}


export default BasicContainer;

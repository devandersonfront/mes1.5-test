import React from 'react'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import {ContainerWrapper} from '../../../../styles/styledComponents'
import {BasicAuthority} from 'basic'


const AuthorityContainer = () => {
  return (
    <div style={{display: 'flex'}}>
      <MenuNavigation pageType={'BASIC'}/>
      <ContainerWrapper>
        <ProfileHeader/>
        <BasicAuthority/>
      </ContainerWrapper>
    </div>
  );
}


export default AuthorityContainer;


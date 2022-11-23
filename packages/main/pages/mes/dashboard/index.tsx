import React, {useState} from 'react'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import {HomeProductionLog} from "../../../container/home/HomeProductionLog";

interface IProps {
  children?: any,
  title: string,
  cookies: any
}

const DashboardPage = ({children, title, cookies}: IProps) => {

  const [row, setRow] = useState<Array<any>>([
    {id: 0, title: 'Example'},
    {id: 1, title: 'Demo'},
  ])

  return (
    <div style={{display: 'flex'}}>
      <MenuNavigation/>
      <div style={{width: '100%'}}>
        <ProfileHeader/>
      </div>
    </div>
  );
}

DashboardPage.getInitialProps = async (ctx: any) => {

  return {
    title: '홈',
    cookies: ''
  }
}


export default DashboardPage;


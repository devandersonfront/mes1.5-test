import React, {useState} from 'react'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import {Header as PageHeader} from 'shared/src/components/Header'

import {IExcelHeaderType} from '../../../common/@types/type'
import {HomeProductionLog} from "../../../container/home/HomeProductionLog";

interface IProps {
  children?: any,
  title: string,
  user: any
  cookies: any
  row?: Array<any>
  column?: IExcelHeaderType[]
}

const DashboardPage = ({children, title, cookies}: IProps) => {

  const [row, setRow] = useState<Array<any>>([
    {id: 0, title: 'Example'},
    {id: 1, title: 'Demo'},
  ])

  return (
    <div style={{display: 'flex'}}>
      <MenuNavigation pageType={'HOME'}/>
      <div style={{width: '100%'}}>
        <ProfileHeader/>
        <HomeProductionLog/>
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


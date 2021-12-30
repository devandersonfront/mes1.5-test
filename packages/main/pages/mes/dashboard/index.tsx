import React, {useState} from 'react'
import MenuNavigation from '../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../component/Profile/ProfileHeader'
import PageHeader from '../../../component/Header/Header'
import {IExcelHeaderType} from '../../../common/@types/type'

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
        <PageHeader title={title}></PageHeader>
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

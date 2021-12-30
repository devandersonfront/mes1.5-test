import React from 'react'
// import ExcelTable from '../../../../component/Excel/ExcelTable'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import {BasicUser} from 'basic'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '유저 관리'
const optList = ['사용자명', '이메일', '직책명', '전화번호', '권한명']

const BasicContainer = ({page, keyword, option}: IProps) => {


  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'BASIC'} subType={0}/>
      <div style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <BasicUser page={page} keyword={keyword} option={option}/>
      </div>
    </div>
  );
}

export const getServerSideProps = (ctx: NextPageContext) => {
  return {
    props: {
      page: ctx.query.page ?? 1,
      keyword: ctx.query.keyword ?? "",
      option: ctx.query.opt ?? 0,
    }
  }
}

// BasicContainer.getInitialProps = async ({ query }) => {
//   let { page, keyword, opt } = query
//   if (typeof page === 'string')
//     page = parseInt(page);
//   if (typeof opt === 'string')
//     opt = parseInt(opt);
//   return { page, keyword, option: opt };
// }

export default BasicContainer;

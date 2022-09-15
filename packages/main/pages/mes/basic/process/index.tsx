import React from 'react'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import {BasicProcess} from '../../../../../basic'

interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '공정 종류 관리'
const optList = ['공정명']

const BasicContainer = ({page, keyword, option}: IProps) => {
  return (
    <div style={{display: 'flex', }}>
      <MenuNavigation pageType={'BASIC'} subType={2}/>
      <div className={'pageContainer'} style={{paddingBottom: 40}}>
        <ProfileHeader/>
        <BasicProcess keyword={keyword} page={page} option={option}/>
      </div>
    </div>
  );
}

// export const getServerSideProps = (ctx: NextPageContext) => {
//   return {
//     props: {
//       page: ctx.query.page,
//       keyword: ctx.query.keyword ?? "",
//       option: ctx.query.option ?? 0,
//     }
//   }
// }

// BasicContainer.getInitialProps = async ({ query }) => {
//   let { page, keyword, opt } = query
//   if (typeof page === 'string')
//     page = parseInt(page);
//   if (typeof opt === 'string')
//     opt = parseInt(opt);
//   return { page, keyword, option: opt };
// }

export default BasicContainer;

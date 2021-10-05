import React, {useEffect, useState} from 'react'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import {BasicModel} from 'basic'

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicContainer = ({page, keyword, option}: IProps) => {


    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'} subType={1}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicModel page={page} keyword={keyword} option={option}/>
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
//     let { page, keyword, opt } = query
//     if (typeof page === 'string')
//         page = parseInt(page);
//     if (typeof opt === 'string')
//         opt = parseInt(opt);
//     return { page, keyword, option: opt };
// }

export default BasicContainer;

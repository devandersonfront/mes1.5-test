import React from 'react'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
import {BasicDevice, BasicDocumentationManagement} from 'basic'
import {NextPageContext} from 'next'

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicDocument = ({page, keyword, option}: IProps) => {

    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicDocumentationManagement page={page} keyword={keyword} option={option} />
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

export default BasicDocument;

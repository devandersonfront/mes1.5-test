import React from 'react'
import MenuNavigation from '../../../../component/MenuNav/MenuNavigation'
import ProfileHeader from '../../../../component/Profile/ProfileHeader'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import HomeAiProductionLogTest from "../../../../container/home/HomeAiProductionLogTest";


interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicContainer = ({page, keyword, option}: IProps) => {

    return (
        <div style={{display: 'flex'}}>
            <MenuNavigation pageType={'HOME'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <HomeAiProductionLogTest/>
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

export default BasicContainer;

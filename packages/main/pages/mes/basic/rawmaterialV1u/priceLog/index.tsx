import React from 'react'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import {NextPageContext} from 'next'
import MenuNavigation from '../../../../../component/MenuNav/MenuNavigation'
import { ProfileHeader } from 'shared'
import {BasicPriceLog} from "basic";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicContainer = ({page, keyword, option}: IProps) => {
    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicPriceLog />
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

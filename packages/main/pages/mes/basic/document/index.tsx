import React from "react";
import MenuNavigation from "../../../../component/MenuNav/MenuNavigation";
import ProfileHeader from "../../../../component/Profile/ProfileHeader";
import {BasicDevice, BasicDocument} from "basic";
import {NextPageContext} from "next";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
    doc_id?:number
}

const BasicContainer = ({page, keyword, option, doc_id}: IProps) => {


    return (
        <div style={{display: 'flex', }}>
            <MenuNavigation pageType={'BASIC'}/>
            <div style={{paddingBottom: 40}}>
                <ProfileHeader/>
                <BasicDocument page={page} keyword={keyword} option={option} doc_id={doc_id}/>
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
            doc_id: ctx.query.doc_id ?? ""
        }
    }
}

export default BasicContainer

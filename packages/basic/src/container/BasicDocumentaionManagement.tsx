import React from "react";
import {Header as PageHeader} from "shared";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}


const BasicDocumentationManagement = ({page, keyword, option}:IProps) => {

    const ButtonEvents = (index:number) => {
        switch(index) {
            case 0:

                return

            case 1:

                return;

            default:
                return;
        }
    }

    return(
        <div>
            <PageHeader
                title={"표준 문서 관리"}
                buttons={["문서 다운로드", "삭제"]}
                buttonsOnclick={(index) => {
                    ButtonEvents(index)
                }}
            />
        </div>
    )
}

export {BasicDocumentationManagement}

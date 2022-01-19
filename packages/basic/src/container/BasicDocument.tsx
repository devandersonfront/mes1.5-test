import React, {useState} from "react";
import {columnlist, ExcelTable, Header as PageHeader} from "shared";
//@ts-ignore
import {SelectColumn} from "react-data-grid";
import DocumentControlModal from "../../../shared/src/components/Modal/DocumentControlModal";
//@ts-ignore
import Notiflix from "notiflix";

interface IProps {
    children?: any
    page?: number
    keyword?: string
    option?: number
}

const BasicDocument = ({page, keyword, option}: IProps) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [modalType, setModalType] = useState<"folderAdd" | "documentUpload" | "fileMove" | null>(null);

    const buttonEvents = (index:number) => {
        switch (index){
            case 0:
                setIsOpen(true);
                setModalType("folderAdd");
                return

            case 1:
                setIsOpen(true);
                setModalType("documentUpload");
                return

            case 2:

                return

            case 3:

                return

            case 4:
                setIsOpen(true);
                setModalType("fileMove");
                return

            case 5:
                Notiflix.Confirm.show("경고","문서를 삭제하시겠습니까?","확인","취소",() =>{}, () => {})
                return
            default:
                return
        }
    }



    return (
        <div>
            <PageHeader
                title={"표준 문서 관리"}
                buttons={["문서 폴더 추가", "문서 업로드", "문서 다운로드", "문서 로그", "파일 이동", "삭제"]}
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                headerList={[SelectColumn,...columnlist.documentManage]}
                row={[]}
                setRow={() => {}}
            />
            <DocumentControlModal isOpen={isOpen} setIsOpen={setIsOpen} type={modalType} />
        </div>
    )
}

export {BasicDocument}

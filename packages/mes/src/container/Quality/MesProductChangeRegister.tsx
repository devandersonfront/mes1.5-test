import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, TitleCalendarBox,
    TitleFileUpload,
    TitleInput,
    TitleTextArea
} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";

const MesProductChangeRegister = () => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeRegister"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>([ '거래처', '모델', 'CODE', '품명', '제목', '작성자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    return (
        <div>
            <PageHeader
                title={"변경점 정보 등록"}
                buttons={
                    ['', '저장하기']
                }
            />
            <ExcelTable
                editable
                // resizable
                headerList={[
                    SelectColumn,
                    ...column
                ]}
                row={basicRow}
                // setRow={setBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) tmp.add(v.id)
                    })
                    console.log(e)
                    setSelectList(tmp)
                    setBasicRow(e.map(v => ({...v, name: v.product_name})))
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
                scrollEnd={(value) => {
                    if(value){
                        if(pageInfo.total > pageInfo.page){
                            setPageInfo({...pageInfo, page:pageInfo.page+1})
                        }
                    }
                }}
            />
            <TitleInput title={'제목'} value={'공차 수정'} placeholder={''} onChange={(e)=>{}}/>
            <TitleTextArea title={'설명'} value={''} placeholder={''} onChange={(e)=>{}}/>
            <TitleFileUpload title={'첨부파일 01'} value={''} placeholder={'파일을 선택해주세요 ( 크기 : 00MB 이하, 확장자 : .hwp .xlsx .doc .jpeg .png .pdf 의 파일만 가능합니다.)'} deleteOnClick={()=>{}} fileOnClick={()=>{}}/>
            <TitleFileUpload title={'첨부파일 02'} value={'스마트제조혁신추진단_스마트공장표준지도.pdf'} placeholder={'파일을 선택해주세요 ( 크기 : 00MB 이하, 확장자 : .hwp .xlsx .doc .jpeg .png .pdf 의 파일만 가능합니다.)'} deleteOnClick={()=>{}} fileOnClick={()=>{}}/>
            <TitleFileUpload title={'첨부파일 03'} value={''} placeholder={'파일을 선택해주세요 ( 크기 : 00MB 이하, 확장자 : .hwp .xlsx .doc .jpeg .png .pdf 의 파일만 가능합니다.)'} deleteOnClick={()=>{}} fileOnClick={()=>{}}/>
            <TitleCalendarBox value={'2021.06.17'} onChange={()=>{}}/>
        </div>
    );
};

export {MesProductChangeRegister}

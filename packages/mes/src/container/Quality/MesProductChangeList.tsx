import React, {useState} from 'react';
import {columnlist, ExcelTable, Header as PageHeader, IExcelHeaderType} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";

const MesProductChangeList = () => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeList"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [optionList, setOptionList] = useState<string[]>([ '거래처', '모델', 'CODE', '품명', '제목', '작성자'])
    const [optionIndex, setOptionIndex] = useState<number>(0)
    const [selectDate, setSelectDate] = useState<{from:string, to:string}>({
        from: moment(new Date()).startOf("month").format('YYYY-MM-DD') ,
        to:  moment(new Date()).endOf("month").format('YYYY-MM-DD')
    });

    const [searchKeyword, setSearchKeyword] = useState<string>("");
    const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
        page: 1,
        total: 1
    })

    return (
        <div>
            <PageHeader
                isSearch
                isCalendar
                searchKeyword={""}
                searchOptionList={optionList}
                onChangeSearchKeyword={(keyword) => {
                    // SearchBasic(keyword, option, 1)
                    setSearchKeyword(keyword);
                    setPageInfo({page:1, total:1})
                }}
                onChangeSearchOption={(option) => {
                    // SearchBasic(keyword, option, 1)
                    setOptionIndex(option)
                }}
                calendarTitle={'등록 날짜'}
                calendarType={'period'}
                selectDate={selectDate}
                //@ts-ignore
                setSelectDate={(date) => setSelectDate(date)}
                title={"변경점 정보 리스트"}
                buttons={
                    ['', '수정하기']
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
                    setSelectList(tmp)
                    setBasicRow(e)
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
        </div>
    );
};

export {MesProductChangeList}

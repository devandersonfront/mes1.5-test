import React, {useState} from 'react';
import {
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, TitleCalendarBox,
    ChangeProductFileInfo,
    TitleFileUpload,
    TitleInput,
    TitleTextArea, RequestMethod
} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {useRouter} from "next/router";

const MesProductChangeRegister = () => {

    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeRegister"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ changeInfo, setChangeInfo] = useState({title: '', content: '', registered: moment().format('YYYY.MM.DD')})
    const [ files, setFiles ] = useState<ChangeProductFileInfo[]>([
            {name: '', UUID: '', sequence: 1},
            {name: '', UUID: '', sequence: 2},
            {name: '', UUID: '', sequence: 3},
        ]
    )


    const fileChange = (fileInfo: ChangeProductFileInfo, index: number) => {
        const temp = files
        temp[index] = fileInfo
        setFiles([...temp])
    }


    const productChangeSave = async () => {
        const res = await RequestMethod('post', `productChangeSave`,{
            title: changeInfo.title,
            content: changeInfo.content,
            files: files,
            created: changeInfo.registered,
            // product: changeInfo.product,
            // writer: changeInfo.writer
        })

        if(res){
            router.push('/mes/quality/product/change/list')
        }
    }

    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :

                return
            case 1 :
                productChangeSave()
                return
        }
    }

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
                    setBasicRow(e.map(v => ({...v, name: v.product_name})))
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
            <TitleInput title={'제목'} value={changeInfo.title} placeholder={''} onChange={(e)=>setChangeInfo({...changeInfo, title: e.target.value})}/>
            <TitleTextArea title={'설명'} value={changeInfo.content} placeholder={''} onChange={(e)=>setChangeInfo({...changeInfo, content: e.target.value})}/>
            {files.map((v,i) =>
                <TitleFileUpload title={'첨부파일 0'+(i+1)} index={i} value={v.name} placeholder={'파일을 선택해주세요 ( 크기 : 10MB 이하, 확장자 : .hwp .xlsx .doc .docx .jpeg .png .pdf 의 파일만 가능합니다.)'} deleteOnClick={()=>{}} fileOnClick={(fileInfo: ChangeProductFileInfo)=>fileChange(fileInfo,i)}/>
            )}
            <TitleCalendarBox value={changeInfo.registered} onChange={(date)=>setChangeInfo({...changeInfo, registered: moment(date).format('YYYY.MM.DD')})}/>
        </div>
    );
};

export {MesProductChangeRegister}

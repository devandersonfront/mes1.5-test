import React, {useState} from 'react';
import {
    ChangeProductFileInfo,
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, RequestMethod, TitleCalendarBox,
    TitleFileUpload,
    TitleInput,
    TitleTextArea
} from "shared";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import moment from "moment";
import {PlaceholderBox} from "shared/src/components/Formatter/PlaceholderBox";
import {SearchModalTest} from "shared/src/components/Modal/SearchModalTest";
import {useRouter} from "next/router";

const MesProductChangeDetail = () => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeModify"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ changeInfo, setChangeInfo] = useState({title: '', content: '', registered: moment().format('YYYY.MM.DD'), product: {}, writer: {}})
    const [ version, setVersion ] = useState<number>()
    const [ files, setFiles ] = useState<ChangeProductFileInfo[]>([
            {name: '', UUID: '', sequence: 1},
            {name: '', UUID: '', sequence: 2},
            {name: '', UUID: '', sequence: 3},
        ]
    )

    React.useEffect(()=>{
        productChangeLoad()
    },[])


    const productChangeLoad = async () => {
        const res = await RequestMethod('get', `productChangeLoad`,{
            path: {
                pcr_id: '61de9640d4c95c0e8bafef0d'
            },
        })

        if(res){

            const basicTmp = {
                customer_id: res.product.customerId  === null ? '-' : res.product.customerId,
                cm_id: res.product.model === null ? '-' : res.product.model,
                code: res.product.code,
                name: res.product.name === null ? '-' : res.product.name,
            }
            setBasicRow([basicTmp])
            setChangeInfo({title: res.title, content: res.content, registered: res.created, product: res.product, writer: res.writer})
            setFiles(res.files)
            setVersion(res.version)
        }
    }


    const fileChange = (fileInfo: ChangeProductFileInfo, index: number) => {
        const temp = files
        temp[index] = fileInfo
        setFiles([...temp])
    }
    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                return
            case 1 :
                return
        }
    }

    return (
        <div>
            <PageHeader
                title={"변경점 정보"}
                buttons={
                    ['', '수정 하기']
                }
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                editable
                headerList={[
                    ...column
                ]}
                row={basicRow}
                // setRow={setBasicRow}
                setRow={(e) => {
                    setBasicRow(e.map(v => ({...v, name: v.product_name})))
                }}
                height={basicRow.length * 40 >= 40*18+56 ? 40*19 : basicRow.length * 40 + 56}
            />
            <TitleInput title={'제목'} value={changeInfo.title} placeholder={''} onChange={()=>{}}/>
            <TitleTextArea title={'설명'} value={changeInfo.content} placeholder={''} onChange={()=>{}}/>
            {files.map((v,i) =>
                <TitleFileUpload title={'첨부파일 0'+(i+1)} index={i} uuid={v.UUID} value={v.name} detail={true} placeholder={'파일을 선택해주세요 ( 크기 : 10MB 이하, 확장자 : .hwp .xlsx .doc .docx .jpeg .png .pdf 의 파일만 가능합니다.)'} deleteOnClick={()=>{}} fileOnClick={()=>{}}/>
            )}
            <TitleCalendarBox value={'2021.06.17'} onChange={()=>{}}/>
        </div>
    );
};

export {MesProductChangeDetail}

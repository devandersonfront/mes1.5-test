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

const MesProductChangeModify = () => {

    const [basicRow, setBasicRow] = useState<Array<any>>([{
        order_num: '-', operation_num: '20210401-013'
    }])
    const [column, setColumn] = useState<Array<IExcelHeaderType>>( columnlist["productChangeModify"])
    const [selectList, setSelectList] = useState<Set<number>>(new Set())
    const [ changeInfo, setChangeInfo] = useState({title: '', content: '', registered: moment().format('YYYY.MM.DD')})
    const [ files, setFiles ] = useState<ChangeProductFileInfo[]>([
            {name: '', uuid: '', sequence: 1},
            {name: '', uuid: '', sequence: 2},
            {name: '', uuid: '', sequence: 3},
        ]
    )

    React.useEffect(()=>{
        productChangeLoad()
    },[])
    // {key: "customer_id", name: '거래처', formatter: PlaceholderBox, placeholder: '자동 입력', width: 168, type: 'autoInput'},
    // {key: "cm_id", name: '모델',formatter: PlaceholderBox, placeholder: '자동 입력', width: 480, type: 'autoInput'},
    // {key: "code", name: 'CODE',  formatter: SearchModalTest, type: 'product', width: 480},
    // {key: "name", name:"품명", formatter: PlaceholderBox, placeholder: '자동입력',type: 'autoInput'},

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
            setChangeInfo({title: res.title, content: res.content, registered: res.created})
            setFiles(res.files)
        }
    }

    const fileChange = (fileInfo: ChangeProductFileInfo, index: number) => {
        const temp = files
        temp[index] = fileInfo
        setFiles([...temp])
    }

    return (
        <div>
            <PageHeader
                title={"변경점 정보 (수정)"}
                buttons={
                    ['', '저장하기', '삭제']
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
            <TitleCalendarBox value={'2021.06.17'} onChange={()=>{}}/>
        </div>
    );
};

export {MesProductChangeModify}

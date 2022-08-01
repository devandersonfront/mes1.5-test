import React, {useEffect, useState} from 'react';
import {
    ChangeProductFileInfo,
    columnlist,
    ExcelTable,
    Header as PageHeader,
    IExcelHeaderType, MAX_VALUE, RequestMethod, TitleCalendarBox,
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
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";

const MesProductChangeModify = () => {
    const router = useRouter()
    const dispatch = useDispatch()
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

    const productChangeLoad = async (pcr_id: string) => {
        const res = await RequestMethod('get', `productChangeLoad`,{
            path: {
                pcr_id: pcr_id
            },
        })

        if(res){

            const basicTmp = [{
                customer_id: res.product.customer === null ? '-' : res.product.customer.name,
                cm_id: res.product.model === null ? '-' : res.product.model.model,
                code: res.product.code,
                name: res.product.name === null ? '-' : res.product.name,
            }]
            setBasicRow(basicTmp)
            setChangeInfo({title: res.title, content: res.content, registered: moment(res.created).format("YYYY.MM.DD"), product: res.product, writer: res.writer})
            if(res.files.length !== 0) {
                for(let i = 0; i<3; i++) {
                    if (res.files[i] !== undefined) {
                        files[res.files[i].sequence-1] = {
                            name: res.files[i].name,
                            UUID: res.files[i].UUID,
                            sequence: res.files[i].sequence
                        }
                    }
                }
            }
            setVersion(res.version)
        }
    }



    React.useEffect(()=>{
        if(router.query.pcr_id !== undefined) {
            productChangeLoad(String(router.query.pcr_id))
        }
    },[router.query])

    useEffect(() => {
        dispatch(setMenuSelectState({main:"품질 관리",sub:"/mes/quality/product/change/list"}))
        return (() => {
            dispatch(deleteMenuSelectState())
        })
    },[])

    const productChangeSave = async () => {
        const filesFilter = files.filter((v)=> v.name !== '')

        const res = await RequestMethod('post', `productChangeSave`,{
            pcr_id: router.query.pcr_id,
            title: changeInfo.title,
            content: changeInfo.content,
            files: filesFilter,
            created: moment(changeInfo.registered).format("YYYY-MM-DD"),
            version: version,
            product: changeInfo.product,
            writer: changeInfo.writer
        })

        if(res){
            router.push('/mes/quality/product/change/list')
        }
    }

    const productChangeDelete = async () => {
        const res = await RequestMethod('delete', `productChangeDelete`,{
            path: {
                pcr_id: router.query.pcr_id,
            }
        })

        if(res){
            router.push('/mes/quality/product/change/list')
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
                productChangeSave()
                return
            case 2 :
                productChangeDelete()
                return
        }
    }

    return (
        <div>
            <PageHeader
                title={"변경점 정보 (수정)"}
                buttons={
                    ['', '저장하기', '삭제']
                }
                buttonsOnclick={buttonEvents}
            />
            <ExcelTable
                editable
                headerList={column}
                row={basicRow}
                // setRow={setBasicRow}
                setRow={(e) => {
                    let tmp: Set<any> = selectList
                    e.map(v => {
                        if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                        }
                    })

                    setSelectList(tmp)
                    setBasicRow(e.map(v => ({...v, name: v.product_name})))
                }}
                selectList={selectList}
                //@ts-ignore
                setSelectList={setSelectList}
                width={1576}
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

export {MesProductChangeModify}

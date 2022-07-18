import React, {useEffect, useState} from 'react';
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
import {useDispatch} from "react-redux";
import {deleteMenuSelectState, setMenuSelectState} from "shared/src/reducer/menuSelectState";

const MesProductChangeDetail = () => {
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


    useEffect(()=>{
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

    const buttonEvents = async(index:number) => {
        switch (index) {
            case 0 :
                router.push({pathname: '/mes/quality/product/change/modify', query: { pcr_id: router.query.pcr_id }})
                return
        }
    }

    return (
        <div>
            <PageHeader
                title={"변경점 정보"}
                buttons={
                    ['수정 하기']
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
                <TitleFileUpload title={'첨부파일 0'+(i+1)} index={i} uuid={v.UUID} value={v.name} detail={true} placeholder={'파일 없음'} deleteOnClick={()=>{}} fileOnClick={()=>{}}/>
            )}
            <TitleCalendarBox value={changeInfo.registered} detail={true} onChange={(date)=>{}}/>
        </div>
    );
};

export {MesProductChangeDetail}

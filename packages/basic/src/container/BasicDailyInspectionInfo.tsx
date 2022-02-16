import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared"
import Notiflix from "notiflix"
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import DailyInspectionModal from "../../../shared/src/components/Modal/DailyInspection/DailyInspectionModal";

export interface IProps {
    machine_id: number
}

interface PictureInfo {
    name:string
    uuid:string
    sequence:number
}

interface PictureInterface {
    machinePicture?:PictureInfo
    photo1?:PictureInfo
    photo2?:PictureInfo
    photo3?:PictureInfo
    photo4?:PictureInfo
    photo5?:PictureInfo
    photo6?:PictureInfo
    photo7?:PictureInfo
    photo8?:PictureInfo
    photo9?:PictureInfo
}

const BasicDailyInspectionInfo = ({machine_id}: IProps) => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any>({
        form_id:"",
        machine:{},
        inspection_photo:[
                {name:"", uuid:"", sequence:1},
                {name:"", uuid:"", sequence:2},
                {name:"", uuid:"", sequence:3},
                {name:"", uuid:"", sequence:4},
                {name:"", uuid:"", sequence:5},
                {name:"", uuid:"", sequence:6},
                {name:"", uuid:"", sequence:7},
                {name:"", uuid:"", sequence:8},
                {name:"", uuid:"", sequence:9},
            ],
        legendary_list: [],
        check_list:[],
        etc:"",
        version:0
    })

    const [photoTitleList, setPhotoTitleList] = useState<PictureInterface[]>(
        [{
            machinePicture: {name:"", uuid:"", sequence:0},
            // photo1: {name:"", uuid:"", sequence:1},
            // photo2: {name:"", uuid:"", sequence:2},
            // photo3: {name:"", uuid:"", sequence:3},
            // photo4: {name:"", uuid:"", sequence:4},
            // photo5: {name:"", uuid:"", sequence:5},
            // photo6: {name:"", uuid:"", sequence:6},
            // photo7: {name:"", uuid:"", sequence:7},
            // photo8: {name:"", uuid:"", sequence:8},
            // photo9: {name:"", uuid:"", sequence:9},
        }]
        )

    const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false)

    const onClickHeaderButton = (index:number) => {
        switch(index){
            case 0:
                console.log("점검 양식 검토")
                setInfoModalOpen(true)
                return

            case 1:
                console.log("저장하기 : ", basicRow)
                forSaveClean(basicRow, photoTitleList)
                return

            default:
                return
        }
    }

    const forSaveClean = (basic:any, photoList:PictureInterface[]) => {
        const result = {...basic}
        result.etc = result.etc[0].etc
        Object.values(photoList[0]).filter((photo) => {
            basicRow.inspection_photo.filter((row, index) => {
                if(photo.sequence === row.sequence){
                    result.inspection_photo[index] = (photo)
                }
            })

        })
        let legendary = {}
        result.legendary_list.map((e) =>{
            legendary[e.legendary] = e.content
        })
        result.legendary_list = legendary;
    }


    useEffect(() => {
        // if(machine_id){
            // RequestMethod("get", "inspecLoadMachine",{
            //     path:{
            //         machine_id:machine_id
            //     }
            // } )
            //     .then((res) => {
            //         console.log("res : ", res)
            //     })
            //     .catch((err) => {
            //         console.log("err : ", err)
            //     })
        // }else{
        //     Notiflix.Report.warning("경고","기계 정보가 없습니다.","확인", () => router.back())
        // }
    }, []);
    return (
        <div>
            <DailyInspectionModal isOpen={infoModalOpen} setIsOpen={setInfoModalOpen} />
            <PageHeader
                title={"일상점검 정보 등록"}
                buttons={
                    ["점검 양식 검토", "저장하기"]
                }
                buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable headerList={columnlist.dailyInspectionMachine} row={[""]} setRow={() => {}} height={105}/>

            <ExcelTable headerList={columnlist.dailyInspectionMachinePicture} row={photoTitleList} setRow={(e) => {
                console.log("e : ", e)
                setPhotoTitleList(e)
            }} height={105}/>

            <div>
                <ExcelTable headerList={columnlist.dailyInspectionMachineLegendary}
                            row={basicRow.legendary_list}
                            setRow={(e) => {
                                basicRow.legendary_list = e;
                                setBasicRow({...basicRow})
                            }}
                            height={basicRow.legendary_list.length * 40 >= 40*18+56 ? 40*19 : basicRow.legendary_list.length * 40 + 40}
                />
                <ButtonGroup>
                    <DeleteButton>
                        -범례 삭제
                    </DeleteButton>
                    <AddButton  onClick={() => {
                        if(basicRow.legendary_list.length > 10){
                            Notiflix.Report.warning("경고","최대 10개까지 설정 가능합니다.","확인")
                        }else{
                            basicRow.legendary_list.push({seq:basicRow.legendary_list.length+1, legendary:"", content:""});
                            setBasicRow({...basicRow})
                        }
                    }}>+범례 추가</AddButton>
                </ButtonGroup>
            </div>
            <div>
                <ExcelTable
                    headerList={columnlist.dailyInspectionMachineCheck}
                    row={basicRow.check_list}
                    setRow={(e) => {
                        basicRow.check_list = e;
                        setBasicRow({...basicRow})
                    }}
                    height={basicRow.check_list.length * 40 >= 40*18+56 ? 40*19 : basicRow.check_list.length * 40 + 40}
                />
                <ButtonGroup>
                    <DeleteButton>
                        -검사 항목 삭제
                    </DeleteButton>
                    <AddButton  onClick={() => {
                        if(basicRow.check_list.length > 10){
                            Notiflix.Report.warning("경고","최대 10개까지 설정 가능합니다.","확인")
                        }else{
                            basicRow.check_list.push(
                                {
                                    sequence:basicRow.check_list.length+1,
                                    title:"",
                                    standard:"",
                                    method:"",
                                    type:0,
                                }
                            );
                            setBasicRow({...basicRow})
                        }
                    }}>+검사 항목 추가</AddButton>
                </ButtonGroup>
            </div>

            <ExcelTable headerList={columnlist.dailyInspectionMachineETC} row={basicRow.etc} setRow={(e) => {
                basicRow.etc = e
                setBasicRow({...basicRow})
            }} height={105}/>
        </div>
    )
}
const ButtonGroup = styled.div`
    width:100%;
    height:40px;
    display:flex;
    justify-content:space-between;
    margin-bottom:30px;
`;

const AddButton = styled.button`
    width:50%;
    height:40px;
    display:flex;
    justify-content:center;
    align-items:center;
    color:white;
    font-size:16px;
    background:black;
    font-weight:bold;
    border:none;
`;

const DeleteButton = styled(AddButton)`
    background:#777777;
`;

export const getServerSideProps = (ctx: NextPageContext) => {
    return {
        props: {
            machine_id: ctx.query.machine_id ?? 1,
        }
    }
}

export {BasicDailyInspectionInfo}

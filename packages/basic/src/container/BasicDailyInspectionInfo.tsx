import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared"
import Notiflix from "notiflix"
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import DailyInspectionModal from "../../../shared/src/components/Modal/DailyInspection/DailyInspectionModal";
import {TransferCodeToValue} from "shared/src/common/TransferFunction";

export interface IProps {
    machine_id?: number
    mold_id?: number
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
//
// export interface DailyInspection {
//     from_id:string
//     machine:any
//     inspection_photo:PictureInterface
//     legendary_list:object
//     check_list:{sequence:number, title:string, standard:string, method:string, type:0 | 1}[]
//     etc:{etc:string}[]
//     version:number
// }

const BasicDailyInspectionInfo = ({machine_id, mold_id}: IProps) => {
    console.log(machine_id, mold_id)
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any>(
        {
        machine:{additional: [],
            capacity: null,
            deviceIds: null,
            devices: [],
            factory: {
                additional: [],
                address: "서울 test0214",
                description: null,
                factory_id: 108,
                manager: null,
                managerId: 284,
                name: "test0214",
                subFactories: null,
                sync: "factory108",
                version: 3,
            },
            factoryId: 108,
            guideline: null,
            interwork: true,
            machine_id: 75,
            madeAt: "2022-02-04",
            manager: null,
            managerId: 284,
            mfrCode: "123123",
            mfrName: "지에스",
            name: "금형프레스",
            photo: null,
            products: [],
            qualify: null,
            sfId: 73,
            subFactory: {
                description: null,
                factory_id: 108,
                manager: null,
                managerId: null,
                name: "5555555555555",
                seq: 1,
                sf_id: 73,
                version: 2,
            },
            sync: "machine75",
            tons: 0,
            type: 1,
            version: 1,
            volt: 0,
            weldingType:0,
        },
        form_id:"",
        writer:{},
        manager:{},
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
        legendary_list: [{}],
        check_list:[],
        etc:[""],
        version:0
    }
    )


    const [modalSelectOption, setModalSelectOption] = useState<{ seq?: number, legendary?: string, content?: string, }[]>([]);

    const [photoTitleList, setPhotoTitleList] = useState<PictureInterface[]>(
        [{
            // machinePicture: {name:"", uuid:"", sequence:0},
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

    const [selectCheckListIndex, setSelectCheckListIndex] = useState<number>(null);
    const [selectLegendaryIndex, setSelectLegendaryIndex] = useState<number>(null);

    const onClickHeaderButton = (index:number) => {
        switch(index){
            case 0:
                setInfoModalOpen(true)
                return

            case 1:
                console.log("저장하기 : ", forSaveClean(basicRow, photoTitleList))
                return

            default:
                return
        }
    }

    const changeSetBasicRow = (basicRow:any) => {
        setBasicRow(basicRow);
    }
    const forSaveClean = (basic:any, photoList:PictureInterface[]) => {
        const result = {...basic}
        console.log("basic : ", basic, photoList)
        result.etc = result.etc[0].etc ?? [""]
        Object.values(photoList[0]).filter((photo) => {
            Object.keys(basicRow.inspection_photo).map((row, index) => {
                if(photo.sequence === basicRow.inspection_photo[row].sequence){
                    result.inspection_photo[row] = (photo)
                }
            })
        })
        let legendary = {}
        result.legendary_list.map((e) =>{
            legendary[e.legendary] = e.content
        })
        result.legendary_list = legendary;
        console.log("result : ", result)
        return result;
    }

    const settingMachineInfo = (machine) => {
        let machineInfo:any = {...machine};
        machineInfo.mfrName = machine?.mfrName;
        machineInfo.name = machine?.name;
        machineInfo.mfrCode = machine?.mfrCode;
        machineInfo.type = TransferCodeToValue(machine?.type, "machine");
        machineInfo.weldingType = TransferCodeToValue(machine?.weldingType, "welding");
        machineInfo.madeAt = machine?.madeAt;
        machineInfo.manager = machine?.manager;

        return [machineInfo]
    }

    const cleanUpData = (data:any) => {
        const resultData = {...data}
        console.log("data : ", data)
        resultData.etc = resultData.etc ?? [""]
        resultData.form_id = resultData.form_id ?? []
        resultData.legendary_list = resultData.legendary_list ?? []
        resultData.inspection_photo = resultData.inspection_photo.length === 0 ?
                {
                    machinePicture: {name: "", uuid: resultData.machine.photo, sequence: 22},
                    photo1: {name:"", uuid:"", sequence:1},
                    photo2: {name:"", uuid:"", sequence:2},
                    photo3: {name:"", uuid:"", sequence:3},
                    photo4: {name:"", uuid:"", sequence:4},
                    photo5: {name:"", uuid:"", sequence:5},
                    photo6: {name:"", uuid:"", sequence:6},
                    photo7: {name:"", uuid:"", sequence:7},
                    photo8: {name:"", uuid:"", sequence:8},
                    photo9: {name:"", uuid:"", sequence:9},
                }
            :
            [{
            machinePicture: {name:"", uuid:resultData.machine.photo, sequence:0},
            ...resultData.inspection_photo[0]
        }]

        setPhotoTitleList([{
            machinePicture: {name:"", uuid:resultData.machine.photo, sequence:0},
            // resultData.inspection_photo.
            // photo1: {name:"", uuid:"", sequence:1},
            // photo2: {name:"", uuid:"", sequence:2},
            // photo3: {name:"", uuid:"", sequence:3},
            // photo4: {name:"", uuid:"", sequence:4},
            // photo5: {name:"", uuid:"", sequence:5},
            // photo6: {name:"", uuid:"", sequence:6},
            // photo7: {name:"", uuid:"", sequence:7},
            // photo8: {name:"", uuid:"", sequence:8},
            // photo9: {name:"", uuid:"", sequence:9},
        }])
        setBasicRow(resultData)
    }

    useEffect(() => {
        // settingMachineInfo()
        if(machine_id){
            RequestMethod("get", "inspecLoadMachine",{
                path:{
                    machine_id:machine_id
                }
            } )
                .then((res) => {
                    console.log("res : ", res)
                    cleanUpData(res)
                    // setBasicRow(res) //여기서 machine에 date를 넣어줘야한다.(점검 날짜)
                })
                .catch((err) => {
                    console.log("err : ", err)
                })
        }else if(mold_id){
            RequestMethod("get", "inspecLoadMold",{
                path:{
                    mold_id:mold_id
                }
            } )
                .then((res) => {
                    console.log("res : ", res)
                    cleanUpData(res)
                    // setBasicRow(res) //여기서 machine에 date를 넣어줘야한다.(점검 날짜)
                })
                .catch((err) => {
                    console.log("err : ", err)
                })
        }else{
            // Notiflix.Report.warning("경고","기계 정보가 없습니다.","확인", () => router.back())
        }
    }, []);
    return (
        <div>
            <DailyInspectionModal isOpen={infoModalOpen} setIsOpen={setInfoModalOpen} basicRow={basicRow} setBasicRow={changeSetBasicRow} modalSelectOption={modalSelectOption}/>
            <PageHeader
                title={"일상점검 정보 등록"}
                buttons={
                    ["점검 양식 검토", "저장하기"]
                }
                buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable headerList={columnlist.dailyInspectionMachine} row={settingMachineInfo(basicRow.machine)} setRow={() => {}} height={105}/>

            <ExcelTable headerList={columnlist.dailyInspectionMachinePicture} row={photoTitleList} setRow={(e) => {
                // forSaveClean(basicRow, e)
                console.log("e :", e, basicRow)
                setPhotoTitleList(e)
                // forSaveClean(basicRow, e)
                setBasicRow(forSaveClean(basicRow, e))
                // setBasicRow({...basicRow, inspection_photo:[...basicRow.inspection_photo,  ...Object.values(e[0])] })
            }} height={105}/>

            <div>
                <ExcelTable headerList={columnlist.dailyInspectionMachineLegendary}
                            row={basicRow?.legendary_list}
                            setRow={(e) => {
                                basicRow?.legendary_list = e;
                                setBasicRow({...basicRow})
                                setModalSelectOption(e)
                            }}
                            setSelectRow={(index) => {
                                setSelectLegendaryIndex(index);
                            }}
                            height={basicRow.legendary_list?.length * 40 >= 40*18+56 ? 40*19 : basicRow.legendary_list?.length * 40 + 40}
                />
                <ButtonGroup>
                    <DeleteButton onClick={() => {
                        if(selectLegendaryIndex || selectLegendaryIndex === 0) {
                            basicRow.legendary_list.splice(selectLegendaryIndex, 1);
                            setSelectLegendaryIndex(null);
                            const endArray = basicRow.legendary_list.slice(selectLegendaryIndex)
                            endArray.map((array) => {
                                array.sequence = array.sequence-1
                            })
                        }
                    }}>
                        -범례 삭제
                    </DeleteButton>
                    <AddButton  onClick={() => {
                        if(basicRow.legendary_list.length > 9){
                            Notiflix.Report.warning("경고","최대 10개까지 설정 가능합니다.","확인")
                        }else{
                            basicRow.legendary_list.push({sequence:basicRow.legendary_list.length+1, legendary:"", content:""});
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
                        let result = [];
                        e.map((row) => {
                            if(row.type === "1") result.push({...row, type:1, columnType:"text"})
                            else if(row.type === "0") result.push({...row, type:0, columnType:"dropdown"})
                            else result.push({...row})
                        })
                        basicRow.check_list = result;
                        setBasicRow({...basicRow})
                        console.log("basicRow : ", basicRow)
                        // setBasicRow({...result})
                    }}
                    setSelectRow={(index) => {
                        setSelectCheckListIndex(index)
                    }}
                    height={basicRow.check_list?.length * 40 >= 40*18+56 ? 40*19 : basicRow.check_list?.length * 40 + 40}
                />
                <ButtonGroup>
                    <DeleteButton onClick={() => {
                        if(selectCheckListIndex || selectCheckListIndex === 0) {
                            basicRow.check_list.splice(selectCheckListIndex, 1);
                            setSelectCheckListIndex(null);
                            const endArray = basicRow.check_list?.slice(selectCheckListIndex)
                            endArray.map((array) => {
                                array.sequence = array.sequence-1
                            })
                        }

                    }}>
                        -검사 항목 삭제
                    </DeleteButton>
                    <AddButton  onClick={() => {
                        if(basicRow.check_list?.length > 9){
                            Notiflix.Report.warning("경고","최대 10개까지 설정 가능합니다.","확인")
                        }else{
                            basicRow.check_list?.push(
                                {
                                    sequence:basicRow.check_list?.length+1,
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
                basicRow.etc[0] = e[0]
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

import React, {useEffect, useState} from "react"
import styled from "styled-components"
import {columnlist, ExcelTable, Header as PageHeader, RequestMethod} from "shared"
import Notiflix from "notiflix"
import {NextPageContext} from "next";
import {useRouter} from "next/router";
import DailyInspectionModal from "../../../shared/src/components/Modal/DailyInspection/DailyInspectionModal";
import {TransferCodeToValue, TransferValueToCode} from "shared/src/common/TransferFunction";
import cookie from "react-cookies";

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
            type: 0,
            version: 1,
            volt: 0,
            weldingType:0,
        },
        form_id:"",
        writer:{},
        manager:{},
        inspection_photo:[],
        legendary_list: [],
        check_list:[],
        etc:[""],
    }
    )


    const [modalSelectOption, setModalSelectOption] = useState<{ sequence?: number, legendary?: string, content?: string, }[]>([]);

    const [photoTitleList, setPhotoTitleList] = useState<PictureInterface[]>([])

    const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false)

    const [selectCheckListIndex, setSelectCheckListIndex] = useState<number>(null)
    const [selectLegendaryIndex, setSelectLegendaryIndex] = useState<number>(null)

    const saveInspecMachine = async (data) => {
        await RequestMethod("post", "inspecMachineSave", data)
            .then((res) => {
                Notiflix.Report.success("저장되었습니다.","","확인", () => LoadInspecData("machine"))
            })
            .catch((err) => {
                console.log("err : ", err)
                Notiflix.Report.warning("경고",err.data.message,"확인")
            })
    }

    const saveInspecMold = async (data) => {
        await RequestMethod("post", "inspecMoldSave", data)
            .then((res) => {
                Notiflix.Report.success("저장되었습니다.","","확인", () => LoadInspecData("mold"))
            })
            .catch((err) => {
                console.log("err : ", err)
                Notiflix.Report.warning("경고",err.data.message,"확인")
            })
    }

    const onClickHeaderButton = (index:number) => {
        switch(index){
            case 0:
                setInfoModalOpen(true)
                return

            case 1:
                if(machine_id){
                    saveInspecMachine(forSaveClean(basicRow, photoTitleList))
                }else{
                    saveInspecMold(forSaveClean(basicRow, photoTitleList))
            }
                return

            default:
                return
        }
    }

    const changeSetBasicRow = (basicRow:any) => {
        setBasicRow(basicRow);
    }

    const forBindingClean = (basic:any, photoList:PictureInterface[]) => {
        const result = {...basic}
        // console.log("before photoList : ", photoList)
        // delete photoList[0].machinePicture
        // console.log("photoList[0] : ", photoList[0])
        result.inspection_photo = photoList[0]
        let legendary = {sequence:1, name:"", uuid:""}
        result.legendary_list.map((e) =>{
            legendary[e.legendary] = e.content
        })
        // if(result.legendary_list && result.legendary_list.length > 0){
        // }else{
            // result.legendary_list = [legendary];
        // }
        // console.log("??? machine : ", result)
        return result;
    }

    const forSaveClean = (basic:any, photoList:PictureInterface[]) => {
        const result = {...basic}
        let inspection_photo = [];
        // console.log("basic : ",basic)
        // console.log("photoList : ",photoList)
        result.etc = result.etc[0].etc ?? ""
        Object.values(photoList[0]).map((photo, index) => {
            Object.keys(basicRow.inspection_photo).map((row, index) => {
                if(row !== "machinePicture" && photo && photo.uuid !== "" && photo.sequence === basicRow.inspection_photo[row]?.sequence){
                    inspection_photo.push(photo);
                }
                // if(photo.sequence === basicRow.inspection_photo[row].sequence){
                //     result.inspection_photo[row] = (photo)
                // }
            })
        })
        basic.check_list.map((check) => {
            //점검 항목 type 변경시키기
            check.type = check.dropDown === "범례 적용" ? 1 : 0
        })
        let legendary = {}
        result.legendary_list.map((e) =>{
            legendary[e.legendary] = e.content
        })
        result.legendary_list = legendary;
        result.inspection_photo = inspection_photo;
        if(machine_id){
            result.machine.type = TransferValueToCode(result.machine.type, "machine")
        }
        // result.form_id = result.form_id ?? undefined
        return result;
    }

    const settingInfoData = (data ,type:"machine"|"mold") => {
        let productInfo:any = {...data}
        if(type === "machine"){
            productInfo = {...data.machine}
            productInfo.mfrName = data.machine?.mfrName
            productInfo.name = data.machine?.name
            productInfo.mfrCode = data.machine?.mfrCode
            productInfo.weldingType = TransferCodeToValue(data.machine?.weldingType, "welding")
            productInfo.madeAt = data.machine?.madeAt
            productInfo.manager = data.machine?.manager?.name
            productInfo.typePK = data.machine?.type
            productInfo.type = TransferCodeToValue(data.machine?.type, "machine")
        }else if(type === "mold"){
            productInfo = {...data.mold}
            productInfo.name = data.mold?.name
            productInfo.code = data.mold?.code
        }
        return [productInfo]
    }

    const cleanUpData = (data:any) => {
        const resultData = {...data}
        const writeUser = cookie.load('userInfo');
        const resultLegendaryList = []
        if(machine_id){
            let inspectionPhotoList = {
                machinePicture: {name: "", uuid: resultData?.machine?.photo ?? "", sequence: 0},
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
            if(resultData.legendary_list){
                Object.keys(resultData.legendary_list).map((key, index) => {
                    const oneLegendary:any = {}
                    oneLegendary.sequence = index+1
                    oneLegendary.legendary = key
                    oneLegendary.content = resultData.legendary_list[key]
                    resultLegendaryList.push(oneLegendary)
                })

            }
            Object.keys(inspectionPhotoList).map((value, index) => {
                resultData.inspection_photo.map((photo) => {
                    if(photo.sequence == index) inspectionPhotoList[value] = photo
                })
            })
            resultData.check_list.map((check, index) => {
                                        if(check.type === 1){
                                            check.dropDown = "범례 적용"
                                            check.columnType = "dropdown"
                                            // check.selectList = resultData.legendary_list
                                        }else{
                                            check.dropDown = "수치 입력"
                                            check.columnType = "text"
                                        }
                                    })

            resultData.etc = [{etc:resultData.etc}] ?? [{etc:""}]
            // resultData.manager = resultData.machine?.manager?.name
            resultData.form_id = resultData.form_id ?? undefined
            resultData.legendary_list =  resultLegendaryList
            resultData.inspection_photo = inspectionPhotoList

            setModalSelectOption(resultLegendaryList)
            setPhotoTitleList([{machinePicture: {name: "", uuid: resultData?.machine?.qualify/*photo*/, sequence: 22},...inspectionPhotoList}])
        }else if(mold_id){
            let inspectionPhotoList = {
                machinePicture: {name: "-", uuid: "", sequence: 0},
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
            if(resultData.legendary_list){
                Object.keys(resultData.legendary_list).map((key, index) => {
                    const oneLegendary:any = {}
                    oneLegendary.sequence = index+1
                    oneLegendary.legendary = key
                    oneLegendary.content = resultData.legendary_list[key]
                    resultLegendaryList.push(oneLegendary)
                })
            }

            Object.keys(inspectionPhotoList).map((value, index) => {
                resultData.inspection_photo.map((photo) => {
                    if(photo.sequence == index) {
                        inspectionPhotoList[value] = photo
                    }
                })
            })
            resultData.check_list.map((check, index) => {
                if(check.type === 1){
                    check.dropDown = "범례 적용"
                    check.columnType = "dropdown"
                    // check.selectList = resultData.legendary_list
                }else{
                    check.dropDown = "수치 입력"
                    check.columnType = "text"
                }
            })

            resultData.etc = [{etc:resultData.etc}] ?? [{etc:""}]
            resultData.form_id = resultData.form_id ?? undefined
            resultData.legendary_list =  resultLegendaryList
            resultData.inspection_photo = inspectionPhotoList


            setModalSelectOption(resultLegendaryList)
            setPhotoTitleList([{...inspectionPhotoList}])

        }
        resultData.writer = writeUser
        setBasicRow(resultData)
    }

    const LoadInspecData = async(type:"machine" | "mold") => {
        if(type === "machine"){
            await RequestMethod("get", "inspecLoadMachine",{
                path:{
                    machine_id:machine_id
                }
            } )
                .then((res) => {
                    cleanUpData(res)
                    // setBasicRow(res) //여기서 machine에 date를 넣어줘야한다.(점검 날짜)
                })
                .catch((err) => {
                    console.log("err : ", err)
                })
        }else if(type === "mold"){
            await RequestMethod("get", "inspecLoadMold",{
                path:{
                    mold_id:mold_id
                }
            } )
                .then((res) => {
                    cleanUpData(res)
                })
                .catch((err) => {
                    console.log("err : ", err)
                })
        }
    }

    useEffect(() => {
        LoadInspecData(machine_id ? "machine" : "mold")
    }, []);
    return (
        <div>
            <DailyInspectionModal isOpen={infoModalOpen} setIsOpen={setInfoModalOpen} basicRow={basicRow} setBasicRow={changeSetBasicRow} modalType={machine_id ? "machine" : "mold"} modalSelectOption={modalSelectOption}/>
            <PageHeader
                title={"일상점검 정보 등록"}
                buttons={
                    ["점검 양식 검토", "저장하기"]
                }
                buttonsOnclick={onClickHeaderButton}
            />
            <ExcelTable headerList={machine_id ?
                columnlist.dailyInspectionMachine
                :
                columnlist.dailyInspectionMold
            } row={settingInfoData(basicRow, machine_id ? "machine" : "mold")} setRow={() => {}} height={105}/>

            <ExcelTable headerList={machine_id ? columnlist.dailyInspectionMachinePicture : columnlist.dailyInspectionMoldPicture} row={photoTitleList} setRow={(e) => {
                Object.keys(e[0]).map((value,index) => {
                    if(e[0][value] == null){
                        e[0][value] = {name:"", uuid:"", sequence:index}
                    }else if(value === "isChange"){
                       delete e[0][value]
                    }
                })
                setPhotoTitleList([{...e[0], machinePicture:e[0]?.machinePicture}])
                setBasicRow(forBindingClean(basicRow, e))
            }} height={105}/>

            <div>
                <ExcelTable headerList={columnlist.dailyInspectionMachineLegendary}
                            row={basicRow?.legendary_list}
                            setRow={(e) => {
                                //@ts-ignore
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
                            basicRow?.legendary_list?.push({sequence:basicRow.legendary_list.length+1, legendary:"", content:""});
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
                            // if(row.type === 0 || row.setting === 0) result.push({...row, dropDown:"수치 입력", columnType:"text"})
                            if(row.dropDownPK === 0) {
                                result.push({...row, dropDown: "수치 입력", columnType: "text"})
                            }
                            // else if(row.type === 1 || row.setting === 1) result.push({...row, dropDown:"범례 적용", columnType:"dropdown"})
                            else if(row.dropDownPK === 1) {
                                result.push({...row, dropDown: "범례 적용", columnType: "dropdown"})
                            }
                            else result.push({...row,})
                        })
                        basicRow.check_list = result
                        setBasicRow({...basicRow})
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

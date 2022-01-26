import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../common/@types/type";
import {MidrangeFormReviewModal} from "../Modal/MidrangeFormReviewModal";
import Notiflix from "notiflix";
import {RequestMethod} from "../../common/RequestFunctions";


interface IProps {
    row: any
    column: IExcelHeaderType
}

const selectList = [
    {pk: '0', name: '반제품'},
    {pk: '1', name: '재공품'},
    {pk: '2', name: '완제품'},
]

const MidrangeFrameButton = ({row, column }: IProps) => {
    const [modalOpen, setModalOpen] = React.useState<boolean>(false)
    const [modify, setModify] = React.useState<boolean>(false)
    const [execlInfo, setExcelInfo] = React.useState({sic_id: '',record_id: '',basic: [], samples:[], legendary: [], inspection_info: {}})

    const midrangeRecordInspectLoad = async () => {

        const res = await RequestMethod('get', `recordInspectFrame`,{
            path: {
                product_id: row.product.product_id
            }
        })

        if(res){
            const legendaryValue = Object.values(res.legendary_list)

            const legendaryArray = legendaryValue.map((v,i)=>{
                return v
            })

            const processName = row.product.process === null ? '-' : row.process.process.name
            const machineName = row.machines.length === 0 ? '-' : row.machines.length > 1 ? row.machines[0].machine.machine.name +' 외'+`${row.machines.length-1} 개` : row.machines[0].machine.machine.name

            setExcelInfo({sic_id: res.sic_id, record_id: row.record_id ,basic: [{osd_id: row.identification, lot_number: row.lot_number, code: row.product.code, material_name: row.product.name, type: row.type , process_id: processName, worker_name: row.user.name, name: machineName}], samples: [{samples: res.samples}], legendary: legendaryArray, inspection_info: res.inspection_info})
            setModalOpen(true)
        }
    }

    const midrangeRecordInspectResultLoad = () => {

        const processName = row.product.process === null ? '-' : row.process.process.name
        const machineName = row.machines.length === 0 ? '-' : row.machines.length > 1 ? row.machines[0].machine.machine.name +' 외'+`${row.machines.length-1} 개` : row.machines[0].machine.machine.name

        setExcelInfo({writer: row.inspection_category.writer,version: row.inspection_category.version, sic_id: row.inspection_category.sic_id, record_id: row.record_id, basic: [{osd_id: row.identification, lot_number: row.lot_number, code: row.product.code, material_name: row.product.name, type: row.type , process_id: processName, worker_name: row.user.name, name: machineName}], samples: [{samples: row.inspection_category.inspection_info.beginning[0].samples}], legendary: row.inspection_category.legendary_list, inspection_info: row.inspection_category.inspection_info, inspection_time: row.inspection_category.inspection_time, inspection_result: row.inspection_category.inspection_result})
        setModalOpen(true)
        setModify(true)
    }

    const contentCheck = () => {
        if(row.inspection_category !== null){
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}}  onClick={() => midrangeRecordInspectResultLoad()}>
                        <p style={{color: 'white', textDecoration: 'underline'}}>결과 보기</p>
                    </UploadButton>
                </div>
            </>)
        }else{
            return (<>
                <div style={{
                    padding: '3.5px 0px 0px 3.5px',
                    width: '100%'
                }}>
                    <UploadButton  onClick={() => midrangeRecordInspectLoad()}>
                        <p>검사 등록</p>
                    </UploadButton>
                </div>
            </>)
        }
    }

    return (
        <>
            <MidrangeFormReviewModal isOpen={modalOpen} setIsOpen={setModalOpen} formReviewData={execlInfo} modify={modify}/>
            {contentCheck()}
        </>
    );
}

export {MidrangeFrameButton};

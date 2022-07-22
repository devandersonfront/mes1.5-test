import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../common/@types/type";
import {MidrangeFormReviewModal} from "../Modal/MidrangeFormReviewModal";
import Notiflix from "notiflix";
import {RequestMethod} from "../../common/RequestFunctions";
import {MidrangeRegisterModal} from "../Modal/MidrangeRegisterModal";
import {POINT_COLOR} from "../../common/configset";


interface IProps {
    row: any
    column: IExcelHeaderType
}

const MidrangeFrameButton = ({row, column }: IProps) => {
    const [modalOpen, setModalOpen] = React.useState<boolean>(false)
    const [modify, setModify] = React.useState<boolean>(false)
    const [execlInfo, setExcelInfo] = React.useState<{writer?: string,version?: number, sic_id: string, record_id: number, basic: {osd_id: string, lot_number: number, code: string, material_name: string, type: number , process_id: string, worker_name: string, name: string}[] | [], samples: {samples: number}[], legendary: string[], inspection_info: {}, inspection_time?: {}, inspection_result?: []}>({sic_id: '',record_id: 0,basic: [], samples:[], legendary: [], inspection_info: {}})

    const midrangeRecordInspectLoad = async () => {
        const res = await RequestMethod('get', `recordInspectFrame`,{
            path: {
                product_id: row.product.product_id
            }
        })
        if(res){
            let machineName
            const processName = row.product.process === null ? '-' : row.product.process.name
            if(row.machines !== null) {
                machineName = row.machines.length === 0 ? '-' : row.machines.length > 1 ? row.machines[0].machine.machine.name + ' 외' + `${row.machines.length - 1} 개` : row.machines[0].machine.machine.name
            }else {
                machineName = '-'
            }

            let worker
            if(typeof row.user === "object"){
                worker = row.user.name
            }else if (typeof row.user === 'string'){
                worker = row.user
            }
            setExcelInfo({sic_id: res.sic_id, record_id: row.record_id ,basic: [{osd_id: row.identification, lot_number: row.lot_number, code: row.product.code, material_name: row.product.name, type: row.type , process_id: processName, worker_name: worker, name: machineName}], samples: [{samples: res.samples}], legendary: ['선택 없음',...res.legendary_list], inspection_info: res.inspection_info})
            setModalOpen(true)
        }else {
            Notiflix.Report.warning('검사 항목을 등록해주세요.','','확인');
        }
    }

    React.useEffect(()=>{
    },[modalOpen])

    const midrangeRecordInspectResultLoad = () => {

        let processName = "-"
        let machineName = "-"

        if(row.machines){
            machineName = row.machines.length === 0 ? '-' : row.machines.length > 1 ? row.machines[0].machine.machine.name +' 외'+`${row?.machines.length-1} 개` : row?.machines[0].machine.machine.name
        }
        if(row.product && row.product.process){
            processName = row.product?.process === null ? '-' : row.product.process.name
        }

        let worker
        if(typeof row.user === "object"){
            worker = row.user.name
        }else if (typeof row.user === 'string'){
            worker = row.user
        }

        setExcelInfo({writer: row.inspection_category.writer,version: row.inspection_category.version, sic_id: row.inspection_category.sic_id, record_id: row.record_id, basic: [{osd_id: row.identification, lot_number: row.lot_number, code: row.product.code, material_name: row.product.name, type: row.type , process_id: processName, worker_name: worker, name: machineName}], samples: [{samples: row.inspection_category.inspection_info.beginning[0].samples}], legendary: row.inspection_category.legendary_list, inspection_info: row.inspection_category.inspection_info, inspection_time: row.inspection_category.inspection_time, inspection_result: row.inspection_category.inspection_result})
        setModalOpen(true)
        setModify(true)
    }

    const contentCheck = () => (
        <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%'
        }}>
            <UploadButton
                hoverColor={POINT_COLOR}
                haveId={row.inspection_category !== null}
                onClick={() => {
                    if(row.inspection_category !== null){
                        midrangeRecordInspectResultLoad()
                    }else{
                        midrangeRecordInspectLoad()
                    }
                }}
            >
                <p>{row.inspection_cat록egory !== null ? "결과 보기" : "결과 등록"}</p>
            </UploadButton>
        </div>
    )
    return (
        <>
            <MidrangeRegisterModal isOpen={modalOpen} setIsOpen={setModalOpen} formReviewData={execlInfo} modify={modify} reloadPage={row.loadPage}/>
            {contentCheck()}
        </>
    );
}

export {MidrangeFrameButton};

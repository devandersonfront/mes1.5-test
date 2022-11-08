import React from 'react';
import {useRouter} from "next/router";
import {CellButton, UploadButton} from "../../styles/styledComponents";
import {IExcelHeaderType} from "../../@types/type";
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
    const [execlInfo, setExcelInfo] = React.useState<{writer?: string,version?: number, sic_id: string, record_id: number, basic: {osd_id: string, lot_number: number, code: string, material_name: string, type: number , process_id: string, worker_name: string, name: string}[] | [], samples?: number, legendary: string[], inspection_info: {}, inspection_time?: {}, inspection_result?: []}>({sic_id: '',record_id: 0,basic: [], samples:undefined, legendary: [], inspection_info: {}})
    const hasResult = row.inspection_category !== null

    const getInspectionCategory = async () => {
        return await RequestMethod('get', `recordInspectFrame`,{
            path: {
                product_id: row.product.product_id
            }
        })
    }

    const onClickEvent = async ()=> {
        const inspection_category = hasResult ? row.inspection_category : await getInspectionCategory()
        if(inspection_category)
        {
            const excelInfo = {
                writer: inspection_category.writer ?? undefined,
                version: inspection_category.version ?? undefined,
                sic_id: inspection_category.sic_id ?? undefined,
                record_id: row.record_id ?? undefined,
                operation_inspection_id: inspection_category.operation_inspection_id ?? undefined,
                basic: [ {
                    osd_id: row.identification,
                    lot_number: row.lot_number,
                    code: row.product?.code ?? '-',
                    material_name: row.product?.name ?? '-',
                    type: row.type,
                    process_id: row.product?.process?.name ?? '-',
                    worker_name: row.user?.name ?? '-',
                    name: row.machines?.[0]?.name ?? '-',
                }],
                samples: inspection_category.inspection_info?.beginning?.[0]?.samples ?? undefined,
                legendary: hasResult ? inspection_category.legendary_list : [
                    '선택 없음',...inspection_category.legendary_list
                ],
                inspection_info: inspection_category?.inspection_info ?? null,
                inspection_time: inspection_category?.inspection_time ?? null,
                inspection_result: inspection_category?.inspection_result ?? null,
            }
            setExcelInfo(excelInfo)
            setModalOpen(true)
        }else {
            Notiflix.Report.warning('검사 항목을 등록해주세요.','','확인');
        }
    }

    const contentCheck = () => (
        <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%'
        }}>
            <UploadButton
                hoverColor={POINT_COLOR}
                haveId={hasResult}
                onClick={() => onClickEvent()}
            >
                <p>{hasResult ? "결과 보기" : "결과 등록"}</p>
            </UploadButton>
        </div>
    )
    return (
        <>
            { modalOpen && <MidrangeRegisterModal isOpen={modalOpen} setIsOpen={setModalOpen} data={execlInfo} modify={hasResult} reload={row.reload}/>}
            {contentCheck()}
        </>
    );
}

export {MidrangeFrameButton};

import React, {useEffect, useState} from "react"
import {ExcelTable} from "../../Excel/ExcelTable";
import {POINT_COLOR} from "../../../common/configset";
import Modal from "react-modal";
import {Select} from "@material-ui/core";
import {MoldRegisterModal} from "../MoldRegisterModal";
import IcX from "../../../../public/images/ic_x.png";
import styled from "styled-components";
import {searchModalList} from "../../../common/modalInit";
import {RequestMethod} from "../../../common/RequestFunctions";
import {ParseResponse} from "../../../common/Util";
import { useRouter } from "next/router";
import Notiflix from "notiflix";
import {NoAmountValidation, NoneSelectedValidation, RequiredValidation} from "../../../validations/Validation";

interface IProps {
    row: any
    isOpen?: boolean
    setIsOpen?: (isOpen: boolean) => void
}

const OperationRegisterModal = ({row, isOpen, setIsOpen}) => {
    const router = useRouter()
    const [basicRow, setBasicRow] = useState<any[]>([])
    const [column, setColumn] = useState(searchModalList.operationRegister)

    const getBomData = async(root_id:string) => {
        const res = await RequestMethod('get', `bomLoad`, {path: {key: root_id}})
        const parsedRes = ParseResponse(res)
        return parsedRes
    }

    const totalData = async() => {
        setBasicRow(await Promise.all(row.map(async(v) =>{
            // const getData = await getBomData(v.bom_root_id)
            return {
                identification:v?.operationData?.contract.identification,
                bom_root_id:v.bom_root_id,
                date: v?.operationData?.date,
                deadline: v?.operationData?.deadline,
                product_id: v?.product_id ?? v?.code,
                customer_id: v?.customer_id,
                cm_id: v?.cm_id,
                name: v?.name,
                type: v?.type,
                unit: v?.unit,
                amount: v?.amount,
                process_id: v?.process_id ?? v?.process,
                goal: v?.operationData?.goal ?? 0,
                input: v?.operationData,
            }
        })))
        // setBasicRow(row.map((data) => {
        //     return data.operationData
        // }))
    }
    const validateSaveRequest = (selectedData: any[]) => {
        return NoneSelectedValidation(selectedData) ||
            RequiredValidation('product_id', selectedData,"CODE OR 수주번호를 선택해주세요.") ||
            // RequiredValidation('input_bom', selectedData,"자재 보기를 눌러 BOM 등록을 해주세요.") ||
            NoAmountValidation('goal', selectedData, "목표 생산량을 입력해 주세요.")
    }

    const SaveBasic = async (selectedData: any[]) => {
        if(validateSaveRequest(selectedData)) return
        let res: any
        res = await RequestMethod('post', `sheetSave`,
            selectedData.map((row, i) => {
                let selectKey: string[] = []
                column.map((v) => {
                    if (v.selectList) {
                        selectKey.push(v.key)
                    }
                })
                let selectData: any = {}

                Object.keys(row).map(v => {
                    if (v.indexOf('PK') !== -1) {
                        selectData = {
                            ...selectData,
                            [v.split('PK')[0]]: row[v]
                        }
                    }

                })
                return {
                    ...row,
                    ...selectData,
                    contract: selectedData[0].contract,
                    os_id: undefined,
                    version: undefined,
                    input_bom: [ ...row?.input_bom?.map((bom) => {
                        bom.bom.setting = bom.bom.setting === "여" || bom.bom.setting === 1 ? 1 : 0
                        return { ...bom }
                    }) ] ?? [],
                    status: 1,
                }
            }))
        if (res) {
            Notiflix.Report.success('저장되었습니다.', '', '확인', () => {
                router.push('/mes/operationV1u/list')
            });
        }
    }
    useEffect(() => {
        if(isOpen){
            totalData()
        }
    },[])


    return(
        <div>
            <Modal isOpen={isOpen} style={{
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    padding: 0,
                },
                overlay: {
                    background: 'rgba(0,0,0,.6)',
                    zIndex: 5,
                }
            }}>
                <div style={{
                    width: 1776,
                    height: 816,
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent: 'space-between',
                }}>
                    <div id={'content-header'} style={{
                        marginTop: 24,
                        marginLeft: 16,
                        marginRight: 16,
                        marginBottom: 12,
                        display: 'flex',
                        justifyContent: 'space-between'
                    }}>
                        <h2>작업지시서 확인</h2>
                    </div>
                    <ExcelTable
                        resizable
                        headerList={column}
                        row={basicRow}
                        setRow={(e) => {
                            setBasicRow(e)
                        }}
                        width={1744}
                        rowHeight={32}
                        height={640}
                        type={'searchModal'}
                    />
                    </div>
                    <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
                        <FooterButton
                            onClick={() => {
                                setIsOpen(false)
                                router.push("/mes/order/list")
                            }}
                            style={{backgroundColor: '#E7E9EB'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </FooterButton>
                        <FooterButton
                            onClick={() => {
                                //setBasicRow(basicRow)
                                SaveBasic(basicRow.map(v=> {
                                    return {...v.input,
                                            product_id:v.input?.product?.product_id,
                                            goal:v.goal
                                    }
                                }))
                            }}
                            style={{backgroundColor: POINT_COLOR}}
                        >
                            <p style={{color: '#0D0D0D'}}>등록하기</p>
                        </FooterButton>
                    </div>
            </Modal>
        </div>
    )
}


const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items:center;
`

const FooterButton = styled.div`
  width: 50%; 
  height: 40px;
  display: flex; 
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`


export default OperationRegisterModal

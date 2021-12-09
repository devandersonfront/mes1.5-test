import React, {useState} from "react";
import DaumPostcode from "react-daum-postcode";
import Modal from "react-modal";
import {IExcelHeaderType} from "../../common/@types/type";
import {POINT_COLOR} from "../../common/configset";
//@ts-ignore
import IcSearchButton from "../../../public/images/ic_search.png";
//@ts-ignore
import IcXButton from "../../../public/images/ic_x.png";


interface IProps {
    column: IExcelHeaderType
    row: any
    onRowChange: (e: any) => void
}

const DaumAddressModal = ({ row, column, onRowChange }:IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleComplete = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }
        onRowChange({...row, address:fullAddress, isChange: true})
        setIsOpen(false)
    }

    const ModalContents = () => {
        return <>
            <div style={{width: 'calc(100% - 40px)', height: 40}} onClick={() => {
                setIsOpen(true)
            }}>
                { row[`${column.key}`]}
            </div>
            <div style={{
                display: 'flex',
                // backgroundColor: POINT_COLOR,
                width: 38,
                height: 38,
                justifyContent: 'center',
                alignItems: 'center'
            }} onClick={() => {
                setIsOpen(true)
            }}>
                <img style={{width: 20, height: 20}} src={IcSearchButton}/>
            </div>
        </>
    }

    return (
        <div>
            {ModalContents()}
            <Modal
                isOpen={isOpen}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        padding: 0
                    },
                    overlay: {
                        background: 'rgba(0,0,0,.6)',
                        zIndex: 101
                    }
                }}
            >
                <div style={{width:800, height:40, background:"white", display:"flex", justifyContent:"right"}}>
                    <img src={IcXButton} style={{width:45, height:45}} onClick={() => {
                        setIsOpen(false)
                    }}/>
                </div>
                <DaumPostcode
                        onComplete={handleComplete}
                        style={{width:800, height:800}}
                    />

            </Modal>

        </div>
    )
}

export default DaumAddressModal;

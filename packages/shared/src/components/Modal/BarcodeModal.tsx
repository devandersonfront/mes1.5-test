import React from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
//@ts-ignore
import Barcode from 'react-barcode';
import axios from 'axios';
import DomToImage from "dom-to-image";
import Notiflix from "notiflix";

interface Props {

    title : string,
    handleBarcode : (url : string , id : string , clientIp : string) => void
    handleModal : (isOpen : boolean) => void
    isOpen : boolean
    data : any
    type : 'rawMaterial' | 'product'

}

const BarcodeModal = ({title,type,handleBarcode,handleModal,data,isOpen} : Props) => {


    const numberOfType = (type : 'rawMaterial' | 'product') => {

        switch(type){
            case 'rawMaterial' :
                return '001'
            case 'product' :
                return '002'
            default :
                return undefined
        }
    }

    const makeBarcode = (barcodeId : string | number) => {

        if(barcodeId){

            const id = String(barcodeId).padStart(20, '0')
            const delimit = "-"
            const key = "78423304"
            const typeCode = numberOfType(type)

            return  typeCode + delimit + id
        }

    }

    const onCaptureDOM = async (type,data) => {

        const id = (type === 'rawMaterial' ? data?.rm_id : data?.product_id)
        const dom  = document.getElementById('capture_dom')
        const dataurl = await DomToImage.toPng(dom, {quality: 1})
        await axios.get('https://api.ipify.org?format=json')
                .then(({data})=>{
                    console.log(data.ip,'ip')
                    handleBarcode(dataurl,id,data.ip)
                }).catch((error)=>{
                if(error){
                    Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
                    return false
                }
            })
    }



    const onClose = () => {

        handleModal(isOpen)

    }

    const convertDataToArray = (data : any) => {

        if(type === 'rawMaterial'){
            return [
                {id : '1' , title : 'CODE' , value :data?.code ?? '-'},
                {id : '2', title :'품명' , value : data?.name ?? '-'},
                {id : '3' , title :'거래처', value : data?.customer_id ?? '-'},
                {id : '4' ,title :'사용기준일(일)', value :data?.expiration ?? '-'}
            ]

        }else if(type === 'product'){

            return [
                {id : '1', title : '거래처' , value : data?.customer_id ?? '-'},
                {id : '2' , title : '모델', value : data?.model?.model ?? '-'},
                {id : '3' , title : 'CODE', value :data?.code ?? '-'},
                {id : '4' , title : '품명', value : data?.name ?? '-'},
                {id : '5' , title : '품목종류', value : data?.type ?? '-'}
            ]
        }

    }

    const printBarcode = (type : 'rawMaterial' | 'product' , data : any) => {

        if(data){

            const convertData = convertDataToArray(data)
            const encrypt = makeBarcode(type === 'rawMaterial' ? data?.rm_id : data?.product_id )

            return (
                    <BarcodeBox id={'capture_dom'}>
                        {convertData.map((data)=>(
                            <BarcodeItem key={data.id}>
                                <Label htmlFor={data.title}>{data.title}</Label>
                                <LabelValue id={data.title}>{data.value}</LabelValue>
                            </BarcodeItem>
                                ))
                            }
                        <Wrap>
                            <Barcode value ={encrypt} displayValue={false} renderer={'canvas'} />
                        </Wrap>
                    </BarcodeBox>
            )
        }

    }

    return(
        <BasicModal
            isOpen={isOpen}
            onClose={onClose}
            >
            <TitleContainer>
                <TitleSpan>{title}</TitleSpan>
                <Button onClick={() => onCaptureDOM(type,data)}>
                    {'인쇄'}
                </Button>
            </TitleContainer>
            <div style={{display : 'flex' , justifyContent : 'center' , alignItems : 'center' , height : '100%'}}>
                {printBarcode(type , data)}
            </div>
        </BasicModal>

    )

}


export {BarcodeModal}



const TitleContainer = Styled.div`

    display : flex;
    justify-content : space-between;
    align-items : center;

`

const TitleSpan = Styled.span`

    font-size : 22px;
    font-weight: bold; 

`

const Button = Styled.button`

    background-color : #3D414E;
    color :#FFFFFF;
    display : flex;
    justify-content : center;
    align-items : center;
    font-size : 13px;
    width : 50px;
    height: 30px;
    padding: 0;
    border: none;
    cursor : pointer;
`

const BarcodeBox = Styled.div`

    width : 790px;
    height : 474px;
    border : 1px solid #000000;
    padding : 24px 24px 16px 24px;
    display : flex;
    flex-direction : column;
    justify-content : space-between;

`

const BarcodeItem = Styled.div`

    display : flex;
    justify-content : space-between;
`

const Label = Styled.label`

    font-size : 40px;
    font-weight: bold;
    width : 300px;
    height : 60px;
    text-align : left;
    display : flex;
    align-items : center;

`

const LabelValue = Styled.span`

    font-size : 40px;
    width : 400px;
    height : 60px;
    text-align : left;
    display : flex;
    align-items : center;
    line-height: 36px;

`

const Wrap = Styled.div`

    canvas {
        width: 100%;
        height: 100px;
    }
`;


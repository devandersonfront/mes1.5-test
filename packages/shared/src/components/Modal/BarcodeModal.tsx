import React from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
import Barcode from 'react-barcode';
import axios from 'axios';
import domtoimage from 'dom-to-image';

interface Props {

    title : string,
    isOpen : boolean
    setIsOpen: (ioOpen: boolean) => void
    barcodeData : any,
    type : 'rawMaterial' | 'product'

}

// const rawMaterialType = ['CODE' , '모델']
// const productType = ['CODE' , '모델' , 'CODE' , '품명' , '품류종류']


const BarcodeModal = ({title,isOpen,setIsOpen,barcodeData,type} : Props) => { 

    const barcodePrintApi = async (dataurl) => {

        await axios.post('http://192.168.0.49:18080/WebPrintSDK/Printer1', 
        {
          "id":1,
          "functions":
          {"func0":{"checkLabelStatus":[]},
            "func1":{"clearBuffer":[]},
            "func2":{"drawBitmap":[dataurl,20,0,800,0]},
            "func3":{"printBuffer":[]}
          }
        },
        {
          headers : {
            'Content-Type' : 'application/x-www-form-urlencoded'
          }
        }
        )
      }
    
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

    const makeBarcode = (barcodeId : string) => {

        const id = barcodeId?.padStart(20, '0')
        const delimit = "-"
        const key = "78423304"
        const typeCode = numberOfType(type)
        return  typeCode + delimit + id

    }

    const onCaptureDOM = async () => {

        const dom  = document.getElementById('capture_dom')
        const dataurl = await domtoimage.toPng(dom, {quality: 1})
        barcodePrintApi(dataurl)
    }

    // product냐 또는 rawMaterial 이냐에 따라 달라짐
    const printBarcode = () => {

        const encrypt = makeBarcode(barcodeData?.id)

        return (
            <>
                <BarcodeBox id={'capture_dom'}>
                    <BarcodeItem>
                        <Label htmlFor='Code'>CODE</Label>
                        <LabelValue id='Code'>SUS-111</LabelValue>
                    </BarcodeItem>
                    <BarcodeItem>
                        <Label htmlFor='Code'>품명</Label>
                        <LabelValue id='Code'>SUS360</LabelValue>
                    </BarcodeItem>
                    <BarcodeItem>
                        <Label htmlFor='Code'>거래처</Label>
                        <LabelValue id='Code'>한국상사</LabelValue>
                    </BarcodeItem>
                    <BarcodeItem>
                        <Label htmlFor='Code'>사용기준일(일)</Label>
                        <LabelValue id='Code'>10</LabelValue>
                    </BarcodeItem>
                    <Wrap>
                        <Barcode value ={encrypt} displayValue={false} renderer={'canvas'} />
                    </Wrap>
                </BarcodeBox>
            </>
        )

    }

    console.log(isOpen,'isOpenisOpenisOpen')

    return(
        <BasicModal 
            isOpen={isOpen} 
            onClose={()=>setIsOpen(false)}
            >
            <TitleContainer>
                <TitleSpan>{title}</TitleSpan>
                <Button onClick={onCaptureDOM}>
                    {'인쇄'}
                </Button>
            </TitleContainer>
            <div style={{display : 'flex' , justifyContent : 'center' , alignItems : 'center' , height : '100%'}}>
                {printBarcode()}
            </div>
        </BasicModal>

    )

}


export {BarcodeModal}

const TitleContainer = Styled.div`

    display : flex;
    justify-content : space-between;

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
    width : 108px;
    height: 20px;
    padding: 0;
    border: none;
`

const BarcodeBox = Styled.div`

    width : 790px;
    height : 474px;
    border : 1px solid #000000;
    padding : 24px 24px 16px 24px;

`

const BarcodeItem = Styled.div`

    display : flex;
    justify-content : space-between;
    margin-bottom : 10px;
`

const Label = Styled.label`

    font-size : 40px;
    font-weight: bold;
    width : 300px;
    height : 50px;
    text-align : right;
    display : flex;
    align-items : center;

`

const LabelValue = Styled.span`

    font-size : 40px;
    width : 400px;
    height : 50px;
    text-align : right;
    display : flex;
    align-items : center;

`

const Wrap = Styled.div`
    
    margin-top : 50px;

    canvas {
        width: 100%;
        height: 100px;
    }
`;


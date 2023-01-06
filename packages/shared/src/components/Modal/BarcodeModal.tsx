import React from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
//@ts-ignore
import Barcode from 'react-barcode';
import axios from 'axios';
import DomToImage from "dom-to-image";
import Notiflix from "notiflix";
import {BarcodeDataType} from '../../common/barcodeType'
import {RequestMethod} from "../../Functions/RequestFunctions";
import {result} from "lodash";
import cookie from "react-cookies";
import {useSelector} from "react-redux";
import {selectUserInfo} from "../../reducer/userInfo";
import {barcodeOfCompany} from "../../common/companyCode/companyCode";
import {SF_ENDPOINT_BARCODE} from "../../common/configset";



interface Props {
    multiple ?: boolean
    title : string,
    handleBarcode : (url : any ,clientIp : string) => void
    handleModal : (type : string , isVisible : boolean) => void
    data : BarcodeDataType[]
    type : 'rawMaterial' | 'product' | 'record'
    isVisible : boolean
}

const BarcodeModal = ({multiple,title,type,handleBarcode,handleModal,data,isVisible} : Props) => {

    const [selectIndex, setSelectIndex] = React.useState<number>(0)
    const [imageSrc, setImageSrc] = React.useState<any>()
    const userInfo = useSelector(selectUserInfo)

    //성화 , 가나공업 , DS 만 CompanyCode 를 보내면 됨
    //없는건 null
    //가로 * 세로로 보냄

    const getLocalAddress = async () => {

        return await fetch('http://api.ipify.org/?format=json')
            .then(response => response.json())
            .then(result => result)
            .catch((error)=>{
                if(error){
                    Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
                }
            })
    }

    const onCaptureDOM = async () => {
        const {ip}  = await getLocalAddress()
        handleBarcode(imageSrc,ip)
    }

    const onCaptureAllDOM = async (data : BarcodeDataType[]) => {
        const {ip} = await getLocalAddress()
        const images = await Promise.all(
            data.map((barcodeData)=> getBarcodeImage(barcodeData))
        )
        handleBarcode(images,ip)
    }

    const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {

        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);

    });

    const getBarcodeImage = async (data : BarcodeDataType) => {
        const tokenData = userInfo?.token;
        let blobData :Blob
        Notiflix.Loading.circle()
        await axios.post(`${SF_ENDPOINT_BARCODE}/api/v1/barcode/generate`, {
                ...data,
            },
            {
                responseType:'blob',
                params : {company : barcodeOfCompany(userInfo.companyCode).companyCode},
            })
            .then((res) => {
                Notiflix.Loading.remove()
                blobData = res.data
            }).catch((err) => {
                Notiflix.Loading.remove()
            })

        return await convertBlobToBase64(blobData)
    }

    const onClose = () => {
        handleModal('barcode' ,false)
        setSelectIndex(0)
    }

    const printBarcode = () => {
        if(data){
            return (
                <BarcodeBox id={'capture_dom'}>
                    <Wrap>
                        <img id={"barcode"} src={imageSrc} style={{width:"100%", height:"100%"}} />
                    </Wrap>
                </BarcodeBox>
            )
        }
    }

    React.useEffect(() => {
        (async () => {
            if(isVisible){
                const image = await getBarcodeImage(data[0])
                setImageSrc(image)
            }
        })();
    }, [isVisible]);

    const firstPage = selectIndex + 1  === 1
    const lastPage = selectIndex + 1 >= data.length

    return(
        <BasicModal
            isOpen={isVisible}
            onClose={onClose}
        >
            <TitleContainer>
                <TitleSpan>{title}</TitleSpan>
                <ButtonList>
                    <Button onClick={() => onCaptureDOM()}>
                        {'해당 페이지 인쇄'}
                    </Button>
                    {
                        multiple  &&
                        <Button onClick={() => onCaptureAllDOM(data)}>
                            {'모든 페이지 인쇄'}
                        </Button>
                    }
                </ButtonList>
            </TitleContainer>
            <div style={{display : 'flex' , justifyContent : 'space-around' , alignItems : 'center' , height : '100%'}}>
                {data?.length > 1 ?
                    <>
                        <div style={{height: '100%', display: 'flex', alignItems: 'center', flex:0.25, justifyContent: 'center', cursor: !firstPage && 'pointer'}} onClick={
                            firstPage ? null :
                            async () => {
                                setSelectIndex((prev) => prev-1)
                                const image = await getBarcodeImage(data[selectIndex - 1])
                                setImageSrc(image)
                        }}>
                            {
                                !firstPage && <span style={{fontSize: '50px'}} className="material-symbols-outlined">
                                    keyboard_double_arrow_left
                               </span>
                            }
                        </div>
                        <div style={{display : 'flex' , flexDirection : 'column' , alignItems :"center", flex: 0.5}}>
                            {printBarcode()}
                            <br/>
                            {selectIndex + 1}/{data.length}
                        </div>
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', flex:0.25, justifyContent:'center', cursor:!lastPage && 'pointer'}} onClick={
                            lastPage ? null :
                            async () => {
                                setSelectIndex((prev) => prev + 1)
                                const image = await getBarcodeImage(data[selectIndex + 1])
                                setImageSrc(image)
                        }}>
                            {!lastPage && <span style={{fontSize: '50px'}} className="material-symbols-outlined">
                                keyboard_double_arrow_right
                            </span>
                            }
                        </div>
                    </>
                    :
                    printBarcode()
                }

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

const ButtonList = Styled.div`
    display : flex;
    justify-content : space-between;
    align-items: center;
    width : 200px;
`

const Button = Styled.button`

    background-color : #3D414E;
    color :#FFFFFF;
    display : flex;
    justify-content : center;
    align-items : center;
    font-size : 13px;
    padding: 5px;
    border: none;
    cursor : pointer;
    border-radius : 5px;
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
const Wrap = Styled.div`

    canvas {
        width: 100%;
        height: 100px;
    }
`;

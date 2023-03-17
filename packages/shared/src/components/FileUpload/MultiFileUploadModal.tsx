import React, {useEffect, useRef} from 'react'
import { IExcelHeaderType } from '../../@types/type'
//@ts-ignore
import Icon_X from '../../../public/images/file_delete_button.png'
import Notiflix from "notiflix";
import {UploadButton} from '../../styles/styledComponents'
import Modal from 'react-modal'
import {Header as PageHeader} from "../Header";
import {ImageGrid} from "../Grid/ImageGrid";
import {uploadTempFile} from "../../common/fileFuctuons";
import ButtonGroup from "../ButtonGroup";
import {RequestMethod} from "../../common/RequestFunctions";
import {SF_ENDPOINT} from "../../common/configset";

interface IProps {
    row: any
    column: IExcelHeaderType
    onRowChange: (e: any) => void
    onClose: (state: boolean) => void
}

const MultiFileUploadModal = ({ row, column, onRowChange, onClose }: IProps) => {

    const fileRef = useRef(null)
    const [open, setOpen] = React.useState<boolean>(false)
    const [imgUrl, setImgUrl] = React.useState<string>("");
    const changeSetOnImage = (value: boolean) => {
        setOpen(value)
    }
    const [selectItems, setSelectItems] = React.useState<Set<string>>(new Set())

    const onClickImageUpload = () => {
        // @ts-ignore
        fileRef.current.click();
    }
    //해당 UUID가 있다면 제거 없으면 추가
    const changeSelectItems = (item:string) => {
        if(selectItems.has(item)){
            selectItems.delete(item)
            setSelectItems(new Set(selectItems))
        }else{
            setSelectItems((items) =>  items.add(item))
        }
    }

    const ImageDownload = () => {

    }
    const ButtonEvents = async (index:number) => {
        //["추가","삭제","다운로드"]
        switch (index) {
            case 0:
                onClickImageUpload()
                break;
            case 1:
                const deleteList = row.work_standard_image?.map((image) => {
                    if(!selectItems.has(image)){
                        return image
                    }
                }).filter(value => value)

                if(deleteList.length == row.work_standard_image.length){
                    Notiflix.Report.warning("경고","사진을 선택해주세요.","확인")
                    break;
                }
                onRowChange({...row,
                    work_standard_image:deleteList,
                    isChange:true,
                })
                break;
            case 2:
                console.log("selectItems : ", selectItems)
                // let downloads:Promise<any>[] = []
                    // selectItems.forEach((item) => {
                // window.location.href = "http://43.200.106.125:8443/anonymous/download/"+item
                // })
                break;
            default:
                break;
        }
    }
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: row.readonly ? .3:1
        }}>
            <input
                multiple={true}
                type={"file"}
                hidden
                onChange={async(e) => {
                    const fileList = Array.from(e.target.files)
                    const fileTypes = fileList.map((file)=> file.name.split(".").length -1)
                    const fileNames = fileList.map((file)=> file.name)
                    const files = await Promise.all(fileList.map(async (file)=>(
                        await uploadTempFile(file,file.size,true,file.name,file.type)
                    )))

                    const result = files.map((file,index )=>{
                        return {...file , name : e.target.files[index].name , type : e.target.files[index].name.split(".")[fileTypes[index]]}
                    })
                    onRowChange({...row,
                        work_standard_image:row.work_standard_image ? [...row?.work_standard_image, ...result.map(file => file.UUID)] : [...result.map(file => file.UUID)],
                        isChange:true,
                    })
                    // setOpen(false)
                }}
                accept={'image/jpeg, image/jpg, image/png'}
                ref={fileRef}
                name={"file"} id={"file"}
                style={{opacity:0, width:0}}
            />
            <>
                <UploadButton onClick={() => {
                    setOpen(true)
                }}
                              style={column.readonly && { background: "#B3B3B3" }}>
                    <p>표준서 확인</p>
                </UploadButton>
            </>
            <Modal isOpen={open}
                   style={{
                       content: {
                           margin: "0 auto",
                           width: "1700px",
                           height: "800px",
                           display:"flex",
                           flexDirection:"column",
                           justifyContent:"space-between",
                       },
                       overlay: {
                           background: 'rgba(0,0,0,.6)',
                       }
                   }}>
                <div>
                    <div style={{display:"flex", justifyContent:"right"}}>
                        <img
                            onClick={() => setOpen(false)}
                            src={Icon_X} style={{ borderRadius: "4px", width: "24px", height: "24px", marginRight: "4px", marginLeft: '4px' }} />
                    </div>
                    <PageHeader
                        title={"작업 표준서 리스트"}
                        buttons={!column.readonly && ["추가","삭제"]}
                        buttonsOnclick={ButtonEvents}
                        type={"modal"}
                    />
                    <ImageGrid images={row.work_standard_image} selectItems={selectItems} changeSelectItems={changeSelectItems} />
                </div>
                <div style={{display:"flex", justifyContent:"center"}}>
                    <ButtonGroup buttons={["확인"]} buttonsOnclick={(index) => {
                        switch (index){
                            case 0:
                                setOpen(false)
                                break;
                            default:
                                break;
                        }
                    }}/>
                </div>
            </Modal>
        </div>
    );
}

export { MultiFileUploadModal };

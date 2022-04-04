import React, {useRef} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
//@ts-ignore
import Icon_X from '../../../public/images/file_delete_button.png'
import Notiflix from "notiflix";
import {DeleteImage, UploadButton} from '../../styles/styledComponents'
import {uploadTempFile} from '../../common/fileFuctuons'
import {RequestMethod} from "../../common/RequestFunctions";
import ImageOpenModal from "../Modal/ImageOpenModal";

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
}


const FileEditer = ({ row, column, onRowChange, onClose }: IProps) => {
  const fileRef = useRef(null)

  const onClickImageUpload = (index: string) => {// input[type='file']
    // @ts-ignore
    fileRef.current.click();
  }

  const [onImage, setOnImage] = React.useState<boolean>(false)
  const [imgUrl, setImgUrl] = React.useState<string>("");
  const changeSetOnImage = (value:boolean) => {
      setOnImage(value)
  }


  const cleanText = () => {
      switch(true){
          case column.type === "image":
              return "이미지 확인"
          case column.readonly :
              return "등록된 이미지가 없습니다."
          default:
              return "파일 다운로드"
      }
      {column.type === "image" ? "이미지 확인" : "파일 다운로드" }
  }

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
        <ImageOpenModal url={imgUrl} open={onImage} changeSetOnImage={changeSetOnImage}/>
      {
          (row[column.key]?.uuid) ||  typeof row[column.key] !== "object" && row[column.key]?
          <div style={{
            width: "100%",
            height: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <DeleteImage
              onClick={()=>{
                  onRowChange({
                    ...row,
                    [column.key+'Path']: null,
                    [column.key]: null,
                    isChange:true
                  })
              }}
              src={Icon_X} />
            <p
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:'nowrap',
                textDecoration:"underline"
              }}
              onClick={() => {
                  if(typeof row[column.key] === "object"){
                      RequestMethod("get", "anonymousLoad", {
                          path:{
                              uuid:row[column.key].uuid
                          }
                      })
                          .then((res) => {
                              setImgUrl(res.url)
                              setOnImage(true)
                          })
                          .catch((err) => {
                              Notiflix.Report.failure("에러","에러입니다.","확인")
                          })
                  }else{
                      RequestMethod("get", "anonymousLoad", {
                          path:{
                              uuid:row[column.key]
                          }
                      })
                          .then((res) => {
                              setImgUrl(res.url)
                              setOnImage(true)
                          })
                          .catch((err) => {
                              Notiflix.Report.failure("에러","에러입니다.","확인")
                          })
                  }

              }}
            >
              {/*{*/}
              {/*  row[column.key]*/}
              {/*}*/}
                {column.type === "image" ? "이미지 보기" : "파일 다운로드" }
            </p>
          </div>
          : column.readonly ?
            <>
                <p style={{color:"white", }}>이미지가 없습니다.</p>
            </>
            :
            <>
                <UploadButton onClick={() => {
                    if(!column.readonly) onClickImageUpload(column.key)
                }} style={column.readonly && {background:"#B3B3B3"}}>
                    <p>파일 첨부하기</p>
                </UploadButton>
            </>
      }
      <input
        key={`${column.key}`}
        id={`${column.key}`}
        ref={fileRef}
        type={"file"}
        accept={column.type === "image" ? "image/png, image/jpeg" : "*"}
        hidden
        onChange={async (e) => {
          if(e.target.files && e.target.files.length !== 0) {
              const uploadImg = await uploadTempFile(e.target.files[0] , e.target.files[0].size, true);
              if(uploadImg !== undefined){
                  if(column.key.includes("photo")){
                      onRowChange({
                          ...row,
                          [column.key]: {
                              ...row[column.key],
                              name:e.target.files[0].name,
                              uuid: uploadImg.UUID,
                              url:uploadImg.url,
                              sequence: column.idx,
                          },
                              isChange: true
                      })
                  }else{
                    onRowChange({
                      ...row,
                      [column.key]: uploadImg.UUID,
                      [column.key+'Resource']: uploadImg.url,
                      isChange: true
                    })
                  }
              }
          }
        }}
      />
    </div>
  );
}

export {FileEditer};

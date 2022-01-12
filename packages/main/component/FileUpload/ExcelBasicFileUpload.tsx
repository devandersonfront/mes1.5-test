import React, {useRef} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
//@ts-ignore
import Icon_X from '../../public/images/file_delete_button.png'
import {UploadButton} from '../../styles/styledComponents'
import {uploadTempFile} from '../../common/fileFuctuons'
import {SF_ENDPOINT_RESOURCE} from '../../common/configset'

interface IProps {
  row: any
  column: IExcelHeaderType
  onRowChange: (e: any) => void
  onClose: (state: boolean) => void
}


const FileEditer = ({ row, column, onRowChange, onClose }: IProps) => {
  const fileRef = useRef(null)

  const onClickImageUpload = (index: string) => {// input[type='file'] ref함
    // @ts-ignore
    fileRef.current.click();
  }

  return (
    // <input
    //   className={'editCell'}
    //   ref={autoFocusAndSelect}
    //   value={row[column.key]}
    //   onChange={(event) => onRowChange({ ...row, [column.key]: event.target.value })}
    //   onBlur={() => onClose(true)}
    // />
    <div style={{
      width: "100%",
      height: "100%",
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      {
        row[column.key] ?
          <div style={{
            width: "100%",
            height: "100%",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <img
              onClick={()=>{
                  onRowChange({
                    ...row,
                    [column.key+'Path']: null,
                    [column.key]: null,
                  })
              }}
              src={Icon_X} style={{borderRadius:"4px", width:"24px", height:"24px", marginRight:"4px", marginLeft: '4px'}} />
            <p
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace:'nowrap'
              }}
              onClick={() => {
                if(row[column.key+'Path']){
                  window.open(SF_ENDPOINT_RESOURCE+`/${row[column.key+'Path']}`)
                }else{
                  window.open(SF_ENDPOINT_RESOURCE+`${row[column.key+'Resource']}`)
                }
              }}
            >
              {
                row[column.key]
              }
            </p>
          </div>
          : <>
            <UploadButton onClick={() => {
              onClickImageUpload(column.key)
            }}>
              <p>파일 첨부하기</p>
            </UploadButton>
          </>
      }
      <input
        key={`${column.key}`}
        id={`${column.key}`}
        ref={fileRef}
        type={"file"}
        hidden
        onChange={async (e) => {
          if(e.target.files && e.target.files.length !== 0) {
            const uploadImg = await uploadTempFile(e.target.files[0], true)
            onRowChange({
              ...row,
              [column.key]: uploadImg.results.path,
              [column.key+'Resource']: uploadImg.results.resource,
              isChange: true
            })
          }
        }}
      />
    </div>
  );
}



export default FileEditer;

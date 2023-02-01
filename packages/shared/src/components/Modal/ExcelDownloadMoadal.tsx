import React, {useRef} from 'react'
import {IExcelHeaderType} from '../../@types/type'
import Modal from 'react-modal'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import {CellButton} from '../../styles/styledComponents'
import {excelDownload} from '../../common/excelDownloadFunction'
import cookie from 'react-cookies'
import axios from "axios";
import {SF_ENDPOINT, SF_ENDPOINT_EXCEL} from "../../common/configset";
import Axios from "axios";
import Notiflix from "notiflix"

interface IProps {
  isOpen: boolean
  category:string
  title:string
  setIsOpen: (ioOpen: boolean) => void
  resetFunction:() => void
  onlyForm ?: boolean
}

const ExcelDownloadModal = ({isOpen, category, title, setIsOpen, resetFunction , onlyForm}: IProps) => {
  const token = cookie.load('userInfo')?.token
    const ref = useRef(null)
    const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.readAsDataURL(blob);
    });

  const formExcelDownload = async() => {
    let blobData:Blob
    await axios.get(`${SF_ENDPOINT_EXCEL}/api/v1/download/form/${category}`, {
      headers:{
        'Content-Type': "ms-vnd/excel",
        Authorization: token
      },
      responseType:"blob"
    })
        .then((res) => {
            blobData = res.data
        }).catch((err) => {
          console.log(err)
        })

      if(blobData){
          const down = document.createElement("a")
          let blob = await convertBlobToBase64(blobData) as string
          down.href = blob
          down.setAttribute("download", title + '_Form.xls')

          down.click()
      }
  }

  const allExcelDownload = async () => {
      let blobData:Blob
      await axios.get(`${SF_ENDPOINT_EXCEL}/api/v1/download/${category}`, {
          headers:{
              'Content-Type': "ms-vnd/excel",
              Authorization: token
          },
          responseType:"blob"
      }, )
          .then((res) => {
              blobData = res.data
          }).catch((err) => {
              console.log(err)
          })

      if(blobData){
          const down = document.createElement("a")
          let blob = await convertBlobToBase64(blobData) as string
          down.href = blob
          down.setAttribute("download", title + '.xls')

          down.click()
      }
  }

    const excelUpload = async(file:File) => {
      const formData = new FormData()

      formData.append("file", file)
        await Axios.post(`${SF_ENDPOINT_EXCEL}/api/v1/upload/${category}`, formData,{
                headers:
                    {
                        "Content-Type": "multipart/form-data",
                        Authorization: token,
                    }
            })
          .then((res) => {
              resetFunction()
              setIsOpen(false)
              // blobData = res.data
          }).catch((err) => {
              if(err.response.data.message){
                  Notiflix.Report.failure("실패",err.response.data.message,"확인")
              }else{
                  Notiflix.Report.failure("실패","업로드에 실패했습니다.","확인")
              }
          })
  }

  return (
      <Modal
          isOpen={isOpen} style={{
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
          zIndex: 5
        }
      }}>
        <div style={{
          width: 700,
          height: 300,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', width: '95%'}}>
            <div style={{cursor: 'pointer', width: 20, height: 20}} onClick={() => {
              setIsOpen(false)
            }}>
              <img style={{width: 20, height: 20}} src={IcX}/>
            </div>
          </div>
          <div style={{width: 700, height: 240, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
              <CellButton
                  style={{
                      width: 200,
                      height: 80
                  }}
                  onClick={formExcelDownload}
              >양식 다운로드</CellButton>
              {
                  !onlyForm && <CellButton
                      style={{
                          width: 200,
                          height: 80
                      }}
                      onClick={allExcelDownload}
                  >전체 다운로드</CellButton>
              }
              <CellButton
                  style={{
                      width: 200,
                      height: 80
                  }}
                  onClick={()=>ref.current.click()}
              >
                  <input type={"file"} ref={ref} accept={".xlsx, .xls"} style={{display:"none", position:"absolute"}} onChange={(e) => excelUpload(e.target.files[0])} />
                  업로드
              </CellButton>
          </div>
        </div>
      </Modal>
  )
}

export {ExcelDownloadModal}

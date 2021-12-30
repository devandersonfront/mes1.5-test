import React from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
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

interface IProps {
  isOpen: boolean
  column: IExcelHeaderType[]
  tab: string
  basicRow: any[]
  filename: string
  sheetname: string
  selectList: any
  setIsOpen: (ioOpen: boolean) => void
}

const ExcelDownloadModal = ({isOpen, tab, column, basicRow, filename, sheetname, selectList, setIsOpen}: IProps) => {

  const selectExcelDownload = () => {
    let tmpSelectList = []
    basicRow.map(row => {
      tmpSelectList.push(selectList.has(row.id))
    })
    excelDownload(column, basicRow, filename, sheetname, tmpSelectList)
  }

  const allExcelDownload = async () => {
    const res = await RequestMethod('get', 'excelFormatDownload', {
      path: {
        tab: tab
      },
      params: {
        id: cookie.load('userInfo').token
      }
    }, undefined, 'blob')

    if (res) {
      const downloadUrl = window.URL.createObjectURL(new Blob([res]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${filename}.xls`); //any other extension
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }

  return (
      <Modal isOpen={isOpen} style={{
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
              onClick={() => selectExcelDownload()}
            >선택항목 다운로드</CellButton>
            <CellButton
              style={{
                width: 200,
                height: 80
              }}
              onClick={() => allExcelDownload()}
            >전체 다운로드</CellButton>
          </div>
        </div>
      </Modal>
  )
}

export {ExcelDownloadModal}

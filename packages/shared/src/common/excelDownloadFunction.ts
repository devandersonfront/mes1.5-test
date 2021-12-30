import {RequestMethod} from './RequestFunctions'

interface ExcelCellTextType {
  fontSize?: number
  value: string
  color?: string
  bold?: boolean
}

interface ExcelCellBorderType {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

interface ExcelCellMergeType {
  mergeFrom: number,
  mergeTo: number
}

interface ExcelCellType {
  key?: string
  text: ExcelCellTextType
  canModify: boolean
  bgColor?: string
  border?: ExcelCellBorderType
}

interface ExcelDownloadType {
  height?: number
  cells: ExcelCellType[]
  merges: ExcelCellMergeType[]
}

export const excelDownload = async (titleObj: any[], infoList: any[], fileName: string, sheetName: string, downloadIndexs: boolean[]) => {
  let tmpHeaders: ExcelDownloadType = {cells: [], height: 0, merges: []}
  let tmpCells: ExcelDownloadType[] = []

  if(titleObj.length) {
    tmpHeaders = {
      cells: [...titleObj.map((value) => {
        return {
          key: value.key,
          text: {
            value: value.name ?? "",
          },
          canModify: false,
        }
      })],
      merges: []
    }

    infoList.map(((value,index) => {
      if(downloadIndexs[index]){
        tmpCells.push({
          cells: [...tmpHeaders.cells.map(cells => {
            return {
              text: {
                value: cells.key ? value[cells.key] ?? "" : "",
              },
              canModify: true,
              bold:{
                top:0x1,
                bottom:0x1,
                left:0x1,
                right:0x1
              }
            }
          })],
          merges: []
        })
      }
    }))
  }

  const body = {
    sheets: [{
      sheetName: sheetName,
      rows: [
        tmpHeaders,
        ...tmpCells
      ]
    }]
  }
  const res = await RequestMethod('post', `excelDownload`, body, undefined, 'blob')

  if (res) {
    const downloadUrl = window.URL.createObjectURL(new Blob([res]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${fileName}.xls`); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

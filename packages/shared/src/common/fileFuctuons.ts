import {SF_ENDPOINT, SF_ENDPOINT_RESOURCE, TOKEN_NAME} from './configset'
import {requestApi} from './RequestFunctions'
import * as buffer from "buffer";


/**
 * uploadTempFile()
 * 파일을 임시 디비에 업로드 후 temp path를 리턴하는 매서드
 * @param {string} data BLOB 객체
 * @returns X
 */
export const uploadTempFile = async (data:any, isUrl?: boolean) => {

  const formData = new FormData();
  const buffer = Buffer;
  formData.append('file', data)
  console.log("formData : ", formData)
  console.log("????? : ", formData.get("file"));

  // buffer.from("인코딩", "binary");
  // console.log(buffer, "| ???? |", buffer.toString());
  const res = await requestApi('post',`${SF_ENDPOINT}/anonymous/upload`, formData,undefined, "blob" )

  if (res === false) {
    return false
  } else {
    if (res) { //res.status === 200 //res !== null
      if (isUrl) {
        return res //const path: string = res.results; //const path: string = res[0];
      } else {
        const path: string = res.results //const path: string = res.results; //const path: string = res[0];
        return path
      }
      return res
    } else {
      alert('해당 파일 업로드 실패하였습니다.')
      return false
    }
  }
}

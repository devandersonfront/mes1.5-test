import {SF_ENDPOINT, SF_ENDPOINT_RESOURCE, TOKEN_NAME} from './configset'
import {requestApi} from './RequestFunctions'


/**
 * uploadTempFile()
 * 파일을 임시 디비에 업로드 후 temp path를 리턴하는 매서드
 * @param {string} data BLOB 객체
 * @returns X
 */
export const uploadTempFile = async (data:any, isUrl?: boolean) => {

  const formData = new FormData()
  formData.append('file', data)
  const res = await requestApi('post',`${SF_ENDPOINT}/anonymous/upload`, formData)

  if (res === false) {
    return false
  } else {
    if (res.status === 200) { //res.status === 200 //res !== null
      if (isUrl) {
        return res //const path: string = res.results; //const path: string = res[0];
      } else {
        const path: string = res.results //const path: string = res.results; //const path: string = res[0];
        return path
      }

    } else {
      alert('해당 파일 업로드 실패하였습니다.')
      return false
    }
  }
}

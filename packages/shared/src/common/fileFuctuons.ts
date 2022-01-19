import {SF_ENDPOINT} from './configset'
import Axios from "axios";

//@ts-ignore
import Notiflix from "notiflix";

/**
 * uploadTempFile()
 * 파일을 임시 디비에 업로드 후 temp path를 리턴하는 매서드
 * @param {string} data BLOB 객체
 * @returns X
 */
export const uploadTempFile = async (data:any, length: number, isUrl?: boolean, fileType?: string) => {
  // const res = await requestApi('post',`${SF_ENDPOINT}/anonymous/upload`, data, )
    let result:any;
    const type = data.type.split("/")[0];
      await Axios.post(`${SF_ENDPOINT}/anonymous/upload`, data,
          {
                  headers: type === "image"?
                      {
                          "Content-Type": data.type,
                          "Content-Length": length
                      } : fileType !== undefined ?
                          {
                              "Content-Type": fileType,
                          }
                          :
                          {}
                })
          .then((res) => {
              result = res.data;
          }).
          catch((err)=>{
              console.log(err)
              Notiflix.Report.failure("실패", "파일 업로드에 실패했습니다.", "확인",  );
          })

        console.log("result : ", result)
      return result

  // if (res === false) {
  //   return false
  // } else {
  //   if (res) { //res.status === 200 //res !== null
  //     if (isUrl) {
  //       return res //const path: string = res.results; //const path: string = res[0];
  //     } else {
  //       const path: string = res.results //const path: string = res.results; //const path: string = res[0];
  //       return path
  //     }
  //     return res
  //   } else {
  //     alert('해당 파일 업로드 실패하였습니다.')
  //     return false
  //   }
  // }
}

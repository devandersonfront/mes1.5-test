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
export const uploadTempFile = async (data:any, length: number, isUrl?: boolean, fileName?:string,fileType?: string) => {
  // const res = await requestApi('post',`${SF_ENDPOINT}/anonymous/upload`, data, )
    let result:any;
    const type = data.type.split("/")[0];
      await Axios.post(`${SF_ENDPOINT}/anonymous/upload/${fileName}`, data,
          {
                  headers:
                      // type === "image"?
                      {
                          "Content-Type": data.type,
                          "Content-Length": length
                      }
                  // ,params:{
                  //       ["file-name"]:fileName
                  // }
                      // : fileType !== undefined ?
                      //     {
                      //         "Content-Type": fileType,
                      //     }
                      //     :
                      //     {}
                })
          .then((res) => {
              result = res.data;
              result.name = data.name
          }).
          catch((err)=>{
            if(err.response.status === 415){
                Notiflix.Report.failure("실패", ".jpeg 또는 .png 파일 형식만 가능합니다.", "확인",  );
            }else{
                Notiflix.Report.failure("실패", "파일 업로드에 실패했습니다.", "확인",  );
            }
          })

      return result
}

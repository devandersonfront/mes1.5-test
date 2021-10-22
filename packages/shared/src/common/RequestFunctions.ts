import Axios, {AxiosError} from 'axios'
import cookie from 'react-cookies'
import {SF_ENDPOINT, SF_ENDPOINT_EXCEL} from './configset'
import Notiflix from 'notiflix'

type RequestType = 'get' | 'post' | 'delete' | 'put'

export const requestApi = async (type: RequestType,url: string, data?: any, token?: any, contentsType?: 'blob') => {

  const ENDPOINT = `${SF_ENDPOINT}`

  switch(type){
    case 'get':
      let tmpUrl = `${ENDPOINT}${url}`

      if(data){
        if(data.path){
          Object.values(data.path).map(v => {
            if(v){
              tmpUrl += `/${v}`
            }
          })
        }
        if(data.params){
          Object.keys(data.params).map((v, i) => {
            if(i === 0) {
              tmpUrl += `?${v}=${data.params[v]}`
            }else{
              tmpUrl += `&${v}=${data.params[v]}`
            }
          })
        }
      }
      return Axios.get(tmpUrl, token && {'headers': {'Authorization': token}, responseType: contentsType})
        .then((result) => {
          // if(result.data.status !== 200){
          //   Notiflix.Report.failure('불러올 수 없습니다.', result.data.message, '확인')
          //   return false
          // }
          return result.data
        })
        .catch((error) => {
          console.log(error)
          if(error.response.status === 406 || error.response.status === 401) {
            return {
              state: 401
            }
          }else if(error.response.status === 500){
            Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
            return false
          }
        })
    case 'post':
      let postUrl:string = ''
      if(url.indexOf('http://') !== -1){
        postUrl = url
      }else{
        postUrl = ENDPOINT+url
      }

      return Axios.post(postUrl, data, token && {'headers': {'Authorization': token}, responseType: contentsType})
        .then((result) => {
          if(result.data){
            return result.data
          }else{
            return true
          }
        })
        .catch((error) => {
          if(error.response.status === 400) {
            Notiflix.Report.failure('저장할 수 없습니다.', '입력값을 확인해주세요', '확인')
          }else if(error.response.status === 500){
            Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
          }
          return false
        })
    case 'put':
      return Axios.put(ENDPOINT+url, data,token && {'headers': {'Authorization': token}, responseType: contentsType})
        .then((result) => {
          if(result.data.status !== 200){
            Notiflix.Report.failure('저장할 수 없습니다.', result.data.message, '확인')
            return false
          }
          return result
        })
        .catch((error: AxiosError) => {
          return false
        })
    case 'delete':
      return Axios.delete(ENDPOINT+url, token && {
        'headers': {'Authorization': token}, responseType: contentsType,
        data: data
      })
        .then((result) => {
          return true
        })
        .catch((error) => {
          if(error.response.status === 400) {
            Notiflix.Report.failure('삭제할 수 없습니다.', '입력값을 확인해주세요', '확인')
          }
          return false
        })
  }
}

export const RequestMethod = async (MethodType: RequestType, apiType: string, data?: any, token?: string, responseType?: 'blob') => {
  const tokenData = token ?? cookie.load('userInfo').token
  if(apiType === 'excelDownload'){
    return Axios.post(ApiList[apiType], data, tokenData && {'headers': {'Authorization': tokenData}, responseType: responseType})
      .then((result) => {
        return result.data
      })
      .catch((error) => {
        if(error.response.status === 400) {
          Notiflix.Report.failure('저장할 수 없습니다.', '입력값을 확인해주세요', '확인')
        }else if(error.response.status === 500){
          Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        }
        return false
      })
  }else if( apiType === 'excelFormatDownload'){

    let tmpUrl = ApiList[apiType]

    if(data){
      if(data.path){
        Object.values(data.path).map(v => {
          if(v){
            tmpUrl += `/${v}`
          }
        })
      }
      if(data.params){
        Object.keys(data.params).map((v, i) => {
          if(i === 0) {
            tmpUrl += `?${v}=${data.params[v]}`
          }else{
            tmpUrl += `&${v}=${data.params[v]}`
          }
        })
      }
    }

    return Axios.get(tmpUrl, tokenData && {'headers': {'Authorization': tokenData}, responseType: responseType})
      .then((result) => {
        return result.data
      })
      .catch((error) => {
        if(error.response.status === 400) {
          Notiflix.Report.failure('저장할 수 없습니다.', '입력값을 확인해주세요', '확인')
        }else if(error.response.status === 500){
          Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
        }
        return false
      })
  } else {
    const response = await requestApi(MethodType, ApiList[apiType], data, tokenData, responseType)
    return response
  }
}


const ApiList = {
  //create
  authorityCreate: `/api/v1/member/auth/create`,

  //update
  authorityUpdate: `/api/v1/member/auth/update`,

  //save
  authoritySave: `/api/v1/auth/save`,
  memberSave: `/api/v1/member/save`,
  customerSave: `/api/v1/customer/save`,
  modelSave: `/api/v1/model/save`,
  processSave: `/api/v1/process/save`,
  machineSave: `/api/v1/machine/save`,
  productSave: `/api/v1/product/save`,
  rawmaterialSave: `/api/v1/rawmaterial/save`,
  moldSave: `/api/v1/mold/save`,
  pauseSave: `/api/v1/process/reason/pause/save`,
  defectSave: `/api/v1/process/reason/defect/save`,
  rawinSave: `/api/v1/rawmaterial/warehouse/save`,
  rawstockSave: `/api/v1/rawmaterial/warehouse/save`,
  productprocessSave: `/api/v1/product/process/save`,
  stockSummarySave: `/api/v1/stock/summary/save`,
  operationSave: `/api/v1/operation/save`,
  shipmentSave: `/api/v1/shipment/save`,
  recordSave: `/api/v1/record/save`,
  factorySave: `/api/v1/factory/save`,

  //modify
  operationModify: `/api/v1/operation/modify`,

  //load
  authorityLoad: `/api/v1/member/auth/load`,

  //recent
  operationRecent:`/api/v1/operation/recent`,

  //delete
  authorityDelete: `/api/v1/auth/delete`,
  memberDelete: `/api/v1/member/delete`,
  customerDelete: `/api/v1/customer/delete`,
  modelDelete: `/api/v1/model/delete`,
  processDelete: `/api/v1/process/delete`,
  machineDelete: `/api/v1/machine/delete`,
  productDelete: `/api/v1/product/delete`,
  rawmaterialDelete: `/api/v1/rawmaterial/delete`,
  moldDelete: `/api/v1/mold/delete`,
  pauseDelete: `/api/v1/process/reason/pause/delete`,
  defectDelete: `/api/v1/process/reason/defect/delete`,
  rawinDelete: `/api/v1/rawmaterial/warehouse/delete`,
  operationDelete: `/api/v1/operation/delete`,
  shipmentDelete: '/api/v1/shipment/delete',
  stockSummaryDelete: `/api/v1/stock/summary/delete`,
  factoryDelete: `api/v1/factory/delete`,

  //list
  authorityList: `/api/v1/member/auth/list`,
  memberList: `/api/v1/member/list`,
  customerList: `/api/v1/customer/list`,
  modelList: `/api/v1/model/list`,
  processList: `/api/v1/process/list`,
  machineList: `/api/v1/machine/list`,
  productList: `/api/v1/product/list`,
  rawmaterialList: `/api/v1/rawmaterial/list`,
  moldList: `/api/v1/mold/list`,
  pauseReasonList: '/api/v1/process/reason/pause/list',
  defectReasonList: '/api/v1/process/reason/defect/list',
  rawinList: `/api/v1/rawmaterial/warehouse/list`,
  rawstockList: `/api/v1/rawmaterial/warehouse/list`,
  productprocessList: `/api/v1/product/process/load`,
  stockList: '/api/v1/stock/list',
  stockProductList: '/api/v1/stock/summary',
  stockSummaryList: '/api/v1/stock/summary/list',
  operactionList: `/api/v1/operation/list`,
  defectList: `/api/v1/quality/statistics/defect`,
  shipmentList: '/api/v1/shipment/list',
  recordList: `/api/v1/record/list`,
  recordSumList: `/api/v1/record/summation/list`,
  factoryList: `/api/v1/factory/list`,

  //search
  memberSearch: `/api/v1/member/search`,
  userSearch: `/api/v1/member/search`,
  customerSearch: `/api/v1/customer/search`,
  modelSearch: `/api/v1/model/search`,
  processSearch: `/api/v1/process/search`,
  machineSearch: `/api/v1/machine/search`,
  productSearch: `/api/v1/product/search`,
  pauseSearch: `/api/v1/process/reason/pause/search`,
  rawmaterialSearch: `/api/v1/rawmaterial/search`,
  moldSearch: `/api/v1/mold/search`,
  defectReasonSearch: `/api/v1/process/reason/defect/search`,
  rawinSearch: `/api/v1/rawmaterial/warehouse/search`,
  rawstockSearch: `/api/v1/rawmaterial/warehouse/search`,
  stockSearch: '/api/v1/stock/search',
  operationSearch: `/api/v1/operation/search`,
  recordSearch: `/api/v1/record/search`,
  shipmentSearch: `/api/v1/shipment/search`,
  recordSumSearch: `/api/v1/record/summation/search`,
  factorySearch: `/api/v1`,

  recordDefect: `/api/v1/record/defect`,
  recordPause: `/api/v1/record/pause`,

  itemList: `/api/v1/items/list`,
  itemSave: `/api/v1/items/save`,
  itemDelete: `/api/v1/items/delete`,

  //all
  authorityAll: `/api/v1/auth/all`,

  //fetch
  summaryFetch: `/api/v1/stock/summary/fetch`,
  excelDownload: `${SF_ENDPOINT_EXCEL}/api/v1/download`,
  excelFormatDownload: `${SF_ENDPOINT_EXCEL}/api/v1/format/download`,
  excelUpload: `${SF_ENDPOINT_EXCEL}/api/v1/format/upload`
}

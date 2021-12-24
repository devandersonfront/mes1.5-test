import Axios, {AxiosError} from 'axios'
import cookie from 'react-cookies'
import {SF_ENDPOINT, SF_ENDPOINT_EXCEL} from './configset'
import Notiflix from 'notiflix'
import Router from 'next/router'

type RequestType = 'get' | 'post' | 'delete' | 'put'

export const requestApi = async (type: RequestType,url: string, data?: any, token?: any, contentsType?: 'blob', params?: any, path?:any) => {
  Notiflix.Loading.circle()

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
          Notiflix.Loading.remove(300)
          return result.data
        })
        .catch((error) => {
          if(error.response.status === 406 || error.response.status === 403) {
            Notiflix.Loading.remove(300)
            Notiflix.Report.failure('권한 에러', '올바르지 않은 권한입니다.', '확인', () => Router.back())
            return false
          }else if (error.response.status === 401){
            Notiflix.Loading.remove(300)
            Notiflix.Report.failure('권한 에러', '토큰이 없습니다.', '확인', () => Router.back())
            return false
          }else if(error.response.status === 500){
            Notiflix.Loading.remove(300)
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

      if(params){
        Object.keys(params).map((v, i) => {
          if(i === 0) {
            postUrl += `?${v}=${params[v]}`
          }else{
            postUrl += `&${v}=${params[v]}`
          }
        })
      }
      if(path){
        postUrl += `/${path}`
      }

      return Axios.post(postUrl, data, token && {'headers': {'Authorization': token}, responseType: contentsType})
        .then((result) => {
          Notiflix.Loading.remove(300)
          if(result.data){
            return result.data
          }else{
            return true
          }
        })
        .catch((error) => {
          Notiflix.Loading.remove(300)
          if(error.response.status === 400) {
            Notiflix.Report.failure('저장할 수 없습니다.', '입력값을 확인해주세요', '확인')
          }else if(error.response.status === 500){
            Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
          }else if(error.response.status === 404){
            Notiflix.Report.failure('에러', error.response.data.message, '확인')
          }
          throw error.response
        })
    case 'put':
      return Axios.put(ENDPOINT+url, data,token && {'headers': {'Authorization': token}, responseType: contentsType})
        .then((result) => {
          Notiflix.Loading.remove(300)
          if(result.data.status !== 200){
            Notiflix.Report.failure('저장할 수 없습니다.', result.data.message, '확인')
            return false
          }
          return result
        })
        .catch((error: AxiosError) => {
          Notiflix.Loading.remove(300)
          return false
        })
    case 'delete':
      return Axios.delete(ENDPOINT+url, token && {
        'headers': {'Authorization': token}, responseType: contentsType,
        data: data
      })
        .then((result) => {
          Notiflix.Loading.remove(300)
          return true
        })
        .catch((error) => {
          Notiflix.Loading.remove(300)
          if(error.response.status === 400) {
            Notiflix.Report.failure('삭제할 수 없습니다.', '입력값을 확인해주세요', '확인')
          }
          return false
        })
  }
}

export const RequestMethod = async (MethodType: RequestType, apiType: string, data?: any, token?: string, responseType?: 'blob', params?: any, path?:any) => {
  const tokenData = token ?? cookie.load('userInfo')?.token;

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
    const response = await requestApi(MethodType, ApiList[apiType], data, tokenData, responseType, params, path)
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
  stockSummarySave: `/api/v1/stock/summary`,
  operationSave: `/api/v1/sheet/save`,
  recordSave: `/api/v1/record/save`,
  factorySave: `/api/v1/factory/save`,
  deviceSave: `/api/v1/device/save`,
  rawMaterialSave: `/api/v1/raw-material/save`,
  subMaterialSave: `/api/v1/sub-material/save`,
  lotRmSave: `/api/v1/lot-rm/save`,
  lotSmSave: `/api/v1/lot-sm/save`,
  subFactorySave: `/api/v1/subFactory/save`,
  contractSave: `/api/v1/contract/save`,
  sheetSave: `/api/v1/sheet/save`,
  shipmentSave: `/api/v1/shipment/save`,

  //modify
  operationModify: `/api/v1/operation/modify`,

  //load
  authorityLoad: `/api/v1/member/auth/load`,
  productLoad: `/api/v1/product/load`,
  productprocessList: `/api/v1/product/process/load`,
  machineDetailLoad: `/api/v1/machine/load`,

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
  rawMaterialDelete: `/api/v1/raw-material/delete`,
  subMaterialDelete: `/api/v1/sub-material/delete`,
  moldDelete: `/api/v1/mold/delete`,
  pauseDelete: `/api/v1/process/reason/pause/delete`,
  defectDelete: `/api/v1/process/reason/defect/delete`,
  rawinDelete: `/api/v1/lot-rm/delete`,
  operationDelete: `/api/v1/operation/delete`,
  shipmentDelete: '/api/v1/shipment/delete',
  stockSummaryDelete: `/api/v1/stock/summary/delete`,
  factoryDelete: `/api/v1/factory/delete`,
  deviceDelete: `/api/v1/device/delete`,
  subinDelete: `/api/v1/lot-sm/delete`,
  subFactoryDelete: `/api/v1/subFactory/delete`,
  contractDelete: `/api/v1/contract/delete`,
  sheetDelete: `/api/v1/sheet/delete`,
  recodeDelete: `/api/v1/record/delete`,

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
  stockList: '/api/v1/stock/list',
  stockProductList: '/api/v1/stock/summary',
  stockSummaryList: '/api/v1/stock/summary/list',
  operactionList: `/api/v1/operation/list`,
  defectList: `/api/v1/quality/statistics/defect`,
  recordList: `/api/v1/record/list`,
  recordSumList: `/api/v1/record/summation/list`,
  factoryList: `/api/v1/factory/list`,
  deviceList: `/api/v1/device/list`,
  rawMaterialList: `/api/v1/raw-material/list`,
  subMaterialList: `/api/v1/sub-material/list`,
  rawInList: `/api/v1/lot-rm/list`,
  subInList: `/api/v1/lot-sm/list`,
  subFactoryList: `/api/v1/subFactory/list`,
  contractList: `/api/v1/contract/list`,
  sheetList: `/api/v1/sheet/list`,
  sheetLatestList: `/api/v1/sheet/latest`,
  sheetGraphList: `/api/v1/bom/graph`,
  shipmentList: `/api/v1/shipment/list`,
  lotRmList: `/api/v1/lot-rm/list`,
  lotSmList: `/api/v1/lot-sm/list`,
  recordGroupList: `/api/v1/record/groups`,
  stockAdminList: '/api/v1/stock/admin/summary',

  //search
  memberSearch: `/api/v1/member/search`,
  userSearch: `/api/v1/member/search`,
  customerSearch: `/api/v1/customer/search`,
  modelSearch: `/api/v1/model/search`,
  processSearch: `/api/v1/process/search`,
  machineSearch: `/api/v1/machine/search`,
  productSearch: `/api/v1/product/search`,
  pauseSearch: `/api/v1/process/reason/pause/search`,
  rawmaterialSearch: `/api/v1/raw-material/search`,
  moldSearch: `/api/v1/mold/search`,
  defectReasonSearch: `/api/v1/process/reason/defect/search`,
  rawinSearch: `/api/v1/rawmaterial/warehouse/search`,
  rawstockSearch: `/api/v1/rawmaterial/warehouse/search`,
  stockSearch: '/api/v1/stock/search',
  operationSearch: `/api/v1/sheet/search`,
  recordSearch: `/api/v1/record/search`,
  shipmentSearch: `/api/v1/shipment/search`,
  recordSumSearch: `/api/v1/record/summation/search`,
  submaterialSearch: `/api/v1/sub-material/search`,
  factorySearch: `/api/v1/factory/search`,
  subFactorySearch: `/api/v1/subFactory/search`,
  rawInListSearch: `/api/v1/lot-rm/search`,
  contractSearch: `/api/v1/contract/search`,
  lotRmSearch: `/api/v1/lot-rm/search`,
  lotSmSearch: `/api/v1/lot-sm/search`,
  authSearch: `/api/v1/auth/all`,
  pauseReasonSearch: '/api/v1/process/reason/pause/search',

  recordDefect: `/api/v1/record/defect`,
  recordPause: `/api/v1/record/pause`,

  itemList: `/menu/list`,
  itemSave: `/menu/save`,
  itemDelete: `/menu/delete`,

  deviceSearch: `/api/v1/device/search`,

  //all
  authorityAll: `/api/v1/auth/all`,
  recordAll: `/api/v1/record/all`,

  //fetch
  summaryFetch: `/api/v1/stock/summary/fetch`,
  excelDownload: `${SF_ENDPOINT_EXCEL}/api/v1/download`,
  excelFormatDownload: `${SF_ENDPOINT_EXCEL}/api/v1/format/download`,
  excelUpload: `${SF_ENDPOINT_EXCEL}/api/v1/format/upload`,

  checkLotDuplication: `/api/v1/record/lot/duplication`,
  loadMenu: `/menu/authorize/list`,

  bomLoad: `/api/v1/bom`,
  bomSave: `/api/v1/bom/save`,

  anonymousLoad: `/anonymous/load`,
}

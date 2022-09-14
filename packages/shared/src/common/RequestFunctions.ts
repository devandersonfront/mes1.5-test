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
            if(error.response?.status === 406 || error.response?.status === 403) {
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('권한 에러', '올바르지 않은 권한입니다.', '확인', () => Router.back())
              return false
            }else if (error.response?.status === 401){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('권한 에러', '토큰이 없습니다.', '확인', () => Router.push("/"))
              return false
            }else if (error.response?.status === 423){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('요청 에러', '잠시 후 다시 시도해 주세요.', '확인', () => Router.back())
              return false
            }else if(error.response?.status === 400){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('요청 에러', '잠시 후 다시 시도해 주세요.', '확인', () => Router.back())
            }else if(error.response?.status === 500){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인', () => Router.back())
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
            Notiflix.Report.failure('저장할 수 없습니다.', error?.response?.data?.message, '확인')
          }else if(error.response.status === 500){
            Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
          }else if(error.response.status === 404){
            Notiflix.Report.failure('에러', error.response.data.message, '확인')
          }else if(error.response.status === 422 || error.response.status === 409){
            Notiflix.Report.warning('경고', error.response.data.message, '확인')
          }else if (error.response?.status === 423){
            Notiflix.Loading.remove(300)
            Notiflix.Report.failure('버전 에러', '잠시 후 다시 시도해주세요.', '확인', () => window.location.reload())
            return false
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
      if(data.path){
        let tmpUrl = `${ENDPOINT}${url}`

        Object.values(data.path).map(v => {
          if(v){
            tmpUrl += `/${v}`
          }
        })
        return Axios.delete(tmpUrl, token && {'headers': {'Authorization': token}, responseType: contentsType})
            .then((result) => {
              // if(result.data.status !== 200){
              //   Notiflix.Report.failure('불러올 수 없습니다.', result.data.message, '확인')
              //   return false
              // }
              Notiflix.Loading.remove(300)
              return true
            })
            .catch((error) => {
              if(error.response.status === 406 || error.response.status === 403) {
                Notiflix.Loading.remove(300)
                Notiflix.Report.failure('권한 에러', '올바르지 않은 권한입니다.', '확인', () => Router.back())
                return false
              }else if (error.response.status === 401){
                Notiflix.Loading.remove(300)
                Notiflix.Report.failure('권한 에러', '토큰이 없습니다.', '확인', () => Router.push("/"))
                return false
              }else if(error.response.status === 500){
                Notiflix.Loading.remove(300)
                Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
                return false
              }
            })
      }
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
              return false
            }else if (error.response.status === 409){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('삭제할 수 없습니다.', error.response.data.message, '확인', )
              return false
            }else if (error.response.status === 422){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('삭제할 수 없습니다.', error.response.data.message, '확인', )
              return false
            }else if (error.response.status === 500){
              Notiflix.Loading.remove(300)
              Notiflix.Report.failure('서버 에러', '서버 에러입니다. 관리자에게 문의하세요', '확인')
              return false
            }
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
  // productSave: `/api/v1/product/save`,
  productSave: `/cnc/api/v1/product/save`,
  prdMachineSave: `/api/v1/machine/prd-machine-link/save`,
  prdMoldSave: `/api/v1/mold/prd-mold-link/save`,
  prdToolSave: `/cnc/api/v1/tool/prd-tool-link/save`,
  rawmaterialSave: `/api/v1/rawmaterial/save`,
  moldSave: `/api/v1/mold/save`,
  pauseSave: `/api/v1/process/reason/pause/save`,
  defectSave: `/api/v1/process/reason/defect/save`,
  rawinSave: `/api/v1/rawmaterial/warehouse/save`,
  rawstockSave: `/api/v1/rawmaterial/warehouse/save`,
  productprocessSave: `/api/v1/product/process/save`,
  stockSummarySave: `/api/v1/stock/admin/summary`,
  operationSave: `/api/v1/sheet/save`,
  recordSave: `/cnc/api/v1/record/save`,
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
  toolSave: `/cnc/api/v1/tool/save`,
  inspectCategorySave: '/cnc/api/v1/product/inspect/category/save',
  recordInspectSave: `/cnc/api/v1/record/inspect/save`,
  lotToolSave: `/cnc/api/v1/lot-tool/save`,
  productChangeSave: `/cnc/api/v1/product-changes/save`,
  documentSave: `/cnc/api/v1/document/save`,
  inspecMachineSave: `/api/v1/inspec/daily/machine/save`,
  inspecMoldSave: `/api/v1/inspec/daily/mold/save`,
  lotRmComplete: `/api/v1/lot-rm/complete`,
  stockSave: `/api/v1/stock/basic/save`,
  //modify
  operationModify: `/api/v1/operation/modify`,

  //load
  authorityLoad: `/api/v1/member/auth/load`,
  productLoad: `/cnc/api/v1/product/load`,
  productprocessList: `/api/v1/product/process/load`,
  machineDetailLoad: `/api/v1/machine/load`,
  inspectCategoryLoad: `/cnc/api/v1/product/inspect/category/load/`,
  inspecLoadMachine: `/api/v1/inspec/daily/machine/load`,
  inspecLoadMold: `/api/v1/inspec/daily/mold/load`,
  recordInspectFrame: `/cnc/api/v1/record/inspect/frame`,
  documentLoad: `/cnc/api/v1/document/load`,
  productChangeLoad: `/cnc/api/v1/product-changes/load`,
  moldPrdMoldLinkLoad: `/api/v1/mold/prd-mold-link/load`,
  machinePrdMachineLinkLoad: `/api/v1/machine/prd-machine-link/load`,
  productToMachine: '/api/v1/machine/prd-related/load',
  productToMold: '/api/v1/mold/prd-related/load',
  productToTool: '/cnc/api/v1/tool/prd-related/load',

  //recent
  operationRecent:`/api/v1/operation/recent`,

  //delete
  authorityDelete: `/api/v1/auth/delete`,
  memberDelete: `/api/v1/member/delete`,
  customerDelete: `/api/v1/customer/delete`,
  modelDelete: `/api/v1/model/delete`,
  processDelete: `/api/v1/process/delete`,
  machineDelete: `/api/v1/machine/delete`,
  productDelete: `/cnc/api/v1/product/delete`,
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
  cncRecordeDelete: `/cnc/api/v1/record/delete`,
  toolDelete: `/cnc/api/v1/tool/delete`,
  lotToolDelete: `/cnc/api/v1/lot-tool/delete`,
  documentDelete: `/cnc/api/v1/document/delete`,
  productChangeDelete: `/cnc/api/v1/product-changes/remove`,

  //list
  authorityList: `/api/v1/member/auth/list`,
  memberList: `/api/v1/member/list`,
  customerList: `/api/v1/customer/list`,
  modelList: `/api/v1/model/list`,
  processList: `/api/v1/process/list`,
  machineList: `/api/v1/machine/list`,
  // productList: `/api/v1/product/list`
  productList: `/cnc/api/v1/product/list`,
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
  productChangeList: `/cnc/api/v1/product-changes/list`,
  recordList: `/cnc/api/v1/record/list`,
  cncRecordList: `/cnc/api/v1/record/list`,
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
  recordGroupListByContract: `/api/v1/record/groups/search`,
  stockAdminList: '/api/v1/stock/admin/summary',
  // stockAdminList: '/api/v1/stock/summary',
  qualityRecordInspectList: '/cnc/api/v1/quality/record/inspect/list',
  toolList: `/cnc/api/v1/tool/list`,
  lotToolList: `/cnc/api/v1/lot-tool/list`,
  documentList:`/cnc/api/v1/document/list`,
  productLeadTimeList: `/cnc/api/v1/kpi/product/lead-time/list`,
  costManDayCostList: `/cnc/api/v1/kpi/cost/man-day-cost/list`,
  qualityDefectRateList: `/cnc/api/v1/kpi/quality/defect-rate/list`,
  deliveryLoadTimeList: `/cnc/api/v1/kpi/delivery/lead-time/list`,
  electicPowerList : `/api/v2/statistics/press/electric-power`,
  productUphList: `/cnc/api/v1/kpi/product/uph/list`,
  productCapacityUtilizationList :`/cnc/api/v1/kpi/product/capacity-utilization/list`,
  sheetDefectList: `/api/v1/sheet/defect`,

  //search
  memberSearch: `/api/v1/member/search`,
  userSearch: `/api/v1/member/search`,
  customerSearch: `/api/v1/customer/search`,
  modelSearch: `/api/v1/model/search`,
  processSearch: `/api/v1/process/search`,
  machineSearch: `/api/v1/machine/search`,
  productSearch: `/cnc/api/v1/product/search`,
  pauseSearch: `/api/v1/process/reason/pause/search`,
  rawMaterialSearch: `/api/v1/raw-material/search`,
  moldSearch: `/api/v1/mold/search`,
  defectReasonSearch: `/api/v1/process/reason/defect/search`,
  rawinSearch: `/api/v1/rawmaterial/warehouse/search`,
  rawstockSearch: `/api/v1/rawmaterial/warehouse/search`,
  stockSearch: '/api/v1/stock/search',
  sheetSearch: `/api/v1/sheet/search`,
  recordSearch: `/api/v1/record/search`,
  cncRecordSearch: `/cnc/api/v1/record/search`,
  cncRecordAll: `/cnc/api/v1/record/all`,
  shipmentSearch: `/api/v1/shipment/search`,
  recordSumSearch: `/api/v1/record/summation/search`,
  subMaterialSearch: `/api/v1/sub-material/search`,
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
  toolSearch: `/cnc/api/v1/tool/search`,
  toolProductSearch: `/cnc/api/v1/tool/prd-tool-link/load`,
  lotToolSearch: `/cnc/api/v1/lot-tool/search`,
  qualityRecordInspectSearch: '/cnc/api/v1/quality/record/inspect/search',
  productChangeSearch: `/cnc/api/v1/product-changes/search`,
  //all
  authorityAll: `/api/v1/auth/all`,
  recordAll: `/cnc/api/v1/record/all`,
  shipmentAll:`/api/v1/shipment/all`,
  documentAll: `/cnc/api/v1/document/all`,

  //fetch
  summaryFetch: `/api/v1/stock/summary/fetch`,
  excelDownload: `${SF_ENDPOINT_EXCEL}/api/v1/download`,
  excelFormatDownload: `${SF_ENDPOINT_EXCEL}/api/v1/format/download`,
  excelUpload: `${SF_ENDPOINT_EXCEL}/api/v1/format/upload`,

  checkLotDuplication: `/api/v1/record/lot/duplication`,
  loadMenu: `/menu/authorize/list`,

  bomLoad: `/api/v1/bom`,
  bomSave: `/api/v1/bom/save`,

  sheetBomLoad: `/api/v1/sheet`,

  anonymousLoad: `/anonymous/load`,
  anonymousDownLoad: `/anonymous/download`,

  documentDownLoad: `/cnc/api/v1/document/download`,
  documentLogs: `/cnc/api/v1/document/logs`,
  documentMove: `/cnc/api/v1/document/move`,

  toolAverage: `/cnc/api/v1/tool/average`,

  sheetFinish: `/api/v1/sheet/update/status`,

  //전력사용량 list
  statisticsPressElectricPower: `/api/v2/statistics/press/electric-power`,

  recordEnd: `/cnc/api/v1/record/complete`,
}


function menuLogic(title : string, url : string, subMenu ?: string[]){
  return {title,url,subMenu}
}

export const defaultBasicTitles = {

  userAuthMgmt : menuLogic('사용자 권한 관리','' ,['_authMgmt','_userMgmt']),
  _authMgmt : menuLogic('권한 관리' ,'/mes/basic/authority/member'),
  _userMgmt : menuLogic('유저 관리' , '/mes/basic/user'),

  factoryInfo : menuLogic('공장 기준정보','/mes/basic/factory'),

  manageMgmt : menuLogic('거래처 관리','/mes/basic/factory', ['_customMgmt','_modelMgmt']),
  _customMgmt : menuLogic('거래처 정보 관리','/mes/basic/customer'),
  _modelMgmt : menuLogic('모델 관리', '/mes/basic/customer/model'),

  processMgmt : menuLogic('공정 관리', '',['_typeMgmt','_pauseMgmt']),
  _typeMgmt : menuLogic('공정 종류 관리','/mes/basic/process'),
  _pauseMgmt : menuLogic('공정 일시정지 유형 등록','/mes/basic/register/pause'),

  qualityInfo : menuLogic('품질 기준정보','',['_defectReg']),
  _defectReg : menuLogic('공정별 불량유형 등록','/mes/basic/register/defect'),

  deviceInfo : menuLogic('주변장치 기준정보','/mes/basic/device'),
  machineInfo : menuLogic('기계 기준정보', '/mes/basic/machine'),
  moldInfo : menuLogic('금형 기준정보','/mes/basic/moldV1u'),
  toolInfo : menuLogic('공구 기준정보','/mes/basic/tool'),
  rawInfo : menuLogic('원자재 기준정보','/mes/basic/rawmaterialV1u'),
  subInfo : menuLogic('부자재 기준정보','/mes/basic/submaterial'),
  productMgmt : menuLogic('제품 등록 관리','/mes/basic/productV1u'),
  documentMgmt : menuLogic('문서 관리','/mes/basic/document'),

}

export const defaultMesTitles = {

  businessMgmt : menuLogic('영업 관리', '',['_orderReg','_orderList','_deliveryReg','_deliveryList']),
  _orderReg : menuLogic('수주 정보 등록', '/mes/order/register'),
  _orderList : menuLogic('수주 현황','/mes/order/list'),
  _deliveryReg : menuLogic('납품 정보 등록','/mes/delivery/register'),
  _deliveryList : menuLogic('납품 현황','/mes/delivery/list'),

  pmReg : menuLogic('생산관리 등록','',['_opReg','_opList','_opReList','_opComList']),
  _opReg : menuLogic('작업지시서 등록','/mes/operationV1u/register'),
  _opList : menuLogic('작업지시서 리스트','/mes/operationV1u/list'),
  _opReList : menuLogic('작업 일보 리스트','/mes/recordV2/list'),
  _opComList : menuLogic('작업 완료 리스트','/mes/finishV2/list'),

  rawMgmt : menuLogic('원자재 관리', '' , ['_rawReg','_rawStock', '_rawReturn']),
  _rawReg : menuLogic('원자재 입고 등록','/mes/rawmaterialV1u/input'),
  _rawStock : menuLogic('원자재 재고 현황','/mes/rawmaterialV1u/stock'),
  _rawReturn : menuLogic('원자재 출고 현황 ','/mes/rawmaterialV1u/returnlist'),

  subMgmt : menuLogic('부자재 관리','',['_subReg','_subStock', '_subReturn']),
  _subReg : menuLogic('부자재 입고 등록','/mes/submaterialV1u/input'),
  _subStock : menuLogic('부자재 재고 현황','/mes/submaterialV1u/stock'),
  _subReturn : menuLogic('부자재 출고 현황 ','/mes/submaterialV1u/returnlist'),

  toolMgmt : menuLogic('공구 관리','',['_toolReg','_toolList','_toolStock']),
  _toolReg : menuLogic('공구 입고 등록','/mes/tool/register'),
  _toolList : menuLogic('공구 입고 리스트','/mes/tool/warehousinglist'),
  _toolStock : menuLogic('공구 재고 현황','/mes/tool/list'),

  qualityMgmt : menuLogic('품질 관리','',['_defectList','_midRangeList','_stdList','_changeNoti','_changeList']),
  _defectList : menuLogic('불량 통계 (자주검사 관리)' ,'/mes/quality/defect'),
  _midRangeList : menuLogic('초ㆍ중ㆍ종 검사 리스트','/mes/quality/midrange/list'),
  _stdList : menuLogic('작업 표준서 관리','/mes/quality/work/standardlist'),
  _changeNoti : menuLogic('변경점 정보 등록','/mes/quality/product/change/register'),
  _changeList : menuLogic('변경점 정보 리스트','/mes/quality/product/change/list'),

  stockMgmt : menuLogic('재고 관리','',['_stockList','_productList','_productListAdmin']),
  _stockList : menuLogic('재고 현황','/mes/stock/list'),
  _productList : menuLogic('생산/납품 현황','/mes/stock/productlist'),
  _productListAdmin : menuLogic('생산/납품 현황(관리자용)','/mes/stock/admin'),

  kpi : menuLogic('KPI','',['_pLeadTime','_manHour','_defect','_oLeadTime','_powerUsage','_uph','_operation']),
  _pLeadTime : menuLogic('제조리드타임(P)','/mes/kpi/leadtime/manufacture'),
  _manHour : menuLogic('작업공수(C)','/mes/kpi/manhour'),
  _defect : menuLogic('품질 불량률(Q)','/mes/kpi/defect'),
  _oLeadTime : menuLogic('수주/납품 리드타임(D)','/mes/kpi/leadtime/order'),
  _powerUsage : menuLogic('전력사용량(E)','/mes/kpi/powerusage'),
  _uph : menuLogic('UPH(P)','/mes/kpi/uph'),
  _operation : menuLogic('설비가동률(P)','/mes/kpi/operation')
}

export const bkMesTitles = {

  ...defaultMesTitles,
  pmReg : menuLogic('생산관리','',['_opReg','_opList','_opReList','_opComList','_opDefect']),
  _opReg : menuLogic('생산 계획 관리(작업지시서 등록)','/mes/operationV1u/register'),
  _opList : menuLogic('생산 계획 관리(작업지시서 리스트)','/mes/operationV1u/list'),
  _opReList : menuLogic('금일 작업 일보 관리(작업 일보 리스트)','/mes/recordV2/list'),
  _opComList : menuLogic('작업 이력 관리(작업 완료 리스트)','/mes/finishV2/list'),
  _opDefect : menuLogic('불량 이력 관리','/mes/defect/list'),

  _midRangeList : menuLogic('자주 검사 관리(초ㆍ중ㆍ종 검사 리스트)','/mes/quality/midrange/list'),
  _stdList : menuLogic('작업 표준서 관리','/mes/quality/work/standardlist'),
  _changeNoti : menuLogic('제품 변경점 관리(변경점 정보 등록)','/mes/quality/product/change/register'),
  _changeList : menuLogic('제품 변경점 관리(변경점 정보 리스트)','/mes/quality/product/change/list'),

}







function toMenu(title : string, url : string, subMenu ?: string[]) {
  return {title,url,subMenu}
}

export const BasicTitles = (customTarget?: string) => {
  const basicDefault = {
    userAuthMgmt: toMenu('사용자 권한 관리', '', [ '_authMgmt', '_userMgmt' ]),
    _authMgmt: toMenu('권한 관리', '/mes/basic/authority/member'),
    _userMgmt: toMenu('유저 관리', '/mes/basic/user'),

    factoryMgmt: toMenu('공장 기준정보', '/mes/basic/factory'),

    customerMgmt: toMenu('거래처 관리', '/mes/basic/factory', [ '_customerMgmt', '_modelMgmt' ]),
    _customerMgmt: toMenu('거래처 정보 관리', '/mes/basic/customer'),
    _modelMgmt: toMenu('모델 관리', '/mes/basic/customer/model'),

    processMgmt: toMenu('공정 관리', '', [ '_processMgmt', '_pauseMgmt' ]),
    _processMgmt: toMenu('공정 종류 관리', '/mes/basic/process'),
    _pauseMgmt: toMenu('공정 일시정지 유형 등록', '/mes/basic/register/pause'),

    qualityMgmt: toMenu('품질 기준정보', '', [ '_defectMgmt' ]),
    _defectMgmt: toMenu('공정별 불량유형 등록', '/mes/basic/register/defect'),

    deviceMgmt: toMenu('주변장치 기준정보', '/mes/basic/device'),
    machineMgmt: toMenu('기계 기준정보', '/mes/basic/machine'),
    moldMgmt: toMenu('금형 기준정보', '/mes/basic/moldV1u'),
    toolMgmt: toMenu('공구 기준정보', '/mes/basic/tool'),
    rawMgmt: toMenu('원자재 기준정보', '/mes/basic/rawmaterialV1u'),
    subMgmt: toMenu('부자재 기준정보', '/mes/basic/submaterial'),
    productMgmt: toMenu('제품 등록 관리', '/mes/basic/productV1u'),
    documentMgmt: toMenu('문서 관리', '/mes/basic/document'),
  }
  switch(customTarget){
    default: return basicDefault
  }
}

export const MesTitles = (customTarget?: string) => {
  const mesDefault = {
    businessMgmt : toMenu('영업 관리', '',['_orderReg','_orderList','_deliveryReg','_deliveryList']),
    _orderReg : toMenu('수주 정보 등록', '/mes/order/register'),
    _orderList : toMenu('수주 현황','/mes/order/list'),
    _deliveryReg : toMenu('납품 정보 등록','/mes/delivery/register'),
    _deliveryList : toMenu('납품 현황','/mes/delivery/list'),

    pmReg : toMenu('생산관리 등록','',['_opReg','_opList','_opReList','_opComList']),
    _opReg : toMenu('작업지시서 등록','/mes/operationV1u/register'),
    _opList : toMenu('작업지시서 리스트','/mes/operationV1u/list'),
    _opReList : toMenu('작업 일보 리스트','/mes/recordV2/list'),
    _opComList : toMenu('작업 완료 리스트','/mes/finishV2/list'),

    rawMgmt : toMenu('원자재 관리', '' , ['_rawReg','_rawStock']),
    // rawMgmt : toMenu('원자재 관리', '' , ['_rawReg','_rawStock', '_rawExportList']),
    _rawReg : toMenu('원자재 입고 등록','/mes/rawmaterialV1u/input'),
    _rawStock : toMenu('원자재 재고 현황','/mes/rawmaterialV1u/stock'),
    // _rawExportList : toMenu('원자재 출고 현황 ','/mes/rawmaterialV1u/export/list'),

    subMgmt : toMenu('부자재 관리','',['_subReg','_subStock']),
    // subMgmt : toMenu('부자재 관리','',['_subReg','_subStock', '_subExportList']),
    _subReg : toMenu('부자재 입고 등록','/mes/submaterialV1u/input'),
    _subStock : toMenu('부자재 재고 현황','/mes/submaterialV1u/stock'),
    // _subExportList : toMenu('부자재 출고 현황 ','/mes/submaterialV1u/export/list'),

    toolMgmt : toMenu('공구 관리','',['_toolReg','_toolList','_toolStock']),
    _toolReg : toMenu('공구 입고 등록','/mes/tool/register'),
    _toolList : toMenu('공구 입고 리스트','/mes/tool/warehousinglist'),
    _toolStock : toMenu('공구 재고 현황','/mes/tool/list'),

    qualityMgmt : toMenu('품질 관리','',['_defectList','_midRangeList','_stdList','_changeNoti','_changeList']),
    _defectList : toMenu('불량 통계 (자주검사 관리)' ,'/mes/quality/defect'),
    _midRangeList : toMenu('초ㆍ중ㆍ종 검사 리스트','/mes/quality/midrange/list'),
    _stdList : toMenu('작업 표준서 관리','/mes/quality/work/standardlist'),
    _changeNoti : toMenu('변경점 정보 등록','/mes/quality/product/change/register'),
    _changeList : toMenu('변경점 정보 리스트','/mes/quality/product/change/list'),

    stockMgmt : toMenu('재고 관리','',['_stockList','_productList','_productListAdmin']),
    _stockList : toMenu('재고 현황','/mes/stock/list'),
    _productList : toMenu('생산/납품 현황','/mes/stock/productlist'),
    _productListAdmin : toMenu('생산/납품 현황(관리자용)','/mes/stock/admin'),

    kpi : toMenu('KPI','',['_pLeadTime','_manHour','_defect','_oLeadTime','_powerUsage','_uph','_operation']),
    _pLeadTime : toMenu('제조리드타임(P)','/mes/kpi/leadtime/manufacture'),
    _manHour : toMenu('작업공수(C)','/mes/kpi/manhour'),
    _defect : toMenu('품질 불량률(Q)','/mes/kpi/defect'),
    _oLeadTime : toMenu('수주/납품 리드타임(D)','/mes/kpi/leadtime/order'),
    _powerUsage : toMenu('전력사용량(E)','/mes/kpi/powerusage'),
    _uph : toMenu('UPH(P)','/mes/kpi/uph'),
    _operation : toMenu('설비가동률(P)','/mes/kpi/operation')
  }
  switch(customTarget){
    case 'bk': return {
      ...mesDefault,
      pmReg : toMenu('생산관리','',['_opReg','_opList','_opReList','_opComList','_opDefect']),
      _opReg : toMenu('생산 계획 관리(작업지시서 등록)','/mes/operationV1u/register'),
      _opList : toMenu('생산 계획 관리(작업지시서 리스트)','/mes/operationV1u/list'),
      _opReList : toMenu('금일 작업 일보 관리(작업 일보 리스트)','/mes/recordV2/list'),
      _opComList : toMenu('작업 이력 관리(작업 완료 리스트)','/mes/finishV2/list'),
      _opDefect : toMenu('불량 이력 관리','/mes/defect/list'),

      _midRangeList : toMenu('자주 검사 관리(초ㆍ중ㆍ종 검사 리스트)','/mes/quality/midrange/list'),
      _changeNoti : toMenu('제품 변경점 관리(변경점 정보 등록)','/mes/quality/product/change/register'),
      _changeList : toMenu('제품 변경점 관리(변경점 정보 리스트)','/mes/quality/product/change/list'),
    }
    default: return mesDefault
  }
}

export const CncTitles = (customTarget?: string) => {
  const cncDefault = {
    cncMon: toMenu('설비 모니터링', '', [ '_cncMon' ]),
    _cncMon: toMenu('CNC 설비 모니터링', '/pms/v2/factoryMonitoring'),
    cncStats: toMenu('CNC 데이터 통계', '',['_prodStats', '_errorStats', '_idleStats']),
    _prodStats: toMenu('생산량', '/pms/v2/analysis/output'),
    _errorStats: toMenu('에러', '/pms/v2/analysis/error'),
    _idleStats: toMenu('기계 비가동 시간', '/pms/v2/analysis/idleTime'),
    cncMnt: toMenu('CNC 관리', '', ['_repReqReg', '_repReqList', '_repCompList','_repCompListAdmin', '_problemReg']),
    _repReqReg: toMenu('설비 수리 요청 등록' , '/pms/v2/press/maintenance/facilities'),
    _repReqList: toMenu('설비 수리 요청 리스트', '/pms/v2/press/maintenance/list'),
    _repCompList: toMenu('설비 수리 완료 리스트', '/pms/v2/press/maintenance/complete'),
    _repCompListAdmin: toMenu('설비 수리 완료 리스트(관리자용)', '/pms/v2/press/maintenance/complete/admin'),
    _problemReg: toMenu('설비 문제 유형 등록' , '/pms/v2/press/maintenance/problem'),
  }
  switch(customTarget){
    default: return cncDefault
  }
}

export const PmsTitles = (customTarget?: string) => {
  const pmsDefault = {
    pressMon: toMenu('프레스 모니터링', '', [ '_pressAnalMon', '_pressStsMon' ]),
    _pressAnalMon: toMenu('프레스 분석 모니터링', '/pms/v2/factoryMonitoring'),
    _pressStsMon: toMenu('프레스 현황 모니터링', '/pms/new/monitoring/press'),
    pressStats: toMenu('프레스 통계 및 분석', '', [ '_prodStats', '_capaStats', '_errorStats', '_powerStats', '_idleStats', '_workStats' ]),
    _prodStats: toMenu('생산량', '/pms/v2/analysis/output'),
    _capaStats: toMenu('능력', '/pms/v2/analysis/ability'),
    _errorStats: toMenu('에러', '/pms/v2/analysis/error'),
    _powerStats: toMenu('전력', '/pms/v2/analysis/power'),
    _idleStats: toMenu('기계 비가동 시간', '/pms/v2/analysis/idleTime'),
    _workStats: toMenu('작업시간', '/pms/v2/analysis/workTime'),
    pressMnt: toMenu('프레스 관리', '', [ '_errorDetail', '_paramDetail', '_camDetail', '_clutchNBrake', '_repReqReg', '_repReqList', '_repCompList', '_repCompListAdmin', '_problemReg', '_pressDailyInspReg', '_pressDailyInspSts' ]),
    _errorDetail: toMenu('에러 보기', '/pms/v2/press/maintenance/errorview'),
    _paramDetail: toMenu('파라미터 보기', '/pms/v2/press/maintenance/parameterview'),
    _camDetail: toMenu('캠 보기', '/pms/v2/press/maintenance/camview'),
    _clutchNBrake: toMenu('클러치&브레이크', '/pms/v2/press/maintenance/clutchandbrake'),
    _repReqReg: toMenu('설비 수리 요청 등록', '/pms/v2/press/maintenance/facilities'),
    _repReqList: toMenu('설비 수리 요청 리스트', '/pms/v2/press/maintenance/list'),
    _repCompList: toMenu('설비 수리 완료 리스트', '/pms/v2/press/maintenance/complete'),
    _repCompListAdmin: toMenu('설비 수리 완료 리스트(관리자용)', '/pms/v2/press/maintenance/complete/admin'),
    _problemReg: toMenu('설비 문제 유형 등록', '/pms/v2/press/maintenance/problem'),
    _pressDailyInspReg: toMenu('프레스 일상점검 등록', '/pms/v2/press/maintenance/PressDailyRegister'),
    _pressDailyInspSts: toMenu('프레스 일상점검 일일현황', '/pms/v2/press/maintenance/PressDailyStatus'),
    moldMnt: toMenu('금형 관리', '', [ '_moldMgmt', '_moldMgmt','_moldRepReqReg','_moldRepReqList','_moldRepCompList','_moldRepCompListAdmin','_moldProblemReg','_moldDailyInspReg','_moldDailyInspSts']),
    _moldMgmt: toMenu('금형 타수 관리', '/pms/v2/mold/maintenance'),
    _moldRepReqReg: toMenu('금형 수리 요청 등록', '/pms/v2/mold/maintenance/repairs'),
    _moldRepReqList: toMenu('금형 수리 요청 리스트', '/pms/v2/mold/maintenance/list'),
    _moldRepCompList: toMenu('금형 수리 완료 리스트', '/pms/v2/mold/maintenance/complete'),
    _moldRepCompListAdmin: toMenu('금형 수리 완료 리스트(관리자용)', '/pms/v2/mold/maintenance/complete/admin'),
    _moldProblemReg: toMenu('금형 문제 유형 등록', '/pms/v2/mold/maintenance/problem'),
    _moldDailyInspReg: toMenu('금형 일상정검 등록', '/pms/v2/press/maintenance/moldDailyRegister'),
    _moldDailyInspSts: toMenu('금형 일상정검 일일현황', '/pms/v2/press/maintenance/moldDailyStatus'),
  }
  switch (customTarget) {
    default:
      return pmsDefault
  }
}


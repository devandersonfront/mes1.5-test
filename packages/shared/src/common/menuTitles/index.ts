import {titles, dohwaTitles, bkTitles,customTitles} from './titles'
import {auth} from './auth'

function toMenu(title: string, url: string, subMenu ?: string[]) {
  return {title,url,subMenu}
}

export const toAuth = (title: string, show: boolean, checkable: boolean, check: boolean, child:any[], value?: string) => {
  return {title,show,checkable,check,child,value}
}

export const HomeTitles = (customTarget?:string) => {
  const homeDefault = {
    home : toMenu(titles.home , '', customTarget === 'ai' ? ['_aiProductLog','_productLog'] : ['_productLog']),
    _productLog : toMenu(titles._productLog, '/mes/home/productLog'),
  }
  switch (customTarget) {
    case 'ai' : return {
      ...homeDefault,
      _aiProductLog: toMenu(titles._aiProductLog, '/mes/ai/productLog')
    }
    default: return homeDefault
  }
}

export const BasicTitles = (customTarget?: string) => {
  const basicDefault = {
    userAuthMgmt: toMenu(titles.userAuthMgmt, '', [ '_authMgmt', '_userMgmt' ]),
    _authMgmt: toMenu(titles._authMgmt, '/mes/basic/authority/member'),
    _userMgmt: toMenu(titles._userMgmt, '/mes/basic/user'),

    factoryMgmt: toMenu(titles.factoryMgmt, '/mes/basic/factory'),

    customerMgmt: toMenu(titles.customerMgmt, '/mes/basic/factory', [ '_customerMgmt', '_modelMgmt' ]),
    _customerMgmt: toMenu(titles._customerMgmt, '/mes/basic/customer'),
    _modelMgmt: toMenu(titles._modelMgmt, '/mes/basic/customer/model'),

    processMgmt: toMenu(titles.processMgmt, '', [ '_processMgmt', '_pauseMgmt' ]),
    _processMgmt: toMenu(titles._processMgmt, '/mes/basic/process'),
    _pauseMgmt: toMenu(titles._pauseMgmt, '/mes/basic/register/pause'),

    qualityMgmt: toMenu(titles.qualityMgmt, '', [ '_defectMgmt' ]),
    _defectMgmt: toMenu(titles._defectMgmt, '/mes/basic/register/defect'),

    deviceMgmt: toMenu(titles.deviceMgmt, '/mes/basic/device'),
    machineMgmt: toMenu(titles.machineMgmt, '/mes/basic/machine'),
    moldMgmt: toMenu(titles.moldMgmt, '/mes/basic/moldV1u'),
    toolMgmt: toMenu(titles.toolMgmt, '/mes/basic/tool'),
    rawMgmt: toMenu(titles.rawMgmt, '/mes/basic/rawmaterialV1u'),
    subMgmt: toMenu(titles.subMgmt, '/mes/basic/submaterial'),
    productMgmt: toMenu(titles.productMgmt, '/mes/basic/productV1u'),
    documentMgmt: toMenu(titles.documentMgmt, '/mes/basic/document'),
    welding: toMenu(titles.welding, '/mes/basic/welding'),
  }
  switch(customTarget){
    case 'dohwa' : return {
      ...basicDefault,
      _modelMgmt: toMenu(dohwaTitles._modelMgmt, '/mes/basic/customer/model'),
    }
    case 'ai' : return {
      ...basicDefault,
      _modelMgmt: toMenu(dohwaTitles._modelMgmt, '/mes/basic/customer/model'),
      opAiDataset: toMenu(titles.opAiDataset, '/mes/ai/dataset')
    }
    case 'custom' : return {
      ...basicDefault,
      customerMgmt: toMenu(customTitles.customerMgmt, '/mes/basic/factory', ['_customerMgmt', '_modelMgmt']),
      _customerMgmt: toMenu(customTitles._customerMgmt, '/mes/basic/customer'),
      _modelMgmt: toMenu(customTitles._modelMgmt, '/mes/basic/customer/model'),
      documentMgmt: toMenu(customTitles.documentMgmt, '/mes/basic/document'),
    }
    default: return basicDefault
  }
}

export const MesTitles = (customTarget?: string) => {
  const mesDefault = {
    businessMgmt: toMenu(titles.businessMgmt, '',['_orderReg','_orderList','_deliveryReg','_deliveryList']),
    _orderReg: toMenu(titles._orderReg, '/mes/order/register'),
    _orderList: toMenu(titles._orderList,'/mes/order/list'),
    _deliveryReg: toMenu(titles._deliveryReg,'/mes/delivery/register'),
    _deliveryList: toMenu(titles._deliveryList,'/mes/delivery/list'),

    pmReg: toMenu(titles.pmReg,'',['_opReg','_opList', '_todayOpList','_opReList','_opComList']),
    _opReg: toMenu(titles._opReg,'/mes/operationV1u/register'),
    _opList: toMenu(titles._opList,'/mes/operationV1u/list'),
    _todayOpList: toMenu(titles._todayOpList,'/mes/operationV1u/list/today'),
    _opReList: toMenu(titles._opReList,'/mes/recordV2/list'),
    _opComList: toMenu(titles._opComList,'/mes/finishV2/list'),

    rawMgmt: toMenu(titles.mesRawMgmt, '' , ['_rawReg','_rawInputList','_rawStock', '_rawExportList']),
    _rawReg: toMenu(titles._rawReg,'/mes/rawmaterialV1u/input'),
    _rawInputList: toMenu(titles._rawInputList,'/mes/rawmaterialV1u/inputList'),
    _rawStock: toMenu(titles._rawStock,'/mes/rawmaterialV1u/stock'),
    _rawExportList: toMenu(titles._rawExportList,'/mes/rawmaterialV1u/export/list'),

    subMgmt: toMenu(titles.mesSubMgmt,'',['_subReg','_subStock', '_subExportList']),
    _subReg: toMenu(titles._subReg,'/mes/submaterialV1u/input'),
    _subStock: toMenu(titles._subStock,'/mes/submaterialV1u/stock'),
    _subExportList: toMenu(titles._subExportList,'/mes/submaterialV1u/export/list'),

    toolMgmt: toMenu(titles.mesToolMgmt,'',['_toolReg','_toolList','_toolStock']),
    _toolReg: toMenu(titles._toolReg,'/mes/tool/register'),
    _toolList: toMenu(titles._toolList,'/mes/tool/warehousinglist'),
    _toolStock: toMenu(titles._toolStock,'/mes/tool/list'),

    qualityMgmt: toMenu(titles.mesQualityMgmt,'',['_defectList','_midRangeList','_stdList','_changeNoti','_changeList']),
    _defectList: toMenu(titles._defectList,'/mes/quality/defect'),
    _midRangeList: toMenu(titles._midRangeList,'/mes/quality/midrange/list'),
    _stdList: toMenu(titles._stdList,'/mes/quality/work/standardlist'),
    _changeNoti: toMenu(titles._changeNoti,'/mes/quality/product/change/register'),
    _changeList: toMenu(titles._changeList,'/mes/quality/product/change/list'),

    stockMgmt: toMenu(titles.stockMgmt,'',['_stockList', '_stockAdjust', '_productList','_productListAdmin']),
    _stockList: toMenu(titles._stockList,'/mes/stock/list'),
    _stockAdjust: toMenu(titles._stockAdjust,'/mes/stock/adjust'),
    _productList: toMenu(titles._productList,'/mes/stock/productlist'),
    _productListAdmin: toMenu(titles._productListAdmin,'/mes/stock/admin'),

    outsourceMgmt: toMenu(titles.outsourceMgmt,'',['_outsourcingOrder', '_outsourcingOrderList', '_outsourcingImport', '_outsourcingImportList','_outsourcingExport','_outsourcingExportList']),
    _outsourcingOrder: toMenu(titles._outsourcingOrder,'/mes/outsourcing/order'),
    _outsourcingOrderList: toMenu(titles._outsourcingOrderList,'/mes/outsourcing/order/list'),
    _outsourcingImport: toMenu(titles._outsourcingImport,'/mes/outsourcing/import'),
    _outsourcingImportList: toMenu(titles._outsourcingImportList,'/mes/outsourcing/import/list'),
    _outsourcingExport: toMenu(titles._outsourcingExport,'/mes/outsourcing/delivery'),
    _outsourcingExportList: toMenu(titles._outsourcingExportList,'/mes/outsourcing/delivery/list'),

    kpi: toMenu(titles.kpi,'',['_pLeadTime','_manHour','_defect','_oLeadTime','_powerUsage','_uph','_operation']),
    _pLeadTime: toMenu(titles._pLeadTime,'/mes/kpi/leadtime/manufacture'),
    _manHour: toMenu(titles._manHour,'/mes/kpi/manhour'),
    _defect: toMenu(titles._defect,'/mes/kpi/defect'),
    _oLeadTime: toMenu(titles._oLeadTime,'/mes/kpi/leadtime/order'),
    _powerUsage: toMenu(titles._powerUsage,'/mes/kpi/powerusage'),
    _uph: toMenu(titles._uph,'/mes/kpi/uph'),
    _operation: toMenu(titles._operation,'/mes/kpi/operation')
  }
  switch(customTarget){
    case 'bk': return {
      ...mesDefault,
      pmReg: toMenu(bkTitles.pmReg,'',['_opReg','_opList','_opReList','_opComList','_opDefect']),
      _opReg: toMenu(bkTitles._opReg,'/mes/operationV1u/register'),
      _opList: toMenu(bkTitles._opList,'/mes/operationV1u/list'),
      _opReList: toMenu(bkTitles._opReList,'/mes/recordV2/list'),
      _opComList: toMenu(bkTitles._opComList,'/mes/finishV2/list'),
      _opDefect: toMenu(bkTitles._opDefect,'/mes/defect/list'),

      _midRangeList: toMenu(bkTitles._midRangeList,'/mes/quality/midrange/list'),
      _changeNoti: toMenu(bkTitles._changeNoti,'/mes/quality/product/change/register'),
      _changeList: toMenu(bkTitles._changeList,'/mes/quality/product/change/list'),
    }
    case 'dohwa': return {
      ...mesDefault,
      //영업관리
      _orderReg: toMenu(dohwaTitles._orderReg, '/mes/order/register'),
      _orderList: toMenu(dohwaTitles._orderList,'/mes/order/list'),
      _deliveryReg: toMenu(dohwaTitles._deliveryReg,'/mes/delivery/register'),
      _deliveryList: toMenu(dohwaTitles._deliveryList,'/mes/delivery/list'),
      //품질관리;
      _stdList: toMenu(dohwaTitles._stdList,'/mes/quality/work/standardlist'),
      _changeNoti: toMenu(dohwaTitles._changeNoti,'/mes/quality/product/change/register'),
      _changeList: toMenu(dohwaTitles._changeList,'/mes/quality/product/change/list'),
      _defectList: toMenu(dohwaTitles._defectList,'/mes/quality/defect'),
      _midRangeList: toMenu(dohwaTitles._midRangeList,'/mes/quality/midrange/list'),

    }
    case 'ai': return {
      ...mesDefault,
      pmReg: toMenu(titles.pmReg,'',['_opReg','_opList', '_todayOpList','_opReList','_opAiReList','_opComList', ]),
      _opAiReList: toMenu(titles._opAiReList,'/mes/ai/recordV2/list'),
    }
    case 'custom' : return {
      ...mesDefault,
      _orderList: toMenu(customTitles._orderList,'/mes/order/list'),
      _deliveryList: toMenu(customTitles._deliveryList,'/mes/delivery/list'),
      _midRangeList: toMenu(customTitles._midRangeList,'/mes/quality/midrange/list'),
      _stdList: toMenu(customTitles._stdList,'/mes/quality/work/standardlist'),
      _changeList: toMenu(customTitles._changeList,'/mes/quality/product/change/list'),
      _manHour: toMenu(customTitles._manHour,'/mes/kpi/manhour'),
      _defect: toMenu(customTitles._defect,'/mes/kpi/defect'),
      _oLeadTime: toMenu(customTitles._oLeadTime,'/mes/kpi/leadtime/order'),
      _powerUsage: toMenu(customTitles._powerUsage,'/mes/kpi/powerusage'),
      _uph: toMenu(customTitles._uph,'/mes/kpi/uph'),
    }
    default: return mesDefault
  }
}

export const CncTitles = (customTarget?: string) => {
  const cncDefault = {
    cncMon: toMenu(titles.cncMon, '', [ '_cncMon' ]),
    _cncMon: toMenu(titles._cncMon, '/cnc/v2/factoryMonitoring'),
    cncStats: toMenu(titles.cncStats, '',['_prodStats', '_errorStats', '_idleStats']),
    _prodStats: toMenu(titles._prodStats, '/cnc/v2/analysis/output'),
    _errorStats: toMenu(titles._errorStats, '/cnc/v2/analysis/error'),
    _idleStats: toMenu(titles._idleStats, '/cnc/v2/analysis/idleTime'),
    cncMnt: toMenu(titles.cncMnt, '', ['_repReqReg', '_repReqList', '_repCompList','_repCompListAdmin', '_problemReg']),
    _repReqReg: toMenu(titles._repReqReg, '/cnc/v2/press/maintenance/facilities'),
    _repReqList: toMenu(titles._repReqList, '/cnc/v2/press/maintenance/list'),
    _repCompList: toMenu(titles._repCompList, '/cnc/v2/press/maintenance/complete'),
    _repCompListAdmin: toMenu(titles._repCompListAdmin, '/cnc/v2/press/maintenance/complete/admin'),
    _problemReg: toMenu(titles._problemReg, '/cnc/v2/press/maintenance/problem'),
  }
  switch(customTarget){
    case 'dohwa': return {
      ...cncDefault,
      cncMon: toMenu(dohwaTitles.cncMon, '', [ '_cncMon' ]),
      _cncMon: toMenu(dohwaTitles._cncMon, '/cnc/v2/factoryMonitoring'),
      _repCompListAdmin: toMenu(dohwaTitles._repCompListAdmin, '/cnc/v2/press/maintenance/complete/admin'),
    }
    default: return cncDefault
  }
}

export const PmsTitles = (customTarget?: string) => {
  const pmsDefault = {
    pressMon: toMenu(titles.pressMon, '', [ '_pressAnalMon', '_pressStsMon' ]),
    _pressAnalMon: toMenu(titles._pressAnalMon, '/pms/v2/factoryMonitoring'),
    _pressStsMon: toMenu(titles._pressStsMon, '/pms/new/monitoring/press'),
    pressStats: toMenu(titles.pressStats, '', [ '_prodStats', '_capaStats', '_errorStats', '_powerStats', '_idleStats', '_workStats' ]),
    _prodStats: toMenu(titles._prodStats, '/pms/v2/analysis/output'),
    _capaStats: toMenu(titles._capaStats, '/pms/v2/analysis/ability'),
    _errorStats: toMenu(titles._errorStats, '/pms/v2/analysis/error'),
    _powerStats: toMenu(titles._powerStats,'/pms/v2/analysis/power'),
    _idleStats: toMenu(titles._idleStats, '/pms/v2/analysis/idleTime'),
    _workStats: toMenu(titles._workStats, '/pms/v2/analysis/workTime'),
    pressMnt: toMenu(titles.pressMnt, '', [ '_errorDetail', '_paramDetail', '_camDetail', '_clutchNBrake', '_repReqReg', '_repReqList', '_repCompList', '_repCompListAdmin', '_problemReg', '_pressDailyInspReg', '_pressDailyInspSts' ]),
    _errorDetail: toMenu(titles._errorDetail, '/pms/v2/press/maintenance/errorview'),
    _paramDetail: toMenu(titles._paramDetail, '/pms/v2/press/maintenance/parameterview'),
    _camDetail: toMenu(titles._camDetail, '/pms/v2/press/maintenance/camview'),
    _clutchNBrake: toMenu(titles._clutchNBrake, '/pms/v2/press/maintenance/clutchandbrake'),
    _repReqReg: toMenu(titles._repReqReg, '/pms/v2/press/maintenance/facilities'),
    _repReqList: toMenu(titles._repReqList, '/pms/v2/press/maintenance/list'),
    _repCompList: toMenu(titles._repCompList, '/pms/v2/press/maintenance/complete'),
    _repCompListAdmin: toMenu(titles._repCompListAdmin, '/pms/v2/press/maintenance/complete/admin'),
    _problemReg: toMenu(titles._problemReg, '/pms/v2/press/maintenance/problem'),
    _pressDailyInspReg: toMenu(titles._pressDailyInspReg, '/pms/v2/press/maintenance/PressDailyRegister'),
    _pressDailyInspSts: toMenu(titles._pressDailyInspSts, '/pms/v2/press/maintenance/PressDailyStatus'),
    moldMnt: toMenu(titles.moldMnt, '', [ '_moldMgmt','_moldRepReqReg','_moldRepReqList','_moldRepCompList','_moldRepCompListAdmin','_moldProblemReg','_moldDailyInspReg','_moldDailyInspSts']),
    _moldMgmt: toMenu(titles._moldMgmt, '/pms/v2/mold/maintenance'),
    _moldRepReqReg: toMenu(titles._moldRepReqReg, '/pms/v2/mold/maintenance/repairs'),
    _moldRepReqList: toMenu(titles._moldRepReqList, '/pms/v2/mold/maintenance/list'),
    _moldRepCompList: toMenu(titles._moldRepCompList, '/pms/v2/mold/maintenance/complete'),
    _moldRepCompListAdmin: toMenu(titles._moldRepCompListAdmin, '/pms/v2/mold/maintenance/complete/admin'),
    _moldProblemReg: toMenu(titles._moldProblemReg, '/pms/v2/mold/maintenance/problem'),
    _moldDailyInspReg: toMenu(titles._moldDailyInspReg, '/pms/v2/press/maintenance/moldDailyRegister'),
    _moldDailyInspSts: toMenu(titles._moldDailyInspSts, '/pms/v2/press/maintenance/moldDailyStatus'),
  }
  switch (customTarget) {
    default:
      return pmsDefault
  }
}

export const HomeAuth = (customTarget?: string) => {
  const homeDefault = {
    home: toAuth(titles.home, false, false, true, [], auth._home ),
  }
  switch(customTarget){
    default: return homeDefault
  }
}

  export const BasicAuth = (customTarget?: string) => {
  const basicDefault = {
    userAuthMgmt: toAuth(titles.userAuthMgmt, false,true,false, [ '_authMgmt', '_userMgmt' ]),
    _authMgmt: toAuth(titles._authMgmt, false, true, false, [], auth._authMgmt ),
    _userMgmt: toAuth(titles._userMgmt, false, true, false, [], auth._userMgmt ),
    factoryMgmt: toAuth(titles.factoryMgmt, false, true, false, [], auth.factoryMgmt ),
    customerMgmt: toAuth(titles.customerMgmt, false, true, false, ['_customerMgmt', '_modelMgmt'] ),
    _customerMgmt: toAuth(titles._customerMgmt, false, true, false, [], auth._customerMgmt ),
    _modelMgmt: toAuth(titles._modelMgmt, false, true, false, [], auth._modelMgmt ),
    processMgmt: toAuth(titles.processMgmt, false, true, false, ['_processMgmt', '_pauseMgmt'] ),
    _processMgmt: toAuth(titles._processMgmt, false, true, false, [], auth._processMgmt ),
    _pauseMgmt: toAuth(titles._pauseMgmt, false, true, false, [], auth._pauseMgmt ),
    qualityMgmt: toAuth(titles.qualityMgmt, false, true, false, ['_defectMgmt'] ),
    _defectMgmt: toAuth(titles._defectMgmt, false, true, false, [], auth._defectMgmt ),
    deviceMgmt: toAuth(titles.deviceMgmt, false, true, false, [], auth.deviceMgmt ),
    machineMgmt: toAuth(titles.machineMgmt, false, true, false, [], auth.machineMgmt ),
    moldMgmt: toAuth(titles.moldMgmt, false, true, false, [], auth.moldMgmt ),
    toolMgmt: toAuth(titles.toolMgmt, false, true, false, [], auth.toolMgmt ),
    rawMgmt: toAuth(titles.rawMgmt, false, true, false, [], auth.rawMgmt ),
    subMgmt: toAuth(titles.subMgmt, false, true, false, [], auth.subMgmt ),
    productMgmt: toAuth(titles.productMgmt, false, true, false, [], auth.productMgmt ),
    documentMgmt: toAuth(titles.documentMgmt, false, true, false, [], auth.documentMgmt ),
    welding: toAuth(titles.welding, false, true, false, [], auth.documentMgmt ),
  }
  switch(customTarget){
    case 'ai' : return {
      ...basicDefault,
      opAiDataset: toAuth(titles.opAiDataset, true, false, true, []),
    }
    default: return basicDefault
  }
}

export const MesAuth = (customTarget?: string) => {
  const mesDefault = {
    businessMgmt: toAuth(titles.businessMgmt, false, true, false, ['_orderReg', '_orderList','_deliveryReg','_deliveryList']),
    _orderReg: toAuth(titles._orderReg, false, true, false, [], auth._orderReg),
    _orderList: toAuth(titles._orderList, false, true, false, [], auth._orderList),
    _deliveryReg: toAuth(titles._deliveryReg, false, true, false, [], auth._deliveryReg),
    _deliveryList: toAuth(titles._deliveryList, false, true, false, [], auth._deliveryList),
    pmReg: toAuth(titles.pmReg, false, true, false, ['_opReg','_opList','_todayOpList','_opReList','_opComList'] ),
    _opReg: toAuth(titles._opReg, false, true, false, [], auth._opReg),
    _opList: toAuth(titles._opList, false, true, false, [], auth._opList),
    _todayOpList: toAuth(titles._todayOpList, false, true, false, [], auth._opList),
    _opReList: toAuth(titles._opReList, false, true, false, [], auth._opReList),
    _opComList: toAuth(titles._opComList, false, true, false, [], auth._opComList),
    rawMgmt: toAuth(titles.mesRawMgmt, false, true, false, ['_rawReg','_rawStock','_rawExportList']),
    _rawReg: toAuth(titles._rawReg, false, true, false, [], auth._rawReg),
    _rawStock: toAuth(titles._rawStock, false, true, false, [], auth._rawStock),
    _rawExportList: toAuth(titles._rawExportList, false, true, false, [], auth._rawExportList),
    subMgmt: toAuth(titles.mesSubMgmt, false, true, false, ['_subReg','_subStock','_subExportList']),
    _subReg: toAuth(titles._subReg, false, true, false, [], auth._subReg),
    _subStock: toAuth(titles._subStock, false, true, false, [], auth._subStock),
    _subExportList: toAuth(titles._subExportList, false, true, false, [], auth._subExportList),
    toolMgmt: toAuth(titles.mesToolMgmt, false, true, false, ['_toolReg','_toolList','_toolStock']),
    _toolReg: toAuth(titles._toolReg, false, true, false, [], auth._toolReg),
    _toolList: toAuth(titles._toolList, false, true, false, [], auth._toolList),
    _toolStock: toAuth(titles._toolStock, false, true, false, [], auth._toolStock),
    qualityMgmt: toAuth(titles.mesQualityMgmt, false, true, false, ['_defectList','_midRangeList','_stdList','_changeNoti','_changeList']),
    _defectList: toAuth(titles._defectList, false, true, false, [], auth._defectList),
    _midRangeList: toAuth(titles._midRangeList, false, true, false, [], auth._midRangeList),
    _stdList: toAuth(titles._stdList, false, true, false, [], auth._stdList),
    _changeNoti: toAuth(titles._changeNoti, false, true, false, [], auth._changeNoti),
    _changeList: toAuth(titles._changeList, false, true, false, [], auth._changeList),
    stockMgmt: toAuth(titles.stockMgmt, false, true, false, ['_stockList','_stockAdjust','_productList','_productListAdmin']),
    _stockList: toAuth(titles._stockList, false, true, false, [], auth._stockList),
    _stockAdjust: toAuth(titles._stockAdjust, false, true, false, [], auth._stockAdjust),
    _productList: toAuth(titles._productList, false, true, false, [], auth._productList),
    _productListAdmin: toAuth(titles._productListAdmin, false, true, false, [], auth._productListAdmin),
   outsourceMgmt: toAuth(titles.outsourceMgmt, false, true, false,['_outsourcingOrder', '_outsourcingOrderList', '_outsourcingImport', '_outsourcingImportList','_outsourcingExport','_outsourcingExportList']),
   _outsourcingOrder: toAuth(titles._outsourcingOrder,false, true, false, [], auth._outsourcingOrder),
   _outsourcingOrderList: toAuth(titles._outsourcingOrderList,false, true, false, [], auth._outsourcingOrderList),
   _outsourcingImport: toAuth(titles._outsourcingImport,false, true, false, [], auth._outsourcingImport),
   _outsourcingImportList: toAuth(titles._outsourcingImportList,false, true, false, [], auth._outsourcingImportList),
   _outsourcingExport: toAuth(titles._outsourcingExport,false, true, false, [], auth._outsourcingExport),
   _outsourcingExportList: toAuth(titles._outsourcingExportList,false, true, false, [], auth._outsourcingExportList),
    kpi: toAuth(titles.kpi, false, true, false, ['_pLeadTime','_manHour','_defect','_oLeadTime','_powerUsage','_uph','_operation']),
    _pLeadTime: toAuth(titles._pLeadTime, false, true, false, [], auth._pLeadTime),
    _manHour: toAuth(titles._manHour, false, true, false, [], auth._manHour),
    _defect: toAuth(titles._defect, false, true, false, [], auth._defect),
    _oLeadTime: toAuth(titles._oLeadTime, false, true, false, [], auth._oLeadTime),
    _powerUsage: toAuth(titles._powerUsage, false, true, false, [], auth._powerUsage),
    _uph: toAuth(titles._uph, false, true, false, [], auth._uph),
    _operation: toAuth(titles._operation, false, true, false, [], auth._operation),
  }
  switch(customTarget){
    case 'bk': return {
      ...mesDefault,
      pmReg: toAuth(bkTitles.pmReg, false, true, false, ['_opReg','_opList','_opReList','_opComList','_opDefect'] ),
      _opReg: toAuth(bkTitles._opReg, false, true, false, [], auth._opReg),
      _opList: toAuth(bkTitles._opList, false, true, false, [], auth._opList),
      _opReList: toAuth(bkTitles._opReList, false, true, false, [], auth._opReList),
      _opComList: toAuth(bkTitles._opComList, false, true, false, [], auth._opComList),
      _opDefect: toAuth(bkTitles._opDefect, false, true, false, [], auth._opList),
      _midRangeList: toAuth(bkTitles._midRangeList, false, true, false, [], auth._midRangeList),
      _changeNoti: toAuth(bkTitles._changeNoti, false, true, false, [], auth._changeNoti),
      _changeList: toAuth(bkTitles._changeList, false, true, false, [], auth._changeList),
    }
    default: return mesDefault
  }
}

export const CncAuth = (customTarget?: string) => {
  const cncDefault = {
    cncMon: toAuth(titles.cncMon, false, true, false, ['_cncMon']),
    _cncMon: toAuth(titles._cncMon, false, true, false, [], auth._cncMon),
    cncStats: toAuth(titles.cncStats, false, true, false, ['_prodStats','_errorStats','_idleStats']),
    _prodStats: toAuth(titles._prodStats, false, true, false, [], auth._cncProdStats),
    _errorStats: toAuth(titles._errorStats, false, true, false, [], auth._cncErrorStats),
    _idleStats: toAuth(titles._idleStats, false, true, false, [], auth._cncIdleStats),
    cncMnt: toAuth(titles.cncMnt, false, true, false, ['_repReqReg','_repReqList','_repCompList']),
    _repReqReg: toAuth(titles._repReqReg, false, true, false, [], auth._cncRepReqReg),
    _repReqList: toAuth(titles._repReqList, false, true, false, [], auth._cncRepReqList),
    _repCompList: toAuth(titles._repCompList, false, true, false, [], auth._cncRepCompList),
    _repCompListAdmin: toAuth(titles._repCompListAdmin, false, true, false, [], auth._cncRepCompListAdmin),
    _problemReg: toAuth(titles._problemReg, false, true, false, [], auth._cncProblemReg),
  }
  switch(customTarget){
    default: return cncDefault
  }
}

export const PmsAuth = (customTarget?: string) => {
  const pmsDefault = {
    pressMon: toAuth(titles.pressMon, false, true, false, ['_pressAnalMon','_pressStsMon']),
    _pressAnalMon: toAuth(titles._pressAnalMon, false, true, false, [], auth._pressAnalMon),
    _pressStsMon: toAuth(titles._pressStsMon, false, true, false, [], auth._pressStsMon),
    pressStats: toAuth(titles.pressStats, false, true, false, ['_prodStats','_capaStats','_errorStats','_powerStats','_idleStats','_workStats']),
    _prodStats: toAuth(titles._prodStats, false, true, false, [], auth._prodStats),
    _capaStats: toAuth(titles._capaStats, false, true, false, [], auth._capaStats),
    _errorStats: toAuth(titles._errorStats, false, true, false, [], auth._errorStats),
    _powerStats: toAuth(titles._powerStats, false, true, false, [], auth._powerStats),
    _idleStats: toAuth(titles._idleStats, false, true, false, [], auth._idleStats),
    _workStats: toAuth(titles._workStats, false, true, false, [], auth._workStats),
    pressMnt: toAuth(titles.pressMnt, false, true, false, ['_errorDetail','_paramDetail','_camDetail','_clutchNBrake','_repReqReg','_repReqList','_repCompList','_repCompListAdmin','_problemReg','_pressDailyInspReg','_pressDailyInspSts']),
    _errorDetail: toAuth(titles._errorDetail, false, true, false, [], auth._errorDetail),
    _paramDetail: toAuth(titles._paramDetail, false, true, false, [], auth._paramDetail),
    _camDetail: toAuth(titles._camDetail, false, true, false, [], auth._camDetail),
    _clutchNBrake: toAuth(titles._clutchNBrake, false, true, false, [], auth._clutchNBrake),
    _repReqReg: toAuth(titles._repReqReg, false, true, false, [], auth._repReqReg),
    _repReqList: toAuth(titles._repReqList, false, true, false, [], auth._repReqList),
    _repCompList: toAuth(titles._repCompList, false, true, false, [], auth._repCompList),
    _repCompListAdmin: toAuth(titles._repCompListAdmin, false, true, false, [], auth._repCompListAdmin),
    _problemReg: toAuth(titles._problemReg, false, true, false, [], auth._problemReg),
    _pressDailyInspReg: toAuth(titles._pressDailyInspReg, false, true, false, [], auth._pressDailyInspReg),
    _pressDailyInspSts: toAuth(titles._pressDailyInspSts, false, true, false, [], auth._pressDailyInspSts),
    moldMnt: toAuth(titles.moldMnt, false, true, false, ['_moldMgmt','_moldRepReqReg','_moldRepReqList','_moldRepCompList','_moldRepCompListAdmin','_moldProblemReg','_moldDailyInspReg','_moldDailyInspSts']),
    _moldMgmt: toAuth(titles._moldMgmt, false, true, false, [], auth._moldMgmt),
    _moldRepReqReg: toAuth(titles._moldRepReqReg, false, true, false, [], auth._moldRepReqReg),
    _moldRepReqList: toAuth(titles._moldRepReqList, false, true, false, [], auth._moldRepReqList),
    _moldRepCompList: toAuth(titles._moldRepCompList, false, true, false, [], auth._moldRepCompList),
    _moldRepCompListAdmin: toAuth(titles._moldRepCompListAdmin, false, true, false, [], auth._moldRepCompListAdmin),
    _moldProblemReg: toAuth(titles._moldProblemReg, false, true, false, [], auth._moldProblemReg),
    _moldDailyInspReg: toAuth(titles._moldDailyInspReg, false, true, false, [], auth._moldDailyInspReg),
    _moldDailyInspSts: toAuth(titles._moldDailyInspSts, false, true, false, [], auth._moldDailyInspSts),
  }
  switch (customTarget) {
    default:
      return pmsDefault
  }
}

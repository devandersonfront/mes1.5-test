export type HomeOrderType = 'home'

export type BasicOrderType =
    'userAuthMgmt' | 'factoryMgmt' | 'customerMgmt' | 'processMgmt' | 'qualityMgmt' |
    'deviceMgmt' | 'machineMgmt' | 'moldMgmt' | 'toolMgmt' | 'rawMgmt' | 'subMgmt' |
    'productMgmt' | 'opAiDataset' | 'documentMgmt' | 'welding'

export type MesOrderType =
    'businessMgmt' | 'pmReg' | 'rawMgmt' | 'subMgmt' | 'toolMgmt' | 'qualityMgmt' |
    'stockMgmt' | 'kpi' | 'outsourceMgmt'

export type PmsOrderType =
  'pressMon' | 'pressStats' | 'pressMnt' | 'moldMnt'

export type CncOrderType =
  'cncMon' | 'cncStats' | 'cncMnt'

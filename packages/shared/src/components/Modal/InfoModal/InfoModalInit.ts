export const factoryInfoInit = {
  title: '공장 정보',
  buttonText: '세분화 등록',
  modalKey: 'factoryInfo',
  summaryInfo: [
    [{title: '공장명', infoWidth: 144, key: 'name'}, {title: '공장 주소', infoWidth: 786, key: 'address'},],
    [{title: '담당자', infoWidth: 144, key: 'manager'}, {title: '직책', infoWidth: 144, key: 'appointment'},{title: '전화번호', infoWidth: 465, key: 'cellphone'},],
    [{title: '비고', infoWidth: 1107, key: 'description'},],
  ],
  cellEditButtons: true
}

export const deviceInfoInit = {
  title: '주변장치 정보',
  buttonText: '주변장치 등록',
  modalKey: 'deviceInfo',
  summaryInfo: [
    [{title: '기계 제조사', infoWidth: 144, key: 'manufacturer'}, {title: '기계 이름', infoWidth: 786, key: 'name'},],
    [
      {title: '기계 종류', infoWidth: 144, key: 'type'},
      {title: '용접 종류', infoWidth: 144, key: 'weldingType'},
      {title: '제조 번호', infoWidth: 144, key: 'mfrCode'},
      {title: '담당자', infoWidth: 144, key: 'user_id'},
    ],
    [{title: '오버홀', infoWidth: 144, key: 'interwork'},],
  ],
  cellEditButtons: true
}

export const productInfoInit = {
  title: '생산 품목 정보',
  buttonText: '품목 등록',
  modalKey: 'productInfo',
  buttonCheck: 'product',
  existDataText: '품목 보기',
  summaryInfo: [
    [
      {title: 'CODE', infoWidth: 465, key: 'code'},
      {title: '금형명', infoWidth: 465, key: 'name'},
    ],
    [
      {title: '캐비티', infoWidth: 144, key: 'cavity', unit: 'EA'},
      {title: 'SPM', infoWidth: 144, key: 'spm'},
      {title: '슬라이드 위치', infoWidth: 144, key: 'slideHeight'},
    ],
    [
      {title: '최대 타수', infoWidth: 144, key: 'limit'},
      {title: '점검 타수', infoWidth: 144, key: 'inspect'},
      {title: '현재 타수', infoWidth: 144, key: 'current'},
    ],
  ],
  cellEditButtons: false,
  tableTitleButton: '반·완제품'
}

export const BomRegisterInit = {
  title: 'BOM정보 (해당 제품을 만드는데 사용할 자재를 선택해주세요. 자재 정보가 없으면 BOM 수정 버튼을 눌러 BOM 정보를 수정해주세요)',
  buttonText: '자재확인',
  modalKey: 'bomRegister',
  summaryInfo: [
    [{title: '고객사명', infoWidth: 144, key: 'customer'}, {title: '모델', infoWidth: 144, key: 'model'},],
    [
      {title: 'CODE', infoWidth: 144, key: 'code'},
      {title: '품명', infoWidth: 144, key: 'name'},
      {title: '품목 종류', infoWidth: 144, key: 'type'},
      {title: '생산 공정', infoWidth: 144, key: 'process'},
    ],
    [{title: '단위', infoWidth: 144, key: 'unit'},{title: '목표 생산량', infoWidth: 144, key: 'goal'},],
  ],
  tableMoveButton: 'BOM 수정'
}

export interface InfoInitType {
  existText?: string //값이 있을 때 텍스트
  buttonText?: string //값이 없을 때 텍스트
  title: string //모달의 제목
  modalType?: 'INFO' | 'REGISTER' | 'SELECT' //모달의 타입 (기본 : INFO)
  // searchFilter: string[] //검색 옵션 리스트
  excelColumnType: string //테이블 헤더 지정값 modalInit.ts 파일의 키값
  excelDownload?: boolean
  leftTopHeader?: any //테이블의 왼쪽 위에 들어갈 컴포넌트
  rightTopHeader?: any //테이블의 오른쪽 위에 들어갈 컴포넌트
  readonly?: boolean
}

export const InfoInit: Record<string, InfoInitType> = {
  factoryRegister: {
    buttonText: '세분화 등록',
    existText: '세분화 보기',
    title: '공장 정보',
    excelColumnType: 'factoryInfo',
    excelDownload: true,
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  },
  deviceRegister: {
    buttonText: '주변장치 등록',
    existText: '주변장치 보기',
    title: '주변장치 정보',
    excelColumnType: 'deviceInfo',
    excelDownload: true,
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  },
  productInfo: {
    readonly: true,
    buttonText: '품목 등록',
    existText: '품목 보기',
    title: '주변장치 정보',
    excelColumnType: 'deviceInfo',
    excelDownload: true,
    leftTopHeader: {
      type: 'titleButton',
      title: '반·완제품'
    }
  },
  bomInfo: {
    buttonText: 'BOM 등록',
    title: 'BOM 정보 (해당 제품을 만드는데 필요한 BOM을 등록해주세요)',
    excelColumnType: 'bomInfo',
    excelDownload: true,
    leftTopHeader: {
      type: 'titleTabMenu',
      title: '반·완제품'
    },
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  },
  bomInfoReadOnly: {
    buttonText: 'BOM 등록',
    existText: '자재 보기',
    title: 'BOM 정보 (해당 제품을 만드는데 사용할 자재를 선택해주세요. 자재 정보가 없으면 BOM 수정 버튼을 눌러 BOM 정보를 수정해주세요)',
    excelColumnType: 'bomRegister',
    excelDownload: true,
    leftTopHeader: {
      type: 'titleTabMenu',
    },
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  },
  moldInfo: {
    buttonText: '금형 등록',
    title: '금형 정보 (해당 제품을 만드는데 필요한 금형을 등록해주세요)',
    excelColumnType: 'moldInfo',
    excelDownload: true,
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  },
  machineInfo: {
    buttonText: '기계 등록',
    title: '기계 정보 (재품 생산하는 데 사용되는 모든 기계를 입력해주세요)',
    excelColumnType: 'machineInfo',
    excelDownload: true,
    rightTopHeader: {
      type: 'excelEventButtons'
    }
  }
}

export interface SummaryInfoInitType {
  title: string
  key: string
  width?: number
  unit?: string
}

export const SummaryInfoInit: Record<string, Array<SummaryInfoInitType[]>> = {
  factory: [
    [
      {title: '공장명', key: 'factory'},
      {title: '공장 주소', key: 'address', width: 786},
    ],
    [
      {title: '담당자', key: 'name'},
      {title: '직책', key: 'appointment'},
      {title: '전화번호', key: 'cellphone', width: 465},
    ],
    [
      {title: '비고', key: 'description', width: 1107},
    ],
  ],
  device: [
    [
      {title: '기계 제조사', key: 'manufacture'},
      {title: '기계 이름', key: 'name', width: 786},
    ],
    [
      {title: '기계 종류', key: 'type'},
      {title: '용접 종류', key: 'weldingType'},
      {title: '제조 번호', key: 'mfrCode'},
      {title: '담당자', key: 'user_id'},
    ],
    [
      {title: '오버홀', key: 'overwork'},
    ],
  ],
  mold: [
    [
      {title: 'CODE', key: 'code', width: 465},
      {title: '금형명', key: 'name', width: 465},
    ],
    [
      {title: '캐비티', key: 'cavity', unit: 'EA'},
      {title: 'SPM', key: 'spm'},
      {title: '슬라이드 위치', key: 'dieHeight'},
    ],
    [
      {title: '최대 타수', key: 'max'},
      {title: '점검 타수', key: 'check'},
      {title: '현재 타수', key: 'current'},
    ],
  ],
  product: [
    [
      {title: '고객사명', key: 'customer'},
      {title: '모델', key: 'model'},
    ],
    [
      {title: 'CODE', key: 'code'},
      {title: '품명', key: 'name'},
      {title: '품목 종류', key: 'type'},
      {title: '생산 공정', key: 'process'},
    ],
    [
      {title: '생산수량', key: 'cavity'},
      {title: '단위', key: 'unit'},
    ],
  ],
  product_no_cavity: [
    [
      {title: '고객사명', key: 'customer'},
      {title: '모델', key: 'model'},
    ],
    [
      {title: 'CODE', key: 'code'},
      {title: '품명', key: 'name'},
      {title: '품목 종류', key: 'type'},
      {title: '생산 공정', key: 'process'},
    ],
    [
      {title: '단위', key: 'unit'},
    ],
  ]
}

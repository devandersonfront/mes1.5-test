interface SearchInitType {
  title: string //모달의 제목
  searchFilter: string[] //검색 옵션 리스트
  excelColumnType: string //테이블 헤더 지정값 modalInit.ts 파일의 키값
  placeholder?: string //플레이스 홀더
}

export const SearchInit: Record<string, SearchInitType> = {
  authority:{
    title: "권한 검색",
    searchFilter: ["권한명"],
    excelColumnType: "auth"
  },
  user: {
    title: '유저 검색',
    searchFilter: ['성명', '이메일', '직책명'],
    excelColumnType: 'user'
  },
  worker: {
    title: '유저 검색',
    searchFilter: ['성명', '이메일', '직책명'],
    excelColumnType: 'user'
  },
  customer: {
    title: '거래처 검색',
    searchFilter: ['거래처명', '대표자명', '담당자명', '사업자 번호'],
    excelColumnType: 'customer'
  },
  factory: {
    title: '공장 검색',
    searchFilter: ['공장명',"주소", '담당자명'],
    excelColumnType: 'factory'
  },
  deviceFactory: {
    title: '공장 검색',
    searchFilter: ['공장명',"주소", '담당자명'],
    excelColumnType: 'deviceFactory'
  },
  subFactory: {
    title: "공장 세분화",
    searchFilter:["세분화명", "담당자명", "전화번호"],
    placeholder:"세분화명",
    excelColumnType:"subFactory"
  },
  segment: {
    title: '공장 세분화명 검색',
    searchFilter: ['공장명', '세분화명', '담당자명'],
    excelColumnType: 'segment'
  },
  model: {
    title: '모델명 검색',
    searchFilter: ['거래처명', '대표자명', '사업자 번호', '모델명'],
    excelColumnType: 'model'
  },
  tool: {
    title: '공구 검색',
    searchFilter: ['공구CODE', '공구 품명', '거래처',],
    excelColumnType: 'tool'
  },
  searchToolModal: {
    title: '공구 리스트',
    searchFilter: ['공구CODE', '공구 품명', '거래처',],
    excelColumnType: 'toolProduct'
  },
  customerModel: {
    title: "모델명 검색",
    searchFilter: ['거래처명','사업자 번호', '모델명'],
    excelColumnType: 'model'
  },
  rawmaterial: {
    title: '원자재 검색',
    searchFilter: ['원자재 CODE', '원자재 품명', '재질', '거래처'],
    excelColumnType: 'rawMaterial'
  },
  submaterial: {
    title: '부자재 검색',
    searchFilter: ['부자재 CODE', '부자재 품명', '거래처'],
    excelColumnType: 'subMaterial'
  },
  mold: {
    title: '금형 검색',
    searchFilter: ['CODE', '금형명'],
    excelColumnType: 'mold'
  },
  machine: {
    title: '기계 검색',
    // searchFilter: ['제조 번호', '기게 이름', '기계 종류', '톤 수', '공장명'],
    searchFilter: ['제조사명', '기계명', '기계 종류', '제조번호명', '', '공장명', '세분화 공장명'],
    excelColumnType: 'machine'
  },
  device: {
    title: '주변장치 검색',
    searchFilter: ['제조 번호', '기게 이름', '기계 종류', '톤 수', '공장명'],
    excelColumnType: 'device'
  },
  product: {
    title: '제품 검색',
    searchFilter: ['CODE', '모델', '거래처', '품명'],
    excelColumnType: 'product',
    placeholder: 'CODE 검색'
  },
  bom: {
    title: '제품 검색',
    searchFilter: ['거래처', '모델', 'CODE', '품명'],
    excelColumnType: 'rawMaterial',
    placeholder: 'CODE 검색'
  },
  order: {
    title: '수주 검색',
    searchFilter: ['수주 번호', '거래처', '모델', 'CODE', '품명'],
    excelColumnType: 'contract',
    placeholder: '수주번호입력'
  },
  process:{
    title:"공정 검색",
    searchFilter:["공정명"],
    excelColumnType:"process",

  }
}

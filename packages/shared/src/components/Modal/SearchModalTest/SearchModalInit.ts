interface SearchInitType {
  title: string //모달의 제목
  searchFilter: string[] //검색 옵션 리스트
  excelColumnType: string //테이블 헤더 지정값 modalInit.ts 파일의 키값
  placeholder?: string //플레이스 홀더
}

export const SearchInit: Record<string, SearchInitType> = {
  user: {
    title: '유저 검색',
    searchFilter: ['성명', '직책', '권한'],
    excelColumnType: 'user'
  },
  customer: {
    title: '거래처 검색',
    searchFilter: ['거래처명', '대표자명', '담당자명', '사업자 번호'],
    excelColumnType: 'customer'
  },
  factory: {
    title: '공장 검색',
    searchFilter: ['공장명', '담당자명'],
    excelColumnType: 'factory'
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
  rawmaterial: {
    title: '원자재 검색',
    searchFilter: ['원자재 CODE', '원자재 품명', '재질', '거래처'],
    excelColumnType: 'rawmaterial'
  },
  submaterial: {
    title: '부자재 검색',
    searchFilter: ['부자재 CODE', '부자재 품명', '거래처'],
    excelColumnType: 'submaterial'
  },
  mold: {
    title: '금형 검색',
    searchFilter: ['CODE', '금형명'],
    excelColumnType: 'mold'
  },
  machine: {
    title: '기계 검색',
    searchFilter: ['제조 번호', '기게 이름', '기계 종류', '톤 수', '공장명'],
    excelColumnType: 'machine'
  },
  device: {
    title: '주변장치 검색',
    searchFilter: ['제조 번호', '기게 이름', '기계 종류', '톤 수', '공장명'],
    excelColumnType: 'device'
  },
  product: {
    title: '제품 검색',
    searchFilter: ['거래처', '모델', 'CODE', '품명'],
    excelColumnType: 'product',
    placeholder: 'CODE 검색'
  },
  order: {
    title: '수주 검색',
    searchFilter: ['수주 번호', '거래처', '모델', 'CODE', '품명'],
    excelColumnType: 'order',
    placeholder: '수주번호입력'
  },
}

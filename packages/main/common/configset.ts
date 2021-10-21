// 토큰 세션 저장소 이름
export const TOKEN_NAME: string = 'sizl_mes_auth';

export const MAX_VALUE: number = 100000000

// B2B 모델 UI 확장을 위한 컴퍼니 정보 제어 변수
export const SERVICE_TITLE: string = 'Mes System' as const
export const SYSTEM_NAME: string = 'Mes System' as const
export const COMPANY_LOGO: string = 'Mes System' as const
export const COMPANY_NAME: string = 'Mes System' as const

//스타일 커스텀을 위한 변수
export const MAX_WIDTH: string = '1040px' as const
export const POINT_COLOR: string = '#19B9DF' as const
export const BG_COLOR: string = '#161619' as const
export const BG_COLOR_SUB: string = '#2a2d34' as const
export const BG_COLOR_SUB2: string = 'rgba(42,45,52,0)' as const
export const BUTTON_TEXT_COLOR: string = '#ffffff' as const
export const BG_COLOR_SUB3: string = '#353b48' as const
export const POINT_COLOR_3: string = '#e7e9eb' as const

export const SF_ADDRESS = "3.35.51.217"
// export const SF_ADDRESS = "211.208.115.66"

export const isLocalhost = () => {
  //@ts-ignore
  if (SF_ADDRESS === 'localhost') {
    return 'localhost'
  } else {
    return SF_ADDRESS
  }
}

// export const SF_ENDPOINT = `http://${isLocalhost()}:9913`
export const SF_ENDPOINT = `http://${isLocalhost()}:8299`
export const SF_ENDPOINT_EXCEL = `http://${isLocalhost()}:8399`
export const SF_ENDPOINT_ADMIN = `http://${isLocalhost()}:8286/api`
export const SF_ENDPOINT_FILE = `http://${isLocalhost()}:8099`
export const SF_ENDPOINT_RESOURCE = `http://${isLocalhost()}:8285`
export const SF_PORT = ``

export const AUTHORITY_LIST = [
  { title: "HOME", show: false, checkable: true, check: false, child: [
      { title: "HOME", show: false, checkable: true, check: false, child: [], value: "ROLE_HOME" },
    ], },
  { title: "기준정보 관리", show: false, checkable: true, check: false, child: [
      { title: "사용자 권한 관리", show: false, checkable: true, check: false, child: [
          { title: "유저 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_HR_01" },
          { title: "권한 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_HR_02" },
        ] },
      { title: "공장 기본정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_11"},
      { title: "거래처 관리", show: false, checkable: true, check: false, child: [
          { title: "거래처 정보 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_01" },
          { title: "모델 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_08" },
        ]},
      { title: "공정 관리", show: false, checkable: true, check: false, child: [
          { title: "공정 종류 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_02" },
          { title: "공정 일시정지 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_09" },
        ]},
      { title: "품질 기본정보", show: false, checkable: true, check: false, child: [
          { title: "공정별 불량 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_03" },
        ]},
      { title: "주변장치 기본정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_12" },
      { title: "기계 기본 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_04" },
      { title: "금형 기본 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_07" },
      { title: "원자재 기본 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_06" },
      { title: "원자재 기본 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_13" },
      { title: "제품 등록 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_05" },
    ] },
  {
    title: "MES", show: false, checkable: false,
    child: [
      { title: "영업 관리", show: false, checkable: true, check: false, child: [
          { title: "수주 정보 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_SALES_01" },
          { title: "수주 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_SALES_02" },
          { title: "납품 정보 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_SALES_03" },
          { title: "납품 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_SALES_04" },
        ] },
      { title: "생산 관리", show: false, checkable: true, check: false, child: [
          { title: "작업지시서 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_PROD_01" },
          { title: "작업지시서 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PROD_02" },
          { title: "작업일보 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PROD_04" },
          { title: "작업완료 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PROD_06" },
        ] },
      { title: "원자재 관리", show: false, checkable: true, check: false, child: [
          { title: "원자재 입고 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_RMAT_01" },
          { title: "원자재 재고 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_RMAT_02" },
        ] },
      { title: "부자재 관리", show: false, checkable: true, check: false, child: [
          { title: "부자재 입고 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_WIP_01" },
          { title: "부자재 재고 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_WIP_02" },
        ] },
      { title: "품질 관리", show: false, checkable: true, check: false, child: [
          { title: "불량 통계", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_01" },
        ] },
      { title: "재고 관리", show: false, checkable: true, check: false, child: [
          { title: "재고 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_STK_01" },
          { title: "생산/납품 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_STK_02" },
          { title: "생산/납품 현황(관리자용)", show: false, checkable: true, check: false, child: [], value: "ROLE_STK_03" },
        ] },
      // { title: "납품 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_SHPT_01" },
      // { title: "KPI",     show: false, checkable: true, check: false, child: [
      //     { title: "생산지수(P)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_01" },
      //     { title: "품질지수(Q)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_02" },
      //     { title: "원가지수(C)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_03" },
      //     { title: "납기지수(D)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_04" },
      //     { title: "에너지지수(E)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_05" },
      //   ] },
    ]
  },
  { title: "PMS", show: false, checkable: false,
    child: [
      { title: "프레스 모니터링", show: false, checkable: true, check: false, child: [
          { title: "프레스 상태 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_MON_01" },
          { title: "프레스 로드 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_MON_02" },
          { title: "프레스 전력 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_MON_03" },
        ] },
      { title: "프레스 보전 관리", show: false, checkable: true, check: false, child: [
          { title: "금형수명주기", show: false, checkable: true, check: false, child: [], value: "ROLE_PRSVN_01" },
          { title: "클러치&브레이크", show: false, checkable: true, check: false, child: [], value: "ROLE_PRSVN_02" },
          { title: "오일 교환 및 보충", show: false, checkable: true, check: false, child: [], value: "ROLE_PRSVN_03" },
          { title: "오버통", show: false, checkable: true, check: false, child: [], value: "ROLE_PRSVN_04" },
        ] },
      { title: "프레스 데이터 분석", show: false, checkable: true, check: false, child: [
          { title: "생산량", show: false, checkable: true, check: false, child: [], value: "ROLE_ANSYS_01" },
          { title: "능력", show: false, checkable: true, check: false, child: [], value: "ROLE_ANSYS_02" },
          { title: "비가동시간", show: false, checkable: true, check: false, child: [], value: "ROLE_ANSYS_03" },
          { title: "불량공정", show: false, checkable: true, check: false, child: [], value: "ROLE_ANSYS_04" },
        ] },
      { title: "프레스 데이터 통계", show: false, checkable: true, check: false, child: [
          { title: "오일공급", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_01" },
          { title: "비가동시간", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_02" },
          { title: "전력", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_03" },
          { title: "로드톤", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_04" },
          { title: "능력", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_05" },
          { title: "에러", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_06" },
          { title: "불량률", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_07" },
          { title: "제품별 톤", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_08" },
          { title: "금형 타발 수", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_09" },
        ] },
    ]
  },
  // {
  //   title: "Setting", show: false, checkable: false,
  //   child: [
  //     { title: "공지사항", show: false, checkable: true, check: false, child: [], value: "ROLE_SET_01" },
  //     { title: "버전관리", show: false, checkable: true, check: false, child: [], value: "ROLE_SET_02" },
  //     { title: "Q&A", show: false, checkable: true, check: false, child: [], value: "ROLE_SET_03" },
  //     { title: "사용 설명서", show: false, checkable: true, check: false, child: [], value: "ROLE_SET_04" },
  //   ]
  // }
]

const MACHINE_CODE = [
  {code: 1, name: '프레스',},
  {code: 2, name: '로봇'},
  {code: 3, name: '용접기'},
  {code: 4, name: '밀링'},
  {code: 5, name: '선반'},
  {code: 6, name: '탭핑기'},
  {code: 0, name: '기타(분류없음)'},
]

export const changeCodeInfo = (type: string, code: number) => {
  let tmpData = {code: -1, name: ''}

  if(type === 'machine'){
    MACHINE_CODE.forEach((v: { code: number, name: string }, i) => {
      if(v.code === code){
        tmpData = v
      }
    })
  }
  return tmpData
}

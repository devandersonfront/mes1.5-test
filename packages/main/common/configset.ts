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

// export const SF_ADDRESS = "3.37.196.98"
export const SF_ADDRESS = "3.36.78.194"

export const isLocalhost = () => {
  //@ts-ignore
  if (SF_ADDRESS === 'localhost') {
    return 'localhost'
  } else {
    return SF_ADDRESS
  }
}

// export const SF_ENDPOINT = `http://${isLocalhost()}:9913`
// export const SF_ENDPOINT = `http://${isLocalhost()}:8299`
export const SF_ENDPOINT = `http://${isLocalhost()}:8443`
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
          { title: "권한 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_HR_01" },
          { title: "유저 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_HR_02" },
        ] },
      { title: "공장 기준정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_11"},
      { title: "거래처 관리", show: false, checkable: true, check: false, child: [
          { title: "거래처 정보 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_01" },
          { title: "모델 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_08" },
        ]},
      { title: "공정 관리", show: false, checkable: true, check: false, child: [
          { title: "공정 종류 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_02" },
          { title: "공정 일시정지 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_09" },
        ]},
      { title: "품질 기준정보", show: false, checkable: true, check: false, child: [
          { title: "공정별 불량유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_03" },
        ]},
      { title: "주변장치 기준정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_12" },
      { title: "기계 기준 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_04" },
      { title: "금형 기준 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_07" },
      { title: "공구 기준 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_14" },
      { title: "원자재 기준 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_06" },
      { title: "부자재 기준 정보", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_13" },
      { title: "제품 등록 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_15" },
      { title: "표준 문서 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_BASE_16" },
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
          { title: "작업일보 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PROD_08" },
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

      { title: "공구 관리", show: false, checkable: true, check: false, child: [
          { title: "공구 입고 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_TOOL_01" },
          { title: "공구 입고 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_TOOL_03" },
          { title: "공구 재고 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_TOOL_02" },
      ] },

      { title: "품질 관리", show: false, checkable: true, check: false, child: [
          { title: "불량 통계 (자주검사 관리)", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_01" },
          { title: "초중종 검사 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_02" },
          { title: "작업 표준서 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_03" },
          { title: "제품 변경점 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_04" },
          { title: "제품 변경점 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_QA_05" },
        ] },
      { title: "재고 관리", show: false, checkable: true, check: false, child: [
          { title: "재고 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_STK_01" },
          { title: "생산/납품 현황", show: false, checkable: true, check: false, child: [], value: "ROLE_STK_02" },
        ] },
      { title: "KPI",     show: false, checkable: true, check: false, child: [
          { title: "생산지수(P)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_01" },
          { title: "품질지수(Q)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_02" },
          { title: "원가지수(C)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_03" },
          { title: "납기지수(D)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_04" },
          { title: "에너지지수(E)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_05" },
          { title: "UPH(P)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_06" },
          { title: "설비 가동률(P)", show: false, checkable: true, check: false, child: [], value: "ROLE_KPI_07" },
        ]},
    ]
  },

  { title: "PMS", show: false, checkable: false,
  child: [
    { title: "프레스 모니터링", show: false, checkable: true, check: false, child: [
        { title: "프레스 분석 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_MON_01" },
        { title: "프레스 현황 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_MON_02" },
      ] },
    { title: "프레스 통계 및 분석", show: false, checkable: true, check: false, child: [
        { title: "생산량", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_01" },
        { title: "능력", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_02" },
        { title: "에러", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_03" },
        { title: "전력", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_04" },
        { title: "기계 비가동 시간", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_05" },
        { title: "작업시간", show: false, checkable: true, check: false, child: [], value: "ROLE_STAT_06" },
      ] },
    { title: "프레스 관리", show: false, checkable: true, check: false, child: [
        { title: "에러 보기", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_01" },
        { title: "파라미터 보기", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_02" },
        { title: "캠 보기", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_03" },
        { title: "클러치&브레이크", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_04" },
        { title: "설비 수리 요청 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_05" },
        { title: "설비 수리 요청 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_06" },
        { title: "설비 수리 완료 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_07" },
        { title: "설비 수리 완료 리스트(관리자용)", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_08" },
        { title: "설비 문제 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_09" },
        { title: "프레스 일상점검 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_10" },
        { title: "프레스 일상점검 일일현황", show: false, checkable: true, check: false, child: [], value: "ROLE_PMNGT_11" },
      ] },
    { title: "금형 관리", show: false, checkable: true, check: false, child: [
        { title: "금형 타수 관리", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_01" },
        { title: "금형 수리 요청 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_02" },
        { title: "금형 수리 요청 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_03" },
        { title: "금형 수리 완료 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_04" },
        { title: "금형 수리 완료 리스트(관리자용)", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_05" },
        { title: "금형 문제 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_06" },
        { title: "금형 일상점검 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_07" },
        { title: "금형 일상점검 일일현황", show: false, checkable: true, check: false, child: [], value: "ROLE_MMNGT_08" },
      ] },
  ]
},

  // { title: "CNC", show: false, checkable: false,
  //   child: [
  //     { title: "설비 모니터링", show: false, checkable: true, check: false, child: [
  //         { title: " CNC 설비 모니터링", show: false, checkable: true, check: false, child: [], value: "ROLE_CMON_01" },
  //       ] },
  //     { title: "프레스 통계 및 분석", show: false, checkable: true, check: false, child: [
  //         { title: "생산량", show: false, checkable: true, check: false, child: [], value: "ROLE_CSTAT_01" },
  //         { title: "에러", show: false, checkable: true, check: false, child: [], value: "ROLE_CSTAT_03" },
  //         { title: "기계 비가동 시간", show: false, checkable: true, check: false, child: [], value: "ROLE_CSTAT_05" },
  //       ] },
  //     { title: "CNC 관리", show: false, checkable: true, check: false, child: [
  //         { title: "설비 수리 요청 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_CMNGT_05" },
  //         { title: "설비 수리 요청 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_CMNGT_06" },
  //         { title: "설비 수리 완료 리스트", show: false, checkable: true, check: false, child: [], value: "ROLE_CMNGT_07" },
  //         { title: "설비 수리 완료 리스트(관리자용)", show: false, checkable: true, check: false, child: [], value: "ROLE_CMNGT_08" },
  //         { title: "설비 문제 유형 등록", show: false, checkable: true, check: false, child: [], value: "ROLE_CMNGT_09" },

  //       ] },
  //   ]
  // },

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

    if (type === 'machine') {
        MACHINE_CODE.forEach((v: { code: number, name: string }, i) => {
            if (v.code === code) {
                tmpData = v
            }
        })
    }
    return tmpData
}
// 토큰 세션 저장소 이름
import { IMenu, MENUS, menuSelect } from './menulist'

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

export const SF_ADDRESS = process.env.NEXT_PUBLIC_SF_ADDRESS
let hostname
if (typeof window !== 'undefined') {
    hostname = window.location.hostname;
}

export const isLocalhost = () => {
  //@ts-ignore
  if (SF_ADDRESS === 'localhost') {
    return 'localhost'
  } else {
    return SF_ADDRESS
  }
}

export const SF_ENDPOINT = `http://${isLocalhost()}:8443`
export const SF_ENDPOINT_EXCEL = `http://${process.env.NEXT_PUBLIC_SF_ENDPOINT_EXCEL}:8399`
export const SF_ENDPOINT_ADMIN = `http://${isLocalhost()}:8286/api`
export const SF_ENDPOINT_FILE = `http://${isLocalhost()}:8099`
export const SF_ENDPOINT_RESOURCE = `http://${isLocalhost()}:8285`
export const SF_ENDPOINT_S3 = process.env.NEXT_PUBLIC_SF_ENDPOINT_S3
export const SF_PORT = ``

// export const SF_ENDPOINT_BARCODE = `http://${isLocalhost()}:18080`

export const SF_ENDPOINT_PMS = `http://${process.env.NEXT_PUBLIC_SF_ENDPOINT_PMS}:${process.env.NEXT_PUBLIC_SF_ENDPOINT_PMS_PORT}`
//  export const SF_ENDPOINT_PMS = `http://3.36.78.194:8999`
// export const SF_ENDPOINT_PMS = `http://125.138.147.11:8444`

const MACHINE_CODE = [
  {code: 1, name: '프레스'},
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

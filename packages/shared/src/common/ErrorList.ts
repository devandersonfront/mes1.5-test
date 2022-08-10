type ErrorType = {
    errorNum : number
    message : string
}

// 403 -> 권한 , 400 -> bad Request
function ErrorList(error : Readonly<ErrorType>) : string[] {

    switch(error.errorNum){
        case 403 :
            return ['권한 에러', error.message === "" ?  '올바르지 않은 권한 입니다.' : error.message ]
        case 400 :
            return ['에러', error.message ?? '요청을 잘못 하셨습니다. 관리자에게 문의해주세요']
        default :
            return ['에러','관리자에게 문의해 주시기 바랍니다.']
    }
}

export default ErrorList


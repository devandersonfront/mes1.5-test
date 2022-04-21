import Notiflix from "notiflix";

export const NoAmountValidation = (key: string, array: any[], message?: string): boolean => {
  const noAmount = array.every(value => !!!value[key] || Number(value[key]) === 0 )
  if(noAmount) Notiflix.Report.warning(message?? '수량을 입력해 주세요.','','확인')
  return noAmount
}

export const NoneSelectedValidation = (array: any[], message?: string): boolean => {
  const noneSelected = array.length === 0
  if(noneSelected) Notiflix.Report.warning("경고", message?? "데이터를 선택해 주시기 바랍니다.", "확인",)
  return noneSelected
}

export const OverAmountValidation = (moreKey: string, lessKey: string,  array: any[], message?: string): boolean => {
  const overAmount = array.some(value => value[lessKey] > value[moreKey] )
  if(overAmount) Notiflix.Report.warning(message?? '입력한 수량이 기준보다 많습니다.','','확인')
  return overAmount
}

export const RequiredValidation = (key: string, array: any[], message?: string): boolean => {
  const noRequired = array.some(value => !!!value[key])
  if(noRequired) Notiflix.Report.warning(message?? '필수 데이터를 입력해 주세요.','','확인')
  return noRequired
}

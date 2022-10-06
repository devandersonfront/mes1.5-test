import React, {useEffect} from 'react';
import styled from 'styled-components'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {FormControl, makeStyles, Select} from '@material-ui/core'
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles'
import {POINT_COLOR} from '../../common/configset'
import 'react-calendar/dist/Calendar.css'
//@ts-ignore
import Calendar_icon from "../../../public/images/calendar_icon_black.png";
import {MonthSelectCalendar} from "./MonthSelectCalendar";
import {PeriodSelectCalendar} from "./PeriodSelectCalendar";
//@ts-ignore
import IcSearchButton from '../../../public/images/btn_radio_check.png'
import {CurrentDate} from "./CurrentDate";

interface SelectParameter {
  from:string
  to:string
}

//웰컴, 로그인 페이지 네비게이션 컴포넌트
interface IProps {
  title: string
  pageHelper?: string
  selectDate?:string | SelectParameter
  setSelectDate?:(value:SelectParameter | string) => void
  buttons?: string[]
  buttonsOnclick?: (buttonIndex: number) => void
  isSearch?: boolean
  style?: any
  searchOptionList?: string[]
  onChangeSearchOption?: (option: number) => void
  isCalendar?:boolean
  calendarType?:"day" | "month" | "period" | 'current'
  onChangeSelectDate?:(from:string, to:string) => void
  setState?:(value:"local" | "select") => void
  optionIndex?: number
  dataLimit?:boolean
  calendarTitle?: string
  isNz?: boolean
  onChangeNz?: (nz:boolean) => void
  nz?: boolean
  isExp?: boolean
  onChangeExp?: (exp:boolean) => void
  exp?: boolean
  isCode?: boolean
  onChangeCode?: (code:boolean) => void
  code?: boolean
  isRadio?:boolean
  radioTexts?:string[]
  radioValue?:number
  radioButtons?: string[],
  onChangeRadioIndex?: (index:number) => void
  radioIndex?: number
  onChangeRadioValues?:(radioValues:number) => void
  onSearch?:(keyword:string) => void
  searchKeyword?: string
  noCode?: boolean
}


const useStyles2 = makeStyles(_ => {
  return {
    quantityRoot: {
      backgroundColor: "white",

      width: '120px',
      height: '32px',
      borderRadius: 6,

      "& .MuiSelect-root": {
        // padding: "6.5px 10px" ,
        width: "92px",
        height: '100%',
        display: 'flex',
        fontSize: '15px',
        overflow: 'hidden',
        textOverflow: 'ellipse',
        justifyContent: 'center',
      },
      "& .MuiOutlinedInput-notchedOutline": {
        border: "none"
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        border: "none"
      },
      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
        border: "none",
      },
      "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
        border: "none"
      }
    },
    selectRoot: {
      color: "#000"
    },
    icon: {
      color: "black"
    },
  }
});

const Header = ({title, pageHelper, selectDate, setSelectDate, buttons, buttonsOnclick, isSearch, style,
                  searchOptionList, onChangeSearchOption, isCalendar, onChangeSelectDate,
                  calendarType, setState, optionIndex, dataLimit, calendarTitle, isNz, onChangeNz, nz,isExp,onChangeExp, exp, isCode, onChangeCode, code,
                  isRadio, radioTexts, radioValue, onChangeRadioValues, onSearch, searchKeyword, noCode, radioButtons, onChangeRadioIndex, radioIndex}: IProps) => {

  const [keyword, setKeyword] = React.useState<string>()

  useEffect(() => {
    setKeyword(searchKeyword)
  }, [searchKeyword])

  const classes2 = useStyles2();

 // const onSearchEvent = () => {
 //   onSearch && onSearch(keyword)
 // }

  const selectCalendarType = (value:string) => {
    switch (value){
      case "month":
        return (
            <MonthSelectCalendar calendarTitle={calendarTitle} selectDate={selectDate as string} setSelectDate={setSelectDate} onChangeSelectDate={onChangeSelectDate} setState={setState} dataLimit={dataLimit}/>
        )
      case "day":
        return (
            <MonthSelectCalendar calendarTitle={calendarTitle} selectDate={selectDate as string} setSelectDate={setSelectDate} onChangeSelectDate={onChangeSelectDate} setState={setState} dataLimit={dataLimit}/>
        )
      case "period":
        return (
            <PeriodSelectCalendar selectDate={selectDate as SelectParameter} onChangeSelectDate={setSelectDate} dataLimit={dataLimit} />
        )
      case "current" :
        return (
            <CurrentDate/>
        )
      default:
        return
    }
  }


  const radioButtonStyle = (button:string, index:number) => (
    <>
      <input id={`radio_${index}`} name={`radio`}  type={'radio'} style={{display: 'none'}} onClick={() => {
        onChangeRadioIndex && onChangeRadioIndex(index)
      }}/>
      <label htmlFor={`radio_${index}`}>
        <div style={{display:"flex", alignItems:"center",}}>
          {
            radioIndex === index
              ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}/>
              : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}/>
          }

          <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>{button}</p>
        </div>
      </label>
    </>
  )

  return (
      <div>
        <div style={{position: 'relative', textAlign: 'left',}}>
          <div className={'header'} style={{display: 'flex', textAlign: 'left', marginBottom: 23, justifyContent: 'space-between', ...style}}>
            <div style={{width: '100%',display: 'flex', justifyContent:"space-between"}}>
              <div className={'header_title'} style={{marginTop:20}}>
                {
                    title && <span style={{fontSize: 22, marginRight: 18, marginLeft: 3, fontWeight: 'bold', color: 'white'}}>{title}</span>
                }
                {
                    pageHelper && <span style={{fontSize: 12, color: 'white'}}>*{pageHelper}</span>
                }
              </div>
              <ButtonWrapper style={{  marginTop: 20}}>
                {
                    isCalendar &&
                    selectCalendarType(calendarType)
                }
                <ButtonWrapper className={'buttonWrapper unprintable'}>
                {
                    isSearch &&
                    <div style={{display:"flex",width:searchOptionList? "448px" : "280px", alignItems:"center", borderRadius: 6, backgroundColor: 'white', marginLeft: 16}}>
                      {
                          searchOptionList &&
                          <div style={{
                            width: 160, display: 'flex', justifyContent: 'center', alignItems: 'center',
                            backgroundColor: POINT_COLOR, borderRadius: 6,
                          }}>
                            <select
                                defaultValue={optionIndex}
                                onChange={(e) => {
                                  onChangeSearchOption && onChangeSearchOption(Number(e.target.value))
                                }}
                                style={{
                                  color: 'black',
                                  backgroundColor: '#00000000',
                                  border: 0,
                                  height: 32,
                                  width: 155,
                                  cursor:'pointer'
                                }}
                            >
                              {
                                searchOptionList.map((v, i) => {
                                  if(v){
                                    return <option key={i.toString()} value={i}>{v}</option>
                                  }
                                })
                              }
                            </select>
                          </div>
                      }
                      <input
                          value={keyword ?? ""}
                          type={"text"}
                          placeholder="검색어를 2글자 이상 입력해주세요."
                          onChange={(e) => {
                            setKeyword(e.target.value)
                          }}
                          onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                              onSearch && onSearch(keyword)
                            }
                          }}
                          style={{width:"256px", height:"30px", borderRadius: '6px', paddingLeft:"10px", border:"none", backgroundColor: 'rgba(0,0,0,0)'}}
                      />
                      <div
                          style={{background:"#19b9df", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"6px", cursor:'pointer'}}
                          onClick={() => onSearch && onSearch(keyword)}
                      >
                        <img src={Search_icon} style={{width:"16.3px",height:"16.3px"}} />
                      </div>
                    </div>
                }
                {
                    buttons && buttons.map((buttonTitle, buttonIndex) => {
                      if(buttonTitle){
                        return <HeaderButton onClick={() => buttonsOnclick && buttonsOnclick(buttonIndex)} key={`btn${buttonIndex}`}>{buttonTitle}</HeaderButton>
                      }
                    })
                }
                </ButtonWrapper>
              </ButtonWrapper>
            </div>
          </div>
          <div className={'unprintable'} style={{display:"flex", justifyContent:"right", marginBottom:"10px"}}>
              {
                radioButtons && radioButtons.map((btn, btnIdx) => {
                    if(Array.isArray(btn)){
                      btn.map((arrBtn, arrBtnIdx) => {
                        return (radioButtonStyle(arrBtn, arrBtnIdx + (btnIdx * btn.length) ))
                      })
                    } else {
                      return (radioButtonStyle(btn, btnIdx))
                    }

                  })
              }
            {
                isRadio &&
                radioTexts.map((text, index) =>
                    <>
                      <input id={`radio_${index}`} name={`radio`}  type={'radio'} style={{display: 'none'}} onClick={() => {
                        onChangeRadioValues && onChangeRadioValues(index)
                      }}/>
                      <label htmlFor={`radio_${index}`}>
                        <div style={{display:"flex", alignItems:"center",}}>
                          {
                            radioValue === index
                                ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}/>
                                : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}/>
                          }

                          <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>{radioTexts[index]}</p>
                        </div>
                      </label>
                    </>
                )
            }
            {
                isCode && <div  className={'unprintable'} style={{display:"flex", alignItems:"center", borderRadius: 6, marginRight: 8 }}>
                {
                  !noCode && <>
                      <input id='codeTrue' name={'code'} type={'radio'} style={{ display: 'none' }} onClick={() => {
                      onChangeCode && onChangeCode(true)
                    }}/>
                    <label htmlFor="codeTrue">
                    <div style={{display:"flex", alignItems:"center",}}>
                    {
                      code
                      ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}/>
                      : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}/>
                    }

                    <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>CODE로 등록</p>
                    </div>
                    </label>
                  </>
                }
                  <input id='codeFalse' name={'code'} type={'radio'} style={{display: 'none'}} onClick={() => {
                    onChangeCode && onChangeCode(false)
                  }}/>
                  <label htmlFor="codeFalse">
                    <div style={{display:"flex", alignItems:"center",}}>
                      {
                        !code
                            ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}/>
                            : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}/>
                      }

                      <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>수주번호로 등록</p>
                    </div>
                  </label>
                </div>
            }
            {
                isExp && <div style={{display:"flex", alignItems:"center", borderRadius: 6, marginRight: 30 }}>
                  <input id='expTrue' name={'exp'} type={'radio'} style={{display: 'none'}} onClick={() => {
                    onChangeExp && onChangeExp(true)
                  }}/>
                  <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12,marginRight: 15}}>사용 기준일</p>
                  <label htmlFor="expTrue">
                    <div style={{display:"flex", alignItems:"center",}}>
                      <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>초과</p>
                      {
                        exp
                            ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}></div>
                            : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}></div>
                      }
                    </div>
                  </label>
                  <input id='expFalse' name={'exp'} type={'radio'} style={{display: 'none'}} onClick={() => {
                    onChangeExp && onChangeExp(false)
                  }}/>
                  <label htmlFor="expFalse">
                    <div style={{display:"flex", alignItems:"center",}}>
                      <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>전체</p>
                      {
                        !exp
                            ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}></div>
                            : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}></div>
                      }
                    </div>
                  </label>
                </div>
            }
            {
                isNz && <div style={{display:"flex", alignItems:"center", borderRadius: 6, marginRight: 8 }}>
                  <input id='nzTrue' name={'nz'} type={'radio'} style={{display: 'none'}} onClick={() => {
                    onChangeNz && onChangeNz(true)
                  }}/>
                  <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12,marginRight: 15}}>사용 완료</p>
                  <label htmlFor="nzTrue">
                    <div style={{display:"flex", alignItems:"center",}}>
                      <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>숨김</p>
                      {
                        nz
                            ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}></div>
                            : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}></div>
                      }
                    </div>
                  </label>
                  <input id='nzFalse' name={'nz'} type={'radio'} style={{display: 'none'}} onClick={() => {
                    onChangeNz && onChangeNz(false)
                  }}/>
                  <p style={{margin: 0, padding: 0, color: 'white', fontSize: 12}}>표시</p>
                  <label htmlFor="nzFalse">
                    <div style={{display:"flex", alignItems:"center",}}>
                      {
                        !nz
                            ? <div style={{width: 16, height: 16, background:`url(${IcSearchButton})`, backgroundSize: 'cover', margin: '0 8px'}}></div>
                            : <div style={{width: 16, height: 16, borderRadius: 8, backgroundColor: 'white', margin: '0 8px'}}></div>
                      }
                    </div>
                  </label>
                </div>
            }
          </div>
        </div>
      </div>
  )
}

const HeaderButton = styled.button`
    height:32px;
    color:white;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    cursor: pointer;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`

export {Header};

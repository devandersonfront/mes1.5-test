import React, {useEffect} from 'react';
import styled from 'styled-components'
//@ts-ignore
import Search_icon from '../public/images/btn_search.png'
import {FormControl, makeStyles, Select} from '@material-ui/core'
import {createTheme, MuiThemeProvider} from '@material-ui/core/styles'
import {POINT_COLOR} from "../common/configset";


//웰컴, 로그인 페이지 네비게이션 컴포넌트
interface IProps {
    buttons?: string[]
    leftButton?: string[]
    typeList?: string[]
    buttonsOnclick?: (buttonIndex: number) => void
    isSearch?: boolean
    style?: any
    onClickMenu?: (index: number) => void
    menuIndex?: number
    searchKeyword?: string
    onChangeSearchKeyword?: (keyword: string) => void
    searchOptionList?: string[]
    onChangeSearchOption?: (option: number) => void
    filterList?: { value: string, title: string }[]
    onChangeFilter?: (filter: unknown) => void
    serviceFilterButton?: string[]
    onClickServiceButton?: (service: string) => void
    leftButtonOnClick?:(buttonIndex: number) => void
    typeListOnClick?: (type: string) => void
    basicMachineType?: string
}

const useStyles = makeStyles(_ => {
    return {
        quantityRoot: {
            backgroundColor: "#19B9DF",

            width: '120px',
            height: '32px',
            borderRadius: 6,

            "& .MuiSelect-root": {
                padding: "6.5px 10px" ,
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

const useStyles2 = makeStyles(_ => {
    return {
        quantityRoot: {
            backgroundColor: "white",

            width: '120px',
            height: '32px',
            borderRadius: 6,

            "& .MuiSelect-root": {
                padding: "6.5px 10px" ,
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

const lightTheme = createTheme({
    palette: {
        primary: { main: 'rgba(0,0,0,0)', contrastText: "#000" },
    }
})

const PageHeader = ({buttons, typeList, buttonsOnclick, isSearch, style, leftButton, onClickMenu, menuIndex, searchKeyword, onChangeSearchKeyword, searchOptionList, onChangeSearchOption, filterList, onChangeFilter, serviceFilterButton, onClickServiceButton, leftButtonOnClick, basicMachineType, typeListOnClick}: IProps) => {
    const [keyword, setKeyword] = React.useState<string>()

    useEffect(() => {
        setKeyword(searchKeyword)
    }, [searchKeyword])

    const classes = useStyles();
    const classes2 = useStyles2();



    return (
        // <div style={{paddingRight: 38}}>
        //     <div style={{position: 'relative', textAlign: 'left',}}>
        //         <div style={{display: 'flex', textAlign: 'left', marginBottom: 23, justifyContent: 'space-between', ...style}}>
        //              <div style={{width: '100%', display:"flex",justifyContent:"space-between", height:40}}>
                        <ButtonWrapper style={{}}>
                            {
                                typeList && typeList.map((buttonTitle, buttonIndex) => {
                                    return <HeaderButton
                                        style={{backgroundColor: basicMachineType === buttonTitle ? POINT_COLOR : '#717C90'}}
                                        onClick={() => typeListOnClick && typeListOnClick(buttonTitle)}
                                        key={`btn${buttonIndex}`}>
                                        {buttonTitle}
                                    </HeaderButton>
                                })
                            }
                            {
                                isSearch &&

                                <div style={{display:"flex",justifyContent:"space-between",width:searchOptionList? "400px" : "280px", alignItems:"center", borderRadius: 6, backgroundColor: 'white', marginLeft: 16}}>
                                    {
                                        searchOptionList &&
                                        <MuiThemeProvider theme={lightTheme}>
                                            <FormControl variant="outlined" style={{
                                                borderRadius:"6px", width:112,
                                            }} classes={{
                                                root: classes.quantityRoot,
                                            }}>
                                                <div>
                                                    <Select
                                                        classes={{
                                                            icon: classes.icon
                                                        }}
                                                        native
                                                        defaultValue={searchOptionList[0]}
                                                        onChange={(e) => onChangeSearchOption && onChangeSearchOption(Number(e.target.value))}
                                                        style={{color: 'black',}}
                                                    >
                                                        {
                                                            searchOptionList.map((v, i) => {
                                                                return <option value={i}>{v}</option>
                                                            })
                                                        }
                                                    </Select>
                                                </div>
                                            </FormControl>
                                        </MuiThemeProvider>
                                    }
                                    <input
                                        value={keyword ?? ""}
                                        type={"text"}
                                        placeholder="검색어를 입력해주세요."
                                        onChange={(e) => {setKeyword(e.target.value)}}
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter'){
                                                onChangeSearchKeyword && onChangeSearchKeyword(keyword ?? "")
                                            }
                                        }}
                                        style={{width:"246px", height:"30px", borderRadius: '6px', paddingLeft:"10px", border:"none", backgroundColor: 'rgba(0,0,0,0)'}}
                                    />
                                    <div
                                        style={{background:"#19B9DF", width:"32px",height:"32px",display:"flex",justifyContent:"center",alignItems:"center",borderRadius:"6px"}}
                                        onClick={() => {onChangeSearchKeyword && onChangeSearchKeyword(keyword ?? "")}}
                                    >
                                        <img src={Search_icon } style={{width:"16.3px",height:"16.3px"}} />
                                    </div>
                                </div>
                            }
                            {
                                filterList && <MuiThemeProvider theme={lightTheme}>
                                    <FormControl variant="outlined" style={{
                                        borderRadius:"6px", width:112, marginLeft: 16
                                    }} classes={{
                                        root: classes2.quantityRoot,
                                    }}>
                                        <div>
                                            <Select
                                                classes={{
                                                    icon: classes2.icon
                                                }}
                                                native
                                                defaultValue={filterList[0]}
                                                onChange={(e) => onChangeFilter && onChangeFilter(e.target.value)}
                                                style={{color: 'black'}}
                                            >
                                                {
                                                    filterList.map((v, i) => {
                                                        return <option value={v.value}>{v.title}</option>
                                                    })
                                                }
                                            </Select>
                                        </div>
                                    </FormControl>
                                </MuiThemeProvider>
                            }
                            {
                                leftButton && buttons &&
                                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                                    <div style={{ display: 'flex'}}>
                                        {
                                            leftButton.map((buttonTitle, buttonIndex) => {
                                                return <HeaderButton
                                                    style={{ marginLeft: 0, marginRight: 16 }}
                                                    onClick={() => leftButtonOnClick && leftButtonOnClick(buttonIndex)} key={`btn${buttonIndex}`}>{buttonTitle}</HeaderButton>
                                            })
                                        }
                                    </div>
                                    <div style={{display: 'flex'}}>
                                        {
                                            buttons.map((buttonTitle, buttonIndex) => {
                                                if(buttonTitle){
                                                    return <HeaderButton onClick={() => buttonsOnclick && buttonsOnclick(buttonIndex)} key={`btn${buttonIndex}`}>{buttonTitle}</HeaderButton>
                                                }
                                            })
                                        }
                                    </div>
                                </div>
                            }

                            {
                                !leftButton && buttons && buttons.map((buttonTitle, buttonIndex) => {
                                    if(buttonTitle) {
                                        return <HeaderButton
                                          onClick={() => buttonsOnclick && buttonsOnclick(buttonIndex)}
                                          key={`btn${buttonIndex}`}>{buttonTitle}</HeaderButton>
                                    }
                                })
                            }
                        </ButtonWrapper>
         //              </div>
         //         </div>
         //     </div>
         // </div>
    )
}

const HeaderButton = styled.button`
    height:32px;
    border-radius:6px;
    color:white;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;

const ButtonWrapper = styled.div` 
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  height:32px;
`

export default PageHeader;

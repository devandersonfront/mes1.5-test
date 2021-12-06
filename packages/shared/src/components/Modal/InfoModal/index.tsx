import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../../public/images/ic_x.png'
import {ExcelTable} from '../../Excel/ExcelTable'
import {searchModalList} from '../../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../../public/images/btn_search.png'
import {RequestMethod} from '../../../common/RequestFunctions'
import {PaginationComponent}from '../../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {UploadButton} from '../../../styles/styledComponents'
import {useDispatch, useSelector} from 'react-redux'
import {insert_summary_info} from '../../../reducer/infoModal'
import {RootState} from '../../../../../main/reducer'
import {SearchInit} from '../SearchModalTest/SearchModalInit'
import {InfoInit, InfoInitType, SummaryInfoInit} from './InfoModalInit'
import {SearchModalResult, SearchResultSort} from '../../../Functions/SearchResultSort'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const InfoModal = ({column, row, onRowChange}: IProps) => {
  const dispatch = useDispatch()
  const tabRef = useRef(null)

  const [bomDummy, setBomDummy] = useState<any[]>([
    {code: 'SU-20210701-1', name: 'SU900-1', material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},
  ])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [infoModalInit, setInfoModalInit] = useState<InfoInitType>()
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')

  const [focusIndex, setFocusIndex] = useState<number>(0)

  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  const selector = useSelector((state:RootState) => state.infoModal)

  useEffect(() => {
    if(column.type){
      setInfoModalInit(InfoInit[column.type])
      if(isOpen){
        console.log(row, column.key)

        // setSearchList([...SearchResultSort(row[column.summaryType], column.)])
      }
    }
  }, [column.type, isOpen])

  useEffect(() => {
    if(isOpen){
      dispatch(insert_summary_info({
        index: selector.index,
        data: row
      }))
    }
  }, [row, isOpen])

  useEffect(()=>{
    console.log("왜 4번?", row)
    loadData(column.summaryType);
  },[])

  const deleteTab = (index: number) => {
    if(bomDummy.length - 1 === focusIndex){
      setFocusIndex(focusIndex-1)
    }
    if(bomDummy.length === 1) {
      return setIsOpen(false)
    }

    let tmp = bomDummy
    tmp.splice(index, 1)
    setBomDummy([...tmp])
  }


  const addNewTab = (index: number) => {
    let tmp = bomDummy
    tmp.push({code: 'SU-20210701-'+index, name: 'SU900-'+index, material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},)
    setBomDummy([...tmp])
  }

  const saveSubFactory = async() => {
    //여기서 factoryRegister / deviceRegister / bomRegister를 가지고 저장을 나눈다.
    console.log("row : ", row, "searchList : ", searchList)
    const result = [];
    searchList.map((e, index)=>{
      let sub:any = {};
      sub.factory_id = row.factory_id;
      sub.seq = e.seq;
      sub.name = e.segmentName;
      sub.manager = {...searchList[index], user_id:searchList[index].user_idPK, authority: searchList[index].authorityPK};
      sub.description = e.description;
      result.push(sub);
    })

    console.log("result : ", result);
    await RequestMethod("post", "subFactorySave",result)
        .then((res) => {
          console.log(res)
        })
        .catch((err)=>{
          console.log(err)
        })

  }

  const loadData = (value:string) => {
    //여기서 무슨 정보의 모달인지 구분 후 데이터를 가져온다. || summaryType이 아닐수도 있음
    console.log(value)
  }

  const getSummaryInfo = (info) => {
    // selector.data[selector.index][info.key]
    console.log(selector.data)
    return '-'
  }

  const ModalContents = () => {
    if(infoModalInit){
      if(infoModalInit.readonly || row[column.key]){
        return <>
          <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%'
          }}>
            <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
              setIsOpen(true)
            }}>
              <p style={{color: 'white', textDecoration: 'underline'}}>{infoModalInit.existText}</p>
            </UploadButton>
          </div>
        </>
      }else{
        return <>
          <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%'
          }}>
            <UploadButton onClick={() => {
              setIsOpen(true)
            }}>
              <p>{infoModalInit.buttonText}</p>
            </UploadButton>
          </div>
        </>
      }
    }
  }

  const rightExcelData = (menuItem: any) => {
    if(!menuItem){
      return
    }
    switch(menuItem.type) {
      case 'excelEventButtons':
        return (
          <div style={{display: 'flex', marginBottom: 8, marginRight: 56}}>
             <Button onClick={() => {
               let tmp = searchList

               setSearchList([
                 ...searchList,
                 {
                   seq: searchList.length + 1
                 }
               ])
             }}>
                 <p>행 추가</p>
             </Button>
             <Button style={{marginLeft: 16}} onClick={() => {
               if (selectRow === 0) {
                 return
               }
               let tmpRow = searchList

               let tmp = tmpRow[selectRow]
               tmpRow[selectRow] = tmpRow[selectRow - 1]
               tmpRow[selectRow - 1] = tmp

               setSearchList([...tmpRow.map((v, i) => {
                 return {
                   ...v,
                   seq: i + 1
                 }
               })])
             }}>
                 <p>위로</p>
             </Button>
             <Button style={{marginLeft: 16}} onClick={() => {
               if (selectRow === searchList.length - 1) {
                 return
               }
               let tmpRow = searchList

               let tmp = tmpRow[selectRow]
               tmpRow[selectRow] = tmpRow[selectRow + 1]
               tmpRow[selectRow + 1] = tmp

               setSearchList([...tmpRow.map((v, i) => {
                 return {
                   ...v,
                   seq: i + 1
                 }
               })])
             }}>
                 <p>아래로</p>
             </Button>
           </div>
        )
    }
  }

  const leftExcelData = (menuItem: any) => {
    if(!menuItem){
      return
    }
    switch(menuItem.type) {
      case 'titleButton':
        return (
          <Button style={{marginLeft: 16, marginBottom: 8, backgroundColor: '#19B9DF', alignSelf: 'space-between'}} onClick={() => {
            let tmp = searchList

            setSearchList([
              ...searchList,
              {
                seq: searchList.length+1
              }
            ])
          }}>
            <p style={{fontWeight: 'bold'}}>{menuItem.title}</p>
          </Button>
        )
      case 'titleTabMenu':
        return(
          <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
            <div style={{ display: 'flex', width: 1200}}>
              {bomDummy.map((v, i) => {
                return <TabBox ref={i === 0 ? tabRef : null} style={ focusIndex === i ? {opacity: 1} : {}}>
                  {
                    tabRef.current && tabRef.current.clientWidth < 63
                      ? focusIndex !== i
                      ? <><p onClick={() => {setFocusIndex(i)}}>{v.code}</p></>
                      : <>
                        <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {
                          deleteTab(i)
                        }}>
                          <img style={{width: 20, height: 20}} src={IcX}/>
                        </div>
                      </>
                      : <>
                        <p onClick={() => {setFocusIndex(i)}}>{v.code}</p>
                        <div style={{cursor: 'pointer', width: 20, height: 20}} onClick={() => {
                          deleteTab(i)
                        }}>
                          <img style={{width: 20, height: 20}} src={IcX}/>
                        </div>
                      </>
                  }
                </TabBox>
              })}
            </div>
          </div>
        )
    }
  }

  return (
    <SearchModalWrapper >
      { ModalContents() }
      <Modal isOpen={isOpen} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          padding: 0
        },
        overlay: {
          background: 'rgba(0,0,0,.6)',
          zIndex: 5
        }
      }}>
        <div style={{
          width: 1776,
          height: 816,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{height: 776}}>
            <div style={{
              margin: '24px 16px 16px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <p style={{
                color: 'black',
                fontSize: 22,
                fontWeight: 'bold',
                margin: 0,
              }}>{infoModalInit && infoModalInit.title}</p>
              <div style={{display: 'flex'}}>
                <Button>
                  <p>엑셀로 받기</p>
                </Button>
                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                  setIsOpen(false)
                }}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            {
              SummaryInfoInit[column.summaryType] && SummaryInfoInit[column.summaryType].map((infos, index) => {
                return (
                  <HeaderTable>
                    {
                      infos.map(info => {
                        return (
                          <>
                            <HeaderTableTitle>
                              <HeaderTableText style={{fontWeight: 'bold'}}>{info.title}</HeaderTableText>
                            </HeaderTableTitle>
                            <HeaderTableTextInput style={{width: info.width ?? '144px'}}>
                              <HeaderTableText>
                                {row[info.key]}
                              </HeaderTableText>
                              {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}
                            </HeaderTableTextInput>
                          </>
                        )
                      })
                    }
                  </HeaderTable>
                )
              })
            }
            <div style={{width: '100%', height: 64, display: 'flex'}}>
              <div style={{width: '50%', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                {infoModalInit && leftExcelData(infoModalInit.leftTopHeader)}
              </div>
              <div style={{width: '50%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                {infoModalInit && rightExcelData(infoModalInit.rightTopHeader)}
              </div>
            </div>

             {/*<div style={{display: 'flex', justifyContent: 'space-between', padding: '24px 48px 0 16px'}}>*/}
             {/*  {*/}
             {/*    columnInitData.tableTitleButton && <Button style={{backgroundColor: '#19B9DF', alignSelf: 'space-between'}} onClick={() => {*/}
             {/*      let tmp = searchList*/}

             {/*      setSearchList([*/}
             {/*        ...searchList,*/}
             {/*        {*/}
             {/*          seq: searchList.length+1*/}
             {/*        }*/}
             {/*      ])*/}
             {/*    }}>*/}
             {/*      <p style={{fontWeight: 'bold'}}>{columnInitData.tableTitleButton}</p>*/}
             {/*    </Button>*/}
             {/*  }*/}
             {/*  {*/}
             {/*    <div style={{ display: 'flex', width: 1200, marginTop: 8}}>*/}
             {/*      {bomDummy.map((v, i) => {*/}
             {/*        return <TabBox ref={i === 0 ? tabRef : null} style={ focusIndex === i ? {opacity: 1} : {}}>*/}
             {/*          {*/}
             {/*            tabRef.current && tabRef.current.clientWidth < 63*/}
             {/*              ? focusIndex !== i*/}
             {/*              ? <><p onClick={() => {setFocusIndex(i)}}>{v.code}</p></>*/}
             {/*              : <>*/}
             {/*                <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {*/}
             {/*                  deleteTab(i)*/}
             {/*                }}>*/}
             {/*                  <img style={{width: 20, height: 20}} src={IcX}/>*/}
             {/*                </div>*/}
             {/*              </>*/}
             {/*              : <>*/}
             {/*                <p onClick={() => {setFocusIndex(i)}}>{v.code}</p>*/}
             {/*                <div style={{cursor: 'pointer', width: 20, height: 20}} onClick={() => {*/}
             {/*                  deleteTab(i)*/}
             {/*                }}>*/}
             {/*                  <img style={{width: 20, height: 20}} src={IcX}/>*/}
             {/*                </div>*/}
             {/*              </>*/}
             {/*          }*/}
             {/*        </TabBox>*/}
             {/*      })}*/}
             {/*    </div>*/}
             {/*  }*/}
             {/*   <div></div>*/}
             {/* {*/}
             {/*  {*/}
             {/*    columnInitData.tableMoveButton && <Button style={{backgroundColor: '#717C90', alignSelf: 'space-between'}} onClick={() => {*/}
             {/*      let tmp = searchList*/}

             {/*      setSearchList([*/}
             {/*        ...searchList,*/}
             {/*        {*/}
             {/*          seq: searchList.length+1*/}
             {/*        }*/}
             {/*      ])*/}
             {/*    }}>*/}
             {/*        <p style={{fontWeight: 'bold'}}>{columnInitData.tableMoveButton}</p>*/}
             {/*    </Button>*/}
             {/*  }*/}
             {/* </div>*/}
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                headerList={infoModalInit ? searchModalList[infoModalInit.excelColumnType] : []}
                row={searchList ?? [{}]}
                setRow={
                  (e) => {
                    let tmp = e.map((v, index) => {
                      v.name = v.user_id;
                      console.log("v : ", v)
                      if(v.newTab === true){
                        const newTabIndex = bomDummy.length+1
                        addNewTab(newTabIndex)
                        setFocusIndex(newTabIndex-1)
                      }

                      return {
                        ...v,
                        newTab: false
                      }
                    })
                    console.log("!!!!!!!!!!!e : ", e)
                    console.log("!!!!!!!!!!!tmp : ", tmp)
                    // setSearchList([...tmp])
                    setSearchList([...e])
                  }
                }
                width={1746}
                rowHeight={32}
                height={543}
                // setSelectRow={(e) => {
                //   setSelectRow(e)
                // }}
                setSelectRow={(e) => {
                  // if(!searchList[e].border){
                  //   searchList.map((v,i)=>{
                  //     v.border = false;
                  //   })
                  //   searchList[e].border = true
                  //   setSearchList([...searchList])
                  // }
                  setSelectRow(e)
                }}
                type={'searchModal'}
                headerAlign={'center'}
              />
            </div>
          </div>
          <div style={{ height: 50, display: 'flex', alignItems: 'flex-end'}}>
            <FooterButton
              onClick={() => {
                setIsOpen(false)
              }}
              style={{
                backgroundColor: infoModalInit && infoModalInit.readonly ? POINT_COLOR : '#E7E9EB',
              }}
            >
              <p style={{color: infoModalInit && infoModalInit.readonly ? '#0D0D0D' : '#717C90'}}>{infoModalInit && infoModalInit.readonly ? "확인" : "취소"}</p>
            </FooterButton>
            { infoModalInit && !infoModalInit.readonly && <FooterButton
              onClick={() => {
                // if (selectRow !== undefined && selectRow !== null) {
                //   console.log("row : ",row, "searchList : ", searchList, "selectRow : ",selectRow)
                //   onRowChange({
                //     ...row,
                //     devices:searchList,
                //     name: row.name,
                //     isChange: true
                //   })
                // }
                saveSubFactory();
                // setIsOpen(false)
              }}
              style={{
                backgroundColor: POINT_COLOR,
              }}
            >
              <p style={{color: '#0D0D0D'}}>등록하기</p>
            </FooterButton>}
          </div>
        </div>
      </Modal>
    </SearchModalWrapper>
  )
}

const SearchModalWrapper = styled.div`
  display: flex;
  width: 100%;
`

const Button = styled.button`
    width:112px;
    height:32px;
    color:white;
    font-size:15px;
    border:none;
    border-radius:6px;
    background:#717C90;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;

`;

const HeaderTable = styled.div`
  width: 1744px;
  height: 32px;
  margin: 0 16px;
  background-color: #F4F6FA;
  border: 0.5px solid #B3B3B3;
  display: flex
`

const HeaderTableTextInput = styled.div`
  background-color: #ffffff;
  padding-left: 8px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  margin-right: 66px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  width: 100%;
`

const HeaderTableTitle = styled.div`
  width: 112px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

const TabBox = styled.button`
  max-width: 214.5px;
  min-width: 40px;
  height: 32px;
  background-color: #19B9DF;
  opacity: 0.5;
  border: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 4px;
  cursor: pointer;
  flex: 1;
  p {
    font-size: 15px;
    width: 168px;
    text-overflow: ellipsis;
    color: white;
    padding-left: 8px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const FooterButton = styled.div`
  flex: 1; 
  height: 40px;
  display: flex; 
  justify-content: center;
  align-items: center;
  p {
    font-size: 14px;
    font-weight: bold;
  }
`

export {InfoModal}

import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import styled from 'styled-components'
import Modal from 'react-modal'
import {POINT_COLOR} from '../../common/configset'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import {ExcelTable} from '../Excel/ExcelTable'
import {searchModalList} from '../../common/modalInit'
//@ts-ignore
import Search_icon from '../../../public/images/btn_search.png'
import {RequestMethod} from '../../common/RequestFunctions'
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'
import {
    change_summary_info_index,
    delete_summary_info,
    insert_summary_info,
    reset_summary_info
} from "../../reducer/infoModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
  modify?: boolean
}

const BomInfoModal = ({column, row, onRowChange, modify}: IProps) => {
  const tabRef = useRef(null)
  const tabStore = useSelector((rootState: RootState) => rootState.infoModal)
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([
    {seq: 1,}
  ])
  const [focusIndex, setFocusIndex] = useState<number>(0)

  const [headerData, setHeaderData] = useState<any>();

  useEffect(() => {
    if(isOpen) {
      if(row.bom_root_id){
        SearchBasic().then(() => {
          Notiflix.Loading.remove()
        })
      } else {
        setIsOpen(false)
        Notiflix.Report.warning("데이터를 저장해주시기 바랍니다.", "", "확인",)
      }
    }else{
      dispatch(reset_summary_info());
    }
  }, [isOpen])

  useEffect(() => {
     if(tabStore.datas.length <= 0){
        setIsOpen(false);
     }
  },[tabStore, ])

  useEffect(() => {
    if(isOpen ) {
      getModalData()
    }

  },[tabStore.index])

  const getModalData = async() => {

    if(tabStore.datas[tabStore.index]?.code){
      await RequestMethod("get", "bomLoad", {path: { key: tabStore.datas[tabStore.index].code }})
          .then((res) => {
            const result = changeRow(res);
            setSearchList([...result])

            result.map((value, i) => {
              if(tabStore.datas[tabStore.index].code == value.parent.bom_root_id){
                setHeaderData(result[0].parent)
              }
            })
          })
    }
  }


  const changeRow = (tmpRow: any, key?: string) => {
    let tmpData = []
    let row = [];
    if(typeof tmpRow === 'string'){
      let tmpRowArray = tmpRow.split('\n')

      row = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      row = [{...tmpRow}]
    }

    tmpData = row.map((v, i) => {
      let childData: any = {}
      let type = "";
      switch(v.type){
        case 0:{
          childData = v.child_rm
          type = v.child_rm.type == "1" ? "Kg" : v.child_rm.type == "2" ? "장" : "-";
          break;
        }
        case 1:{
          childData = v.child_sm
          type = "1";
          break;
        }
        case 2:{
          childData = v.child_product
          type = "2";
          break;
        }
      }

      return {
        ...childData,
        seq: i+1,
        code: childData.code,
        type: v.type,
        tab: v.type,
        type_name: TransferCodeToValue(childData?.type, v.type === 0 ? "rawMaterialType" : v.type === 1 ? "submaterial" : "product"),
        unit: childData.unit ?? type,
        usage: v.usage,
        version: v.version,
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : null,
        // bom_root_id: childData.bom_root_id,
        product: v.type === 2 ?{
          ...childData,
        }: null,
        product_id: v.parent.product_id,
        raw_material: v.type === 0 ?{
          ...childData,
        }: null,
        sub_material: v.type === 1 ?{
          ...childData,
        }: null,
        parent:v.parent,
        setting:v.setting === 0 ? "기본" : "스페어"
      }
    })
    return tmpData
  }

  const SearchBasic = async (selectKey?:string) => {
    Notiflix.Loading.circle()
    let res;
    if(selectKey){
      res = await RequestMethod('get', `bomLoad`,{path: { key: selectKey }})
      let searchList = changeRow(res)
      dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
      setSearchList([...searchList])

    }else{
      res = await RequestMethod('get', `bomLoad`,{path: { key: row.bom_root_id }})
      let searchList = changeRow(res)
      dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
      setSearchList(searchList.length > 0 ? searchList : [{seq:1}])
    }
  }

  const SaveBasic = async () => {
    let body = searchList.map((v, i) => {
      return {
        seq: i+1,
        parent: {
          ...row,
          process: row.processArray,
          type: row.type_id ?? row.type,
          product_id:row.product_id ?? row.productId,
          code: row.cmId,
        },
        child_product: v.tab === 2 ? {
          ...v.product
        } : null,
        child_rm: v.tab === 0 ? {
          ...v.raw_material,
          type:v.raw_material.type_id
        } : null,
        child_sm: v.tab === 1 ? {
          ...v.sub_material
        } : null,
        type: v.tab,
        key: row.bom_root_id,
        setting: v.setting === "기본" ? 0 : 1,
        usage: v.usage,
        version: v.version
      }
    })

    const res = await RequestMethod('post', `bomSave`,body)

    if(res) {
      Notiflix.Report.success("저장되었습니다.","","확인", () => setIsOpen(false))
    }

  }

  const ModalContents = () => {
    if(modify){
      return <>
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: 112
        }}>
          <Button onClick={() => {
            setIsOpen(true)
          }}>
            <p>BOM 수정</p>
          </Button>
        </div>
      </>
    }else{
      if(column.type === 'readonly'){
        return <>
          <div style={{
            padding: '3.5px 0px 0px 3.5px',
            width: '100%'
          }}>
            <div onClick={() => {
              console.log("isOpen : ", isOpen)
              setIsOpen(true)
            }}>
              <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>BOM 보기</p>
            </div>
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
              <p>BOM 등록</p>
            </UploadButton>
          </div>
        </>
      }
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
          height: 800
        }}>
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
            }}>BOM 정보 (해당 제품을 만드는데 필요한 BOM을 등록해주세요)</p>
            <div style={{display: 'flex'}}>
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>거래처명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.customer.name : row.customerArray ? row.customerArray.name : "-"}</HeaderTableText>
              {/*<HeaderTableText>{tabStore.datas[tabStore.index]?.headerData ? tabStore.datas[tabStore.index].headerData.customerArray.name : row.customerArray ? row.customerArray.name : "-"}</HeaderTableText>*/}
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.model?.model : row.modelArray ? row.modelArray.model : "-"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.code :row.code ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.name : row.name ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>품목 종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? TransferCodeToValue(headerData.type, 'productType') :row.type || row.type === 0 ? TransferCodeToValue(row.type, 'productType') : "-"}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>생산 공정</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.process?.name : row.processArray ? row.processArray.name : "-"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>생산수량</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>1</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>단위</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{headerData ? headerData.unit : row.unit ?? "-"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
              {tabStore.datas.map((v, i) => {
                return <TabBox ref={i === 0 ? tabRef : null} style={
                  // focusIndex === i ? {
                  tabStore.index === i ? {
                    backgroundColor: '#19B9DF',
                    opacity: 1
                  } : {
                    backgroundColor: '#E7E9EB',
                    opacity: 1
                  }
                }>
                  {
                    tabRef.current && tabRef.current.clientWidth < 63 ?
                        // focusIndex !== i ?
                        tabStore.index !== i ?
                            <p onClick={() => {setFocusIndex(i)}}>{v.title}</p>
                            // <p onClick={() => {setFocusIndex(i)}}>{tabStore.datas[i].title}</p>
                            :
                            <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {
                              dispatch(delete_summary_info(i));
                            }}>
                              <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                            :
                            <>
                              <p onClick={() => {
                                setFocusIndex(i)
                                dispatch(change_summary_info_index(i));
                              }}
                                 style={{color: tabStore.index === i ? "white" : '#353B48'}}
                              >{tabStore.datas[i].title}</p>
                              <div style={{cursor: 'pointer', width: 20, height: 20}} onClick={() => {
                                dispatch(delete_summary_info(i));
                              }}>
                                <img style={{width: 20, height: 20}} src={IcX}/>
                              </div>
                            </>
                  }
                </TabBox>
              })}
              </div>
            </div>
            {column.type !== "readonly" &&
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
              <Button onClick={() => {
                let tmp = searchList

                setSearchList([
                  ...searchList,
                  {
                    seq: searchList.length+1
                  }
                ])
              }}>
                <p>행 추가</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                if(selectRow === 0 || selectRow === undefined){
                  return
                }
                let tmpRow = searchList

                let tmp = tmpRow[selectRow]
                tmpRow[selectRow] = tmpRow[selectRow - 1]
                tmpRow[selectRow - 1] = tmp

                setSearchList([...tmpRow.map((v, i) => {
                  if(!searchList[selectRow-1].border){
                    searchList.map((v,i)=>{
                      v.border = false;
                    })
                    searchList[selectRow-1].border = true
                    setSearchList([...searchList])
                  }
                  setSelectRow(selectRow -1)
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
              }}>
                <p>위로</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                if(selectRow === searchList.length-1 || selectRow === undefined){
                  return
                }
                let tmpRow = searchList

                let tmp = tmpRow[selectRow]
                tmpRow[selectRow] = tmpRow[selectRow + 1]
                tmpRow[selectRow + 1] = tmp

                setSearchList([...tmpRow.map((v, i) => {
                  if(!searchList[selectRow+1].border){
                    searchList.map((v,i)=>{
                      v.border = false;
                    })
                    searchList[selectRow+1].border = true
                    setSearchList([...searchList])
                  }
                  setSelectRow(selectRow +1)
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
              }}>
                <p>아래로</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                let tmpRow = [...searchList]
                tmpRow.splice(selectRow, 1)
                setSearchList([...tmpRow])
              }}>
                <p>삭제</p>
              </Button>
            </div>
            }
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={column.type === "readonly" ?  searchModalList.readOnlyBomInfo : searchModalList.bomInfo}
              row={searchList ?? [{}]}
              setRow={(e) => {
                let tmp = e.map((v, index) => {
                  return {
                    ...v,
                    newTab: false
                  }
                })

                setSearchList([...tmp])
              }}
              width={1746}
              rowHeight={32}
              height={552}
              // setSelectRow={(e) => {
              //   setSelectRow(e)
              // }}
              setSelectRow={(e) => {
                if(!searchList[e].border){
                  searchList.map((v,i)=>{
                    v.border = false;
                  })
                  searchList[e].border = true
                  setSearchList([...searchList])
                }
                setSelectRow(e)
              }}
              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            {
              column.type !== 'readonly' && <div
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                  <p style={{color: '#717C90'}}>취소</p>
              </div>
            }
            <div
              onClick={() => {
                if(column.type !== 'readonly'){
                  SaveBasic()
                  if(selectRow !== undefined && selectRow !== null) {
                    onRowChange(
                      column.type === "bomRegister" ?
                        {
                          ...row,
                          isChange: true
                        }
                        :
                        {
                          ...row,
                          ...searchList[selectRow],
                          name: row.name,
                          isChange: true
                        }

                    )
                  }
                }
                setIsOpen(false)
              }}
              style={{width: column.type === 'readonly' ? '100%' : '50%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>{column.type !== 'readonly' ? '등록하기' : '확인'}</p>
            </div>
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

const TabBox = styled.button`
  max-width: 214.5px;
  min-width: 40px;
  height: 32px;
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
  padding-left: 3px;
  height: 27px;
  border: 0.5px solid #B3B3B3;
  margin-top:2px;
  margin-right: 70px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {BomInfoModal};

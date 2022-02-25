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
  update?: (e:boolean) => void
}

const BomInfoModal = ({column, row, onRowChange, modify, update}: IProps) => {
  const tabRef = useRef(null)
  const tabStore = useSelector((rootState: RootState) => rootState.infoModal)
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>(null)
  const [searchList, setSearchList] = useState<any[]>([])

  const [focusIndex, setFocusIndex] = useState<number>(0)

  const [headerData, setHeaderData] = useState<any>();


  useEffect(() => {
    if(isOpen) {
      setSelectRow(null)
      // if(row.bom_root_id){

      if(row.process_id){
        SearchBasic().then(() => {
          Notiflix.Loading.remove()
        })
      }

      // } else {
      //   setIsOpen(false)
      //   Notiflix.Report.warning("데이터를 저장해주시기 바랍니다.", "", "확인",)
      // }
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
    if(isOpen) {
      if(row.process_id){
        getModalData()
      }
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
        type_name: TransferCodeToValue(childData?.type, v.type === 0 ? "rawmaterial" : v.type === 1 ? "submaterial" : "product"),
        unit: childData.unit ?? type,
        usage: v.usage,
        version: v.version,
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : null,
        // bom_root_id: childData.bom_root_id,
        product: v.type === 2 ?{
          ...childData,
        }: null,
        product_id: v.parent?.product_id,
        raw_material: v.type === 0 ?{
          ...childData,
        }: null,
        sub_material: v.type === 1 ?{
          ...childData,
        }: null,
        parent:v.parent,
        setting:v.setting === 1 ? "기본" : "스페어"
      }
    })

    console.log('tmpData : ' , tmpData)

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
      setSearchList(searchList.length > 0 ? searchList : [])
    }
  }


  // tab : 0 -> 원자재
  // tab : 1 -> 부자재
  // tab : 2 => 제품
  // 이 로직을 좀더 간단한게 할수 있을것 같은데..
  const haveBasicValidation = () => {

    let rawMaterialBasic = [] ;
    let subMaterialBasic = [] ;
    let productBasic = [];

    let haveRawMaterialBasic;
    let haveSubMaterialBasic;
    let haveProductBasic;

    searchList.map((list)=>{
      if(list.tab === 0){
        rawMaterialBasic.push({type : list.setting})
      }else if(list.tab === 1){
        subMaterialBasic.push({type : list.setting})
      }else if(list.tab === 2){
        productBasic.push({type : list.setting})
      }
    })

    if(rawMaterialBasic.length !== 0){
      haveRawMaterialBasic = rawMaterialBasic.some((v) => v.type === '기본')
    }else{
      haveRawMaterialBasic = true
    }

    if(subMaterialBasic.length !== 0){
      haveSubMaterialBasic = subMaterialBasic.some((v) => v.type === '기본')
    }else{
      haveSubMaterialBasic = true
    }

    if(productBasic.length !== 0){
      haveProductBasic = productBasic.some((v) => v.type === '기본')
    }else{
      haveProductBasic = true
    }

    if(haveRawMaterialBasic && haveSubMaterialBasic && haveProductBasic){
      return true
    }

    return false

  }

  // 데이터 유무 판단
  const haveDataValidation = () => {

    let dataCheck = true

    searchList.map((v,i)=>{
      if(!v.rm_id && !v.sm_id && !v.product_id){
        dataCheck = false
      }
    })

    return dataCheck
  }

  const filterList = () => {
    return searchList.map((v, i) => (
      {
        seq: i+1,
        parent: {
          ...row,
          additional: row.additional ?? [],
          process: row.processArray,
          model: row.model === '' ? null : row.model,
          type: row.type_id ?? row.type === '완제품' ? 2 : 1,
          product_id: typeof row.product_id === 'string' ? row.product.product_id : row.product_id ?? row.productId,
          code: row.code,
          customer: row.customer === '' ? null : row.customer
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
        setting: v.setting === "기본" ? 1 : 0,
        usage: v.usage,
        version: v.version
      }
    ))
  }

  const executeValidation = () => {

    let isValidation = false
    const haveList = searchList.length === 0
    const haveData = haveDataValidation()
    const haveBasic = haveBasicValidation()

    if(haveList){
      isValidation = true
      Notiflix.Report.warning("경고","BOM은 하나라도 등록이 되어야합니다.","확인",)
    }else if(!haveData){
      isValidation = true
      Notiflix.Report.warning("경고","데이터를 입력해주세요.","확인",)
    }else if(!haveBasic){
      isValidation = true
      Notiflix.Report.warning("경고","품목별 기본설정은 최소 한개 이상 필요합니다.","확인",)
    }

    return isValidation

  }


  const SaveBasic = async () => {

    const isValidation = executeValidation()

    if(isValidation){
      return undefined;
    }else{
      const body = filterList()
      if(body.length !== 0){
        const res = await RequestMethod('post', `bomSave`, body)
        if(res) {
          modify && update(true)
            Notiflix.Report.success("저장되었습니다.","","확인", () => setIsOpen(false))
        }
      }
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
            <UploadButton
            onClick={() => {
              if(row.code){
                setIsOpen(true)
              }else{
                Notiflix.Report.warning("경고","BOM을 등록하시려면 CODE가 입력 되어야합니다.","확인",)
              }
            }}>
              <p>BOM 등록</p>
            </UploadButton>
          </div>
        </>
      }
    }
  }

  const typeCheck = (data:any) => {

    const result = data.map((row) => {
      switch(row.tab){
        case 0:
          row.type_name = row.type;
          return row;
        case 1:
          row.type_name = "-";
          return row
        case 2:
          row.type_name = row.type;
          return row
        default:
        return row
      }
    })
    return result;
  }

  const competeBom = (rows) => {

    const tempRow = [...rows]
    const spliceRow = [...rows]
    spliceRow.splice(selectRow, 1)

    const isCheck = spliceRow.some((row)=> row.code === tempRow[selectRow]?.code && row.code !==undefined && row.code !=='')

    if(spliceRow){
      if(isCheck){
        return Notiflix.Report.warning(
          '경고',
          `중복된 BOM이 존재합니다.`,
          '확인'
        );
      }
    }

    setSearchList(rows)
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
                    setting: '기본',
                    seq: searchList.length+1
                  }
                ])
              }}>
                <p>행 추가</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {

                if(selectRow === null || selectRow === 0){
                  return;
                }else{

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
                }

              }}>
                <p>위로</p>
              </Button>
              <Button style={{marginLeft: 16}} onClick={() => {
                if(selectRow === searchList.length-1 || selectRow === null){
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

                if(selectRow === null){
                  return Notiflix.Report.warning(
                    '경고',
                    '선택된 정보가 없습니다.',
                    '확인',
                    );
                }

                let tmpRow = [...searchList]
                if(selectRow !== undefined && selectRow !== null){
                  tmpRow.splice(selectRow, 1)

                  const filterRow = tmpRow.map((v , i)=>{
                    return {...v , seq : i + 1}
                  })
                  setSearchList(filterRow)
                  setSelectRow(undefined)
                }

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
                // typeCheck(tmp)
                competeBom(tmp)
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
                if(column.type !== 'readonly' && tabStore.index === 0){
                    if(row.product_id){
                        return SaveBasic()
                    }else{
                      const isValidation = executeValidation()
                      if(!isValidation){
                        onRowChange(
                          column.type === "bomRegister" ?
                            {
                              ...row,
                              isChange: true,
                              bom : filterList()
                            }
                            :
                            {
                              ...row,
                              ...searchList[selectRow],
                              name: row.name,
                              isChange: true
                            }
                        )
                        Notiflix.Report.success("저장되었습니다.","","확인", () => setIsOpen(false))
                      }
                  }
                }else {
                  setIsOpen(false)
                }
                }
              }
              style={{width: column.type === 'readonly' ? '100%' : '50%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>{column.type !== 'readonly' && tabStore.index === 0 ? '등록하기' : '확인'}</p>
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

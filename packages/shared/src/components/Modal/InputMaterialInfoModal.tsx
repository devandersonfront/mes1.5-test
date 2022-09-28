import React, {useEffect, useRef, useState} from 'react'
import { IExcelHeaderType, TransferType } from '../../@types/type'
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
import {TransferCodeToValue} from '../../common/TransferFunction'
//@ts-ignore
import Notiflix from "notiflix";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import {
  add_summary_info,
  change_summary_info_index,
  delete_summary_info,
  reset_summary_info
} from "../../reducer/infoModal";
import Big from 'big.js'
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [{title: '거래처', infoWidth: 144, key: 'customer'}, {title: '모델', infoWidth: 144, key: 'model'},],
  [
    {title: 'CODE', infoWidth: 144, key: 'code'},
    {title: '품명', infoWidth: 144, key: 'name'},
    {title: '품목 종류', infoWidth: 144, key: 'type'},
    {title: '생산 공정', infoWidth: 144, key: 'process'},
  ],
  [{title: '단위', infoWidth: 144, key: 'unit'},{title: '목표 생산량', infoWidth: 144, key: 'goal'},],
]

//작업지시서 리스트 자재 보기

const InputMaterialInfoModal = ({column, row, onRowChange}: IProps) => {
  const tabRef = useRef(null)
  const dispatch = useDispatch()

  const bomInfoList = useSelector((root:RootState) => root.infoModal)

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [summaryData, setSummaryData] = useState<any>({})
  const [searchList, setSearchList] = useState<any[]>([])
  const [focusIndex, setFocusIndex] = useState<number>(0)
  const cavity = row.product?.molds?.filter(mold => mold.setting === 1)?.[0]?.mold?.cavity ?? 1

  useEffect(() => {
    if(isOpen) {
      if(row.input_bom.length > 0) {
        // changeRow(row.input_bom, row)
        setSummaryData({
          // ...res.parent
          customer: row.product.customer?.name,
          model: row.product.model?.model,
          code: row.product.code,
          name: row.product.name,
          process: row.product.process?.name,
          type: TransferCodeToValue(row.product.type, 'product'),
          unit: row.product.unit,
          goal: row.goal,
        })
      }else{
        Notiflix.Report.warning("경고","투입 자재가 없습니다.","확인",() => setIsOpen(false))
      }
    }else{
      dispatch(reset_summary_info())
    }
  }, [isOpen])

  useEffect(() => {
    if(isOpen){
      if(bomInfoList.index === -1) {
        setIsOpen(false)
      } else if(bomInfoList.index === 0){
        loadRecordGroup(row.product.bom_root_id, row.os_id)
      } else {
        loadRecordGroup(bomInfoList.datas[bomInfoList.index]?.product_id)
      }
    }
  },[bomInfoList.index])

  const loadRecordGroup = async (product_id: any, os_id?: any) => {
    // Notiflix.Loading.circle()
    if(os_id) {
      const res = await RequestMethod('get', `sheetBomLoad`, {
        path: {
          os_id: os_id,
          bom: 'bom',
          key: product_id,
        },
      })

      if (res) {
        let searchList = changeRow(res, row)
        setSearchList([...searchList])
      }
    }else {
      const res = await RequestMethod('get', `bomLoad`, {
        path: {
          product_id: product_id,
        },
      })

      if (res) {
        let searchList = changeRow(typeof res === 'string' ? res : [res], row)
        setSearchList([...searchList])
      }
    }
  }


  const changeRow = (tmpRow: any, parent?:any) => {
    let tmpData = []
    let inputBom = [];
    if(typeof tmpRow === 'string'){
      let tmpRowArray = tmpRow.split('\n')
      inputBom = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      inputBom = tmpRow
    }
    tmpData = inputBom.map((v, i) => {
      const bomDetail:{childData:any, bomType: TransferType} = {
        childData: {},
        bomType: undefined,
      }
      switch(v.type){
        case 0:{
          const childData = {...v.child_rm}
          childData.unit = TransferCodeToValue(childData.unit, 'rawMaterialUnit')
          bomDetail['childData'] = childData
          bomDetail['bomType'] = 'rawMaterial'
          break;
        }
        case 1:{
          bomDetail['childData'] = v.child_sm
          bomDetail['bomType'] = 'subMaterial'
          break;
        }
        case 2:{
          bomDetail['childData'] = v.child_product
          bomDetail['bomType'] = 'product'
          break;
        }
      }
      return {
        ...bomDetail.childData,
        seq: i+1,
        code: bomDetail.childData.code,
        type: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        tab: v.type,
        product_type: v.type !== 2 ? '-' : TransferCodeToValue(bomDetail.childData?.type, 'productType'),
        type_name: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        cavity,
        unit: bomDetail.childData.unit,
        usage: v.usage,
        version: v.version,
        processArray: bomDetail.childData.process ?? null,
        process: bomDetail.childData.process ? bomDetail.childData.process.name : null,
        // bom_root_id: bomDetail.childData.bom_root_id,
        [bomDetail.bomType]: {...bomDetail.childData},
        product_id: v?.parent?.product_id,
        parent:v.parent,
        setting:v.setting === 0 ? "기본" : "스페어",
        disturbance: new Big(parent?.goal).div(cavity).times(v.usage).toNumber()
      }
    })
    return tmpData
  }

  // const addNewTab = (index: number) => {
  //   let tmp = bomInfoList
  //   tmp.datas.push({code: 'SU-20210701-'+index, name: 'SU900-'+index, material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},)
  //   dispatch(add_summary_info({}))
  //   setBomDummy([...tmp])
  // }

  const deleteTab = (index: number) => {
    if(bomInfoList.datas.length - 1 === focusIndex){
      setFocusIndex(focusIndex-1)
    }else if(bomInfoList.datas.length === 1 || index === 0) {
      return setIsOpen(false)
    }
    dispatch(delete_summary_info(index))
  }

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
          dispatch(add_summary_info({code: row.bom_root_id, title: row.code, index: 0, product_id:row.product.bom_root_id}))
          loadRecordGroup(row.product.bom_root_id, row.os_id);
        }} haveId hoverColor={"#19B9DF"}
        >
          <p>자재 보기</p>
        </UploadButton>
  )

  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
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
          height: 803
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
            }}>투입 자재 정보 (해당 제품을 만드는 데 사용할 자재는 아래와 같습니다)</p>
            <div style={{display: 'flex'}}>

              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          {
            headerItems && headerItems.map((infos, index) => {
              return (
                <HeaderTable>
                  {
                    infos.map(info => {
                      return (
                        <>
                          <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>{info.title}</HeaderTableText>
                          </HeaderTableTitle>
                          <HeaderTableTextInput style={{width: info.infoWidth}}>
                            <Tooltip placement={'rightTop'}
                                     overlay={
                                       <div style={{fontWeight : 'bold'}}>
                                         {getSummaryInfo(info)}
                                       </div>
                                     } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                              <HeaderTableText>{getSummaryInfo(info)}</HeaderTableText>
                            </Tooltip>
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
          <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: 1200}}>
              {bomInfoList.datas.map((v, i) => {
                return <TabBox ref={i === 0 ? tabRef : null} style={ bomInfoList.index == i ? {opacity: 1} : {}}>
                  {
                    tabRef.current && tabRef.current.clientWidth < 63
                      ? bomInfoList.index !== i
                        ? <><p onClick={() => {
                          dispatch(change_summary_info_index(i))
                          // loadRecordGroup(bomInfoList.datas[i].product_id)
                        }}>{v.title}</p></>
                        : <>
                              <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {
                                deleteTab(i)
                              }}>
                              <img style={{width: 20, height: 20}} src={IcX}/>
                            </div>
                          </>
                      : <>
                        <p onClick={() => {
                          dispatch(change_summary_info_index(i))
                          // loadRecordGroup(bomInfoList.datas[i].product_id)
                        }}>{v.title}</p>
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
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.InputInfo}
              row={searchList ?? [{}]}
              setRow={(e) => {
                let tmp = e.map((v, index) => {
                  if(v.newTab === true){
                    const newTabIndex = bomInfoList.datas.length+1
                    // addNewTab(newTabIndex)
                    setFocusIndex(newTabIndex-1)
                  }
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
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
                if(!searchList[e].border){
                  const newSearchList = searchList.map((row,rowIdx)=>({
                    ...row,
                    border: e === rowIdx
                  }))
                  setSearchList(newSearchList)
                }
                setSelectRow(e)
              }}
              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 46, display: 'flex', alignItems: 'flex-end'}}>
            {
              column.type !== 'readonly' && <div
                  onClick={() => {
                    setIsOpen(false)
                  }}
                  style={{width: '50%', height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
              >
                  <p>취소</p>
              </div>
            }
            <div
              onClick={() => setIsOpen(false)}
              style={{width: column.type !== 'readonly' ? "50%" : '100%', height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>{column.type !== 'readonly' ? '선택 완료' : '확인'}</p>
            </div>
          </div>
        </div>
      </Modal>
    </SearchModalWrapper>
  )
}

const SearchModalWrapper = styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
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

export {InputMaterialInfoModal}

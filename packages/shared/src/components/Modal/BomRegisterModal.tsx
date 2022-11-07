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
import Notiflix from 'notiflix'
import { TransferCodeToValue, TransferValueToCode } from '../../common/TransferFunction'
import {useDispatch} from 'react-redux'
import {change_summary_info_index, insert_summary_info, reset_summary_info} from '../../reducer/infoModal'
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import { ParseResponse } from '../../common/Util'

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

const BomRegisterModal = ({column, row, onRowChange}: IProps) => {
  const tabRef = useRef(null)
  const dispatch = useDispatch()

  const [bomDummy, setBomDummy] = useState<any[]>([
  ])
  const [summaryData, setSummaryData] = useState<any>({})

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>(
    [{}])
  const [tabs, setTabs] = useState<string[]>([])
  const [focusIndex, setFocusIndex] = useState<number>(0)

  useEffect(() => {
    if(isOpen) {
      if(column.type == 'noload'){
        const rowData = row.input.input_bom.map((bom, index) => {
          bom.parent = row.input
          return {
            ...bom.bom,
            setting: row.input_bom ? row?.input_bom[index]?.bom?.setting : bom?.bom.setting,
            parent: row.input.product
          }
        })
        let searchList = changeRow(rowData)
        // dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
        setSearchList([...searchList])
      }else if(row.bom_root_id){
        SearchBasic().then(() => {
          // Notiflix.Loading.remove()
        })
      }
     else {
        setIsOpen(false)
        Notiflix.Report.warning("제품을 선택해 주세요.", "", "확인",)
      }
    }else{
      dispatch(reset_summary_info());
    }
  }, [isOpen, /*row*/])

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
      haveRawMaterialBasic = rawMaterialBasic.some((v) => v.type === 1)
    }else{
      haveRawMaterialBasic = true
    }

    if(subMaterialBasic.length !== 0){
      haveSubMaterialBasic = subMaterialBasic.some((v) => v.type === 1)
    }else{
      haveSubMaterialBasic = true
    }

    if(productBasic.length !== 0){
      haveProductBasic = productBasic.some((v) => v.type === 1)
    }else{
      haveProductBasic = true
    }
    if(haveRawMaterialBasic && haveSubMaterialBasic && haveProductBasic){
      return true
    }

    return false

  }



  const executeValidation = () => {

    let isValidation = false
    const haveBasic = haveBasicValidation()

    if(!haveBasic){
      isValidation = true
      Notiflix.Report.warning("경고",`자재 보기를 눌러 BOM 등록을 해주세요. 품목 종류별로 최소 한 개 이상은 사용해야 합니다.`,"확인",)
    }

    return isValidation

  }

  const changeRow = (tmpRow: any, key?: string) => {
    const parsedRes = ParseResponse(tmpRow)

    return parsedRes.map((v, i) => {
      const bomDetail:{childData:any, bomType: TransferType, objectKey: string} = {
        childData: {},
        bomType: undefined,
        objectKey: undefined
      }
      switch(v.type){
        case 0:{
          const childData = {...v.child_rm}
          childData.unit = TransferCodeToValue(childData.unit, 'rawMaterialUnit')
          bomDetail['childData'] = childData
          bomDetail['bomType'] = 'rawMaterial'
          bomDetail['objectKey'] = 'raw_material'
          // if(v.bom.setting) bomDetail['setting'] = v.bom.setting
          break;
        }
        case 1:{
          bomDetail['childData'] = v.child_sm
          bomDetail['bomType'] = 'subMaterial'
          bomDetail['objectKey'] = 'sub_material'
          // if(v.bom.setting) bomDetail['setting'] = v.bom.setting
          break;
        }
        case 2:{
          bomDetail['childData'] = v.child_product
          bomDetail['bomType'] = 'product'
          bomDetail['objectKey'] = 'product'
          // if(v.bom.setting) bomDetail['setting'] = v.bom.setting
          break;
        }
      }

      if(i === 0) {
        setSummaryData({
        // ...res.parent
          customer: v.parent?.customer?.name,
          model: v.parent?.model?.model,
          code: v.parent?.code,
          name: v.parent?.name,
          process: v.parent?.process?.name,
          type: TransferCodeToValue(v?.parent?.type, 'product'),
          // customer: v.input?.product?.customer?.customer_id,
          // model: v.input?.product?.model?.model,
          // code: v.input?.product?.code,
          // name: v?.name,
          // process: v?.process_id,
          // type: v?.type,
          unit: v.parent?.unit,
          goal: row.goal,
        })
      }
      return {
        ...bomDetail.childData,
        seq: i+1,
        code: bomDetail.childData.code,
        type: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        tab: v.type,
        product_type: v.type !== 2 ? '-' : TransferCodeToValue(bomDetail.childData?.type, 'productType'),
        type_name: TransferCodeToValue(bomDetail.childData?.type, bomDetail.bomType),
        unit: bomDetail.childData.unit,
        parent: v.parent,
        usage: v.usage,
        version: v.version,
        setting: v.setting,
        isDefault: v.setting == 1 ? '기본' : '스페어',
        stock: bomDetail.childData.stock,
        disturbance: Number(row.goal) * Number(v.usage),
        processArray: bomDetail.childData.process ?? null,
        process: bomDetail.childData.process ? bomDetail.childData.process.name : '-',
        // spare:'부',
        bom_root_id: bomDetail.childData.bom_root_id,
        [bomDetail.objectKey]: {...bomDetail.childData},
      }
    })
  }

  const SearchBasic = async (selectKey?:string) => {
    Notiflix.Loading.circle()
    let res;
      if(selectKey){
        res = await RequestMethod('get', `bomLoad`,{path: { key: selectKey }})
        if(res){
          let searchList = changeRow(res)
          dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
          setSearchList([...searchList])
        }else{
          Notiflix.Report.warning("BOM 정보가 없습니다.", "", "확인", () => setIsOpen(false))
        }

      }else{
        res = await RequestMethod('get', `bomLoad`,{path: { key: row.bom_root_id }})
        if(res){
          let searchList = changeRow(res)
          // dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
          setSearchList([...searchList])
        }else{
          Notiflix.Report.warning("BOM 정보가 없습니다.", "", "확인", () => setIsOpen(false))
        }
      }
  }

  const addNewTab = (index: number) => {
    let tmp = bomDummy
    tmp.push({code: 'SU-20210701-'+index, name: 'SU900-'+index, material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},)
    setBomDummy([...tmp])
  }

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

  const ModalContents = () => (
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId >
          <p style={{color:column.modalType && "#0D0D0D"}}>자재 보기</p>
        </UploadButton>
  )

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
            }}>BOM 정보 {/*(해당 제품을 만드는데 사용할 자재를 선택해주세요. 자재 정보가 없으면 BOM 수정 버튼을 눌러 BOM 정보를 수정해주세요)*/}</p>
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
                <HeaderTable key={index.toString()}>
                  {
                    infos.map((info,i) => {
                      return (
                        <React.Fragment key={''+index+i}>
                          <HeaderTableTitle>
                            <HeaderTableText style={{fontWeight: 'bold'}}>{info.title ?? "-"}</HeaderTableText>
                          </HeaderTableTitle>
                          <HeaderTableTextInput style={{width: info.infoWidth}}>
                            <Tooltip placement={'rightTop'}
                                     overlay={
                                       <div style={{fontWeight : 'bold'}}>
                                         {summaryData[info.key] ?? "-"}
                                       </div>
                                     } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                              <HeaderTableText>{summaryData[info.key] ?? "-"}</HeaderTableText>
                            </Tooltip>
                            {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}
                          </HeaderTableTextInput>
                        </React.Fragment>
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
              {tabs.map((v, i) => {
                return <TabBox key={i.toString()} ref={i === 0 ? tabRef : null} style={
                  focusIndex === i ? {
                    backgroundColor: '#19B9DF',
                    opacity: 1
                  } : {
                    backgroundColor: '#E7E9EB',
                    opacity: 1
                  }
                }>
                  {
                    tabRef.current && tabRef.current.clientWidth < 63
                      ? focusIndex !== i
                      ? <><p onClick={() => {
                        dispatch(change_summary_info_index(i))
                      }}>{v}</p></>
                      : <>
                        <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {
                          deleteTab(i)
                        }}>
                          <img style={{width: 20, height: 20}} src={IcX}/>
                        </div>
                      </>
                      : <>
                        <p onClick={() => {setFocusIndex(i)}}
                           style={{color: focusIndex === i ? "white" : '#353B48'}}
                        >{v}</p>
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
              {/*<BomInfoModal column={column} row={row} onRowChange={onRowChange} modify update={(e)=> e ? SearchBasic() : ''}/>*/}
            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.bomRegister}
              row={searchList ?? [{}]}
              setRow={(e) => {
                let tmp = e.map((v, index) => {

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
                setSearchList([...tmp])
              }}
              width={1746}
              rowHeight={32}
              height={552}
              // onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
              //   setSelectRow(e)
              // }}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked)
                setSelectRow(e)
              }}
              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </div>
            <div
              onClick={() => {
                const isValidation = executeValidation()
                if(!isValidation){
                  onRowChange({
                    ...row,
                    input_bom: [
                      ...searchList.map((v, i) => {
                        // if(v.spare === '여'){
                          return {
                            bom: {
                              seq: i+1,
                              type: v.tab,
                              parent: v.parent,
                              child_product: v.tab === 2 ? {...v.product} : null,
                              child_rm: v.tab === 0 ? {...v.raw_material, unit: TransferValueToCode(v.raw_material.unit, 'rawMaterialUnit')} : null,
                              child_sm: v.tab === 1 ? {...v.sub_material} : null,
                              key: v.parent.bom_root_id,
                              setting: v.setting,
                              usage: v.usage,
                            }
                          }
                        // }
                      }).filter(v=>v)
                    ],
                    name: row.name,
                    isChange: true
                  })
                  setIsOpen(false)
                }
              }}
              style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>등록하기</p>
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {BomRegisterModal}

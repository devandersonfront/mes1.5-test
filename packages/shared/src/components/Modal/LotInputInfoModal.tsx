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
import {TransferCodeToValue} from '../../common/TransferFunction'
import Notiflix from "notiflix";

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

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

const headerWorkItems: {title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '지시 고유번호', infoWidth: 144, key: 'identification'},
    {title: 'LOT 번호', infoWidth: 144, key: 'lot_number'},
    {title: '거래처', infoWidth: 144, key: 'customer'},
    {title: '모델', infoWidth: 144, key: 'model'},
  ],
  [
    {title: 'CODE', infoWidth: 144, key: 'code'},
    {title: '품명', infoWidth: 144, key: 'name'},
    {title: '품목 종류', infoWidth: 144, key: 'type'},
    {title: '생산 공정', infoWidth: 144, key: 'process'},
  ],
  [
    {title: '단위', infoWidth: 144, key: 'unit'},
    {title: '목표 생산량', infoWidth: 144, key: 'goal'},
    {title: '작업자', infoWidth: 144, key: 'worker_name'},
    {title: '양품 수량', infoWidth: 144, key: 'good_quantity'},
    {title: '불량 수량', infoWidth: 144, key: 'poor_quantity'},
  ],
]

const LotInputInfoModal = ({column, row, onRowChange}: IProps) => {

  const [bomDummy, setBomDummy] = useState<any[]>([])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [summaryData, setSummaryData] = useState<any>({})
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [lotList, setLotList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [selectProduct, setSelectProduct] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [focusIndex, setFocusIndex] = useState<number>(0)

  useEffect(() => {
    if(isOpen) {
      if(row.operation_sheet && row.operation_sheet?.input_bom?.length > 0){
        changeRow(row.operation_sheet.input_bom)
      }else if(row.input_bom?.length > 0){
        changeRow(row.input_bom)
      }else{
        Notiflix.Report.warning("경고","투입 자재가 없습니다.","확인", () => setIsOpen(false))
      }
    }
  }, [isOpen, searchKeyword])

  const changeRow = (tmpRow: any, key?: string) => {
    let tmpData = []
    let tmpRows = tmpRow;

    setSummaryData({
      // ...res.parent
      identification: row.identification,
      lot_number: row.lot_number ?? '-',
      customer: row.product?.customer?.name,
      model: row.product?.model?.model,
      code: row.product?.code,
      name: row.product?.name,
      process: row.product?.process?.name,
      type: row.product?.type ? TransferCodeToValue(row.product.type, 'productType') : "-",
      unit: row.product?.unit,
      goal: row.goal,
      worker_name: row.worker_name ?? '-',
      good_quantity: row.good_quantity ?? 0,
      poor_quantity: row.qoor_quantity ?? 0,
    })
    // if(tmpRows){
    tmpData = tmpRows?.map((v, i) => {
      let childData: any = {}
      let type = ''
      switch(v.bom.type){
        case 0:{
          childData = v.bom.child_rm
          type = v.bom.child_rm.type == "1" ? "kg" : v.bom.child_rm.type == "2" ? "장" : "-";
          break;
        }
        case 1:{
          childData = v.bom.child_sm
          break;
        }
        case 2:{
          childData = v.bom.child_product
          break;
        }
      }

      return {
        ...childData,
        seq: i+1,
        code: childData.code,
        type: TransferCodeToValue(v.bom.type, 'material'),
        tab: v.bom.type,
        type_name: TransferCodeToValue(v.bom.type, 'material'),
        unit: childData.unit ?? type,
        parent: v.bom.parent,
        usage: v.bom.usage,
        version: v.bom.version,
        setting: v.bom.setting,
        stock: childData.stock,
        bom_lot_list: tmpRow,
        disturbance: (Number(row.good_quantity ?? 0)+Number(row.poor_quantity ?? 0)) * Number(v.bom.usage),
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : '-',
        bom: row.bom,
        product: v.bom.type === 2 ?{
          ...childData,
        }: null,
        raw_material: v.bom.type === 0 ?{
          ...childData,
        }: null,
        sub_material: v.bom.type === 1 ?{
          ...childData,
        }: null
      }
    })
    // }

    setSearchList([...tmpData])
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    const res = await RequestMethod('get', `machineSearch`,{
      path: {
        page: page,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res && res.status === 200){
      let searchList = res.results.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({
        ...pageInfo,
        page: res.results.page,
        total: res.results.totalPages,
      })

      setSearchList([...searchList])
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

  const getSummaryInfo = (info) => {
    return summaryData[info.key] ?? '-'
  }

  const ModalContents = () => {
    return <>
      <div style={{
        width: '100%'
      }}>
        <div style={{
          fontSize: '15px',
          margin: 0,
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: column.type === 'Modal' && '#0D0D0D',
          background:row.border ? "#19B9DF80" : column.type === 'Modal' ? "white" : '#0000',
        }} onClick={() => {
          setIsOpen(true)
        }}>
          <p style={{ textDecoration: 'underline', margin: 0, padding: 0}}>자재 보기</p>
        </div>
      </div>
    </>
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
              }}>투입 자재 정보 (해당 제품을 만드는데 사용할 자재는 아래와 같습니다)</p>
              <div style={{display: 'flex'}}>

                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                  setIsOpen(false)
                }}>
                  <img style={{width: 20, height: 20}} src={IcX}/>
                </div>
              </div>
            </div>
            {
              headerWorkItems && headerWorkItems.map((infos, index) => {
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
                                  <HeaderTableText>
                                    {getSummaryInfo(info)}
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
            <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}>투입 자재 리스트</p>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

              </div>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={column.type === 'readonly' ? searchModalList.InputListReadonly : searchModalList.InputList}
                  row={searchList ?? [{}]}
                  setRow={(e) => {
                    let tmp = e.map((v, index) => {
                      if(v.newTab === true){
                        const newTabIndex = bomDummy.length+1
                        addNewTab(newTabIndex)
                        setFocusIndex(newTabIndex-1)
                      }

                      if(v.lotList){
                        setSelectProduct(v.code)
                        setLotList([...v.lotList.map((v,i) => ({
                          ...v,
                          seq: i+1
                        }))])
                      }

                      return {
                        ...v,
                        lotList: undefined,
                        newTab: false
                      }
                    })
                    setSearchList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={288}
                  // setSelectRow={(e) => {
                  //   setSelectRow(e)
                  // }}
                  setSelectRow={(e) => {
                    setSelectRow(e)
                  }}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', height: 64}}>
              <div style={{height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
                <div style={{ display: 'flex', width: 1200}}>
                  <p style={{fontSize: 22, padding: 0, margin: 0}}>자재 LOT 리스트 ({selectProduct})</p>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

              </div>
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={column.type === 'readonly' ? searchModalList.InputLotReadonlyInfo : searchModalList.InputLotInfo}
                  row={lotList ?? [{}]}
                  setRow={(e) => {
                    let tmp = e.map((v, index) => {
                      if(v.newTab === true){
                        const newTabIndex = bomDummy.length+1
                        addNewTab(newTabIndex)
                        setFocusIndex(newTabIndex-1)
                      }

                      return {
                        ...v,
                        // spare: '여',
                        newTab: false
                      }
                    })
                    let tmpSearchList = [...searchList]
                    if(selectRow >= 0) {

                      tmpSearchList[selectRow] = {
                        ...tmpSearchList[selectRow],
                        lots: tmp
                      }
                    }
                    setSearchList([...tmpSearchList])
                    setLotList([...tmp])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={192}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            <div style={{ height: 56, display: 'flex', alignItems: 'flex-end'}}>
              {
                column.type !== 'readonly' && <div
                    onClick={() => {
                      setIsOpen(false)
                    }}
                    style={{width: '50%', height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                >
                  <p>취소</p>
                </div>
              }
              <div
                  onClick={() =>{
                    if(column.type === 'readonly'){
                      setIsOpen(false)
                    }else{
                      let bomList = []
                      let disturbance = 0
                      searchList.map((bom, index) => {
                        let totalAmount = 0
                        bom.lots?.map(lot => {
                          if(Number(lot.amount)){
                            totalAmount += Number(lot.amount)

                            if(Number(lot.amount) > lot.current){
                              Notiflix.Report.warning("생산량이 재고량보다 큽니다.", "", "확인")
                            }

                            bomList.push({
                              record_id: row.record_id,
                              ...row.input_bom[index],
                              lot: {
                                elapsed: lot.elapsed,
                                type: bom.tab,
                                child_lot_rm: bom.tab === 0 ? {...lot} : null,
                                child_lot_sm: bom.tab === 1 ? {...lot} : null,
                                child_lot_record: bom.tab === 2 ? {...lot} : null,
                                warehousing: lot.warehousing,
                                date: lot.date,
                                current: lot.current,
                                amount: Number(lot.amount) > lot.current ? 0 : lot.amount
                              }
                            })
                          }
                        })

                        if(totalAmount !== bom.disturbance){
                          disturbance += 1
                        }
                      })

                      if(disturbance === 0){
                        onRowChange({
                          ...row,
                          bom: bomList
                        })
                        setIsOpen(false)
                      }else{
                        Notiflix.Report.warning(`소요량과 생산량 합계를 일치시켜 주세요`, '', '확인')
                      }

                    }
                  }}
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


export {LotInputInfoModal}

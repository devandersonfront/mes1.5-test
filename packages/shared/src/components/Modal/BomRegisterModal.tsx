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
import {BomInfoModal} from './BomInfoModal'
import {TransferCodeToValue} from '../../common/TransferFunction'
import {useDispatch, useSelector} from 'react-redux'
import {change_summary_info_index, insert_summary_info, reset_summary_info} from '../../reducer/infoModal'
import {RootState} from '../../index'

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

const summaryDummy = {customer: '-', model: '-', code: 'SU-20210701-3', name:'SU900-1', type: 'type', unit: 'EA', goal: 50}


const BomRegisterModal = ({column, row, onRowChange}: IProps) => {
  const tabRef = useRef(null)
  const dispatch = useDispatch()
  const selector = useSelector((state:RootState) => state.infoModal)

  const [bomDummy, setBomDummy] = useState<any[]>([
    // {customer: '-', model: '-', code: 'SU-20210701-3', name:'SU900-1', type: 'type', unit: 'EA'},
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
      if(row.bom_root_id){
        SearchBasic().then(() => {
          // Notiflix.Loading.remove()
        })
      } else {
        setIsOpen(false)
        Notiflix.Report.warning("제품을 선택해 주세요.", "", "확인",)
      }
    }else{
      dispatch(reset_summary_info());
    }
  }, [isOpen, /*row*/])

  const setInfoModal = async (product: any, index: number) => {
    if(selector){
      await dispatch(insert_summary_info({
        code: product.code,
        title: product.name,
        data:[],
        headerData: {
          ...row.parent,
        }
      }))
    }
  }

  const changeRow = (tmpRow: any, key?: string) => {
    let tmpData = []
    let tmpRows = [];
    if(typeof tmpRow === 'string'){
      let tmpRowArray = tmpRow.split('\n')

      tmpRows = tmpRowArray.map(v => {
        if(v !== ""){
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v=>v)
    }else{
      tmpRows = [{...tmpRow}]
    }


    tmpData = tmpRows.map((v, i) => {
      let childData: any = {}
      switch(v.type){
        case 0:{
          childData = v.child_rm
          break;
        }
        case 1:{
          childData = v.child_sm
          break;
        }
        case 2:{
          childData = v.child_product
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
          type: TransferCodeToValue(v.parent.type, 'material'),
          unit: v.parent?.unit,
          goal: row.goal,
        })
      }

      return {
        ...childData,
        seq: i+1,
        code: childData.code,
        type: TransferCodeToValue(v.type, 'material'),
        tab: v.type,
        type_name: TransferCodeToValue(v.type, 'material'),
        unit: childData.unit ?? "-",
        parent: v.parent,
        usage: v.usage,
        version: v.version,
        setting: v.setting,
        stock: childData.stock,
        disturbance: Number(row.goal) * Number(v.usage),
        processArray: childData.process ?? null,
        process: childData.process ? childData.process.name : '-',
        // spare:'부',
        bom_root_id: childData.bom_root_id,
        product: v.type === 2 ?{
          ...childData,
        }: null,
        raw_material: v.type === 0 ?{
          ...childData,
        }: null,
        sub_material: v.type === 1 ?{
          ...childData,
        }: null,
      }
    })

    return tmpData
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
          dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
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

  const ModalContents = () => {
    return <>
      <div style={{
        width: '100%'
      }}>
        <div onClick={() => {
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
            }}>BOM 정보 (해당 제품을 만드는데 사용할 자재를 선택해주세요. 자재 정보가 없으면 BOM 수정 버튼을 눌러 BOM 정보를 수정해주세요)</p>
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
                            <HeaderTableText style={{fontWeight: 'bold'}}>{info.title ?? "-"}</HeaderTableText>
                          </HeaderTableTitle>
                          <HeaderTableTextInput style={{width: info.infoWidth}}>
                            <HeaderTableText>
                              {summaryData[info.key]}
                              {/*-*/}
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
              {tabs.map((v, i) => {
                return <TabBox ref={i === 0 ? tabRef : null} style={
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
              <BomInfoModal column={column} row={row} onRowChange={onRowChange} modify/>
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
          <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                dispatch(reset_summary_info())
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p style={{color: '#717C90'}}>취소</p>
            </div>
            <div
              onClick={() => {
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
                            child_rm: v.tab === 0 ? {...v.raw_material} : null,
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
                dispatch(reset_summary_info())
                setIsOpen(false)
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

export {BomRegisterModal}

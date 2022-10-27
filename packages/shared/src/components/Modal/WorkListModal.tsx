import React, {useEffect, useRef, useState} from 'react'
import {IExcelHeaderType} from '../../@types/type'
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
import {UploadButton} from "../../styles/styledComponents";
import Notiflix from "notiflix";
// @ts-ignore
import {SelectColumn} from "react-data-grid";
import {BarcodeDataType} from "../../common/barcodeType";
import {BarcodeModal} from "./BarcodeModal";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
  [
    {title: '수주번호', infoWidth: 144, key: 'contract_id'},
    {title: '지시 고유 번호', infoWidth: 144, key: 'identification'},
    {title: '거래처', infoWidth: 144, key: 'customer_id'},
    {title: '모델', infoWidth: 144, key: 'cm_id'},
  ],
  [
    {title: 'CODE', infoWidth: 144, key: 'code'},
    {title: '품명', infoWidth: 144, key: 'name'},
    {title: '품목 종류', infoWidth: 144, key: 'type'},
    {title: '생산 공정', infoWidth: 144, key: 'process_id'},
  ],
  [
    {title: '단위', infoWidth: 144, key: 'unit'},
    {title: '목표 생산량', infoWidth: 144, key: 'goal'},
    {title: '총 카운터', infoWidth: 144, key: 'total_counter'},
    {title: '총 양품 수량', infoWidth: 144, key: 'total_good_quantity'},
    {title: '총 불량 수량', infoWidth: 144, key: 'total_poor_quantity'},
  ],
]

type ModalType = {
  type : 'barcode' | 'quantity'
  isVisible : boolean
}

const WorkListModal = ({column, row, onRowChange}: IProps) => {
  const tabRef = useRef(null)

  const [bomDummy, setBomDummy] = useState<any[]>([
    // {code: 'SU-20210701-1', name: 'SU900-1', material_type: '반제품', process:'프레스', cavity: '1', unit: 'EA'},
  ])

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  // const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  const [focusIndex, setFocusIndex] = useState<number>(0)
  const [selectList, setSelectList] = useState<Set<number>>(new Set())
  const [barcodeData , setBarcodeData] = useState<BarcodeDataType[]>([])
  const [modal , setModal] = useState<ModalType>({
    type : 'barcode',
    isVisible : false
  })

  useEffect(() => {
    if(isOpen && row.os_id) {
      SearchBasic()
    }
  }, [isOpen,row.os_id])

  const convertJsonToArray = (tmpRow : any) => {
    const splitData = tmpRow.split('\n')
    const filterData = splitData.filter((data) => data !== "")
    return filterData.map((data)=> JSON.parse(data))
  }

  const convertData = (arrayData : any) => {
    return arrayData?.map((data,index)=>(
        {...data, seq: index + 1, sum : data.good_quantity + data.poor_quantity, worker_name: data.worker?.name,}
    ))
  }

  const changeRow = (tmpRow: any) => {
    return convertData((typeof tmpRow === 'string' ? convertJsonToArray(tmpRow) : [tmpRow]))
  }

  const SearchBasic = async () => {
    const res = await RequestMethod('get', `recordAll`,{
      params: {
        sheetIds: row.os_id
      }
    })
    if(res){
      let tmpList = changeRow(res)
      setSearchList([...tmpList?.map(v => {
        let random_id = Math.random()*1000;
        return {...row, ...v , id : `List_${random_id}`}
      })])
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
    return row[info.key] ?? '-'
  }

  const ModalContents = () => {
    return <>
        <UploadButton onClick={() => {
          setIsOpen(true)
        }} hoverColor={POINT_COLOR} haveId>
          <p style={{margin:0, padding: 0, textDecoration: 'underline'}}>이력 보기</p>
        </UploadButton>
    </>
  }

  const printBarcodes = async (barcodes : string[], ip : string) => {
    const convertBarcodes = barcodes.map((barcode)=>(filterBarcode(barcode)))
    convertBarcodes.map(async (data)=>{
      await requestPrintApi(ip,data)
    })
  }


  const printBarcode = async (barcode : string , ip : string) => {
    const convertBarcode = filterBarcode(barcode)
    await requestPrintApi(ip,convertBarcode)
  }

  const filterBarcode = (barcode : string) => {

    return {
      "functions":
          {"func0":{"checkLabelStatus":[]},
            "func1":{"clearBuffer":[]},
            "func2":{"drawBitmap":[barcode,20,0,800,0]},
            "func3":{"printBuffer":[]}
          }
    }
  }

  const requestPrintApi = async (clientIP,data) => {
    await fetch(`http://${clientIP}:18080/WebPrintSDK/Printer1`,{
      method : 'POST',
      headers : {
        'Content-Type' : 'application/x-www-form-urlencoded'
      },
      body : JSON.stringify(data)
    }).then((res)=>{
      Notiflix.Loading.remove(2000)
    }).catch((error) => {
      Notiflix.Loading.remove()
      if(error){
        Notiflix.Report.failure('프린터 없음', '프린터 연결을 확인해 주세요.', '확인')
        return false
      }
    })
  }

  const handleBarcode = async (dataurl: string[] | string, clientIP : string) => {
    typeof dataurl === 'string' ? await printBarcode(dataurl,clientIP) : await printBarcodes(dataurl,clientIP)
  }

  const handleModal = (type : 'barcode',isVisible) => {
    setModal({type , isVisible})
  }

  const getCheckItems= () => {
    const tempList = []
    searchList.map((data) => selectList.has(data.id) && tempList.push(data))
    return tempList
  }

  const convertBarcodeData = (items) => {

    const mainMachine = items.machines?.filter((machine)=>(machine.machine.type === 1))

    return items.map((item)=>(
        {
          material_id: item.productId,
          material_type: 5,
          material_lot_id : item.record_id,
          material_lot_number: item.lot_number,
          material_quantity : item.good_quantity,
          material_name: item.name ?? "-",
          material_code: item.code,
          material_customer: item.worker?.name ?? "-",
          material_model: item.model?.model ?? "-",
          material_machine_name : mainMachine?.length > 0 ? mainMachine[0]?.machine.name : null,
          material_size : null,
          material_texture : null,
          material_unit : null
        }
    ))
  }

  const openBarcodeModal = () => {
    if(selectList.size > 0){
      const items = getCheckItems()
      const convertedData = convertBarcodeData(items)
      setBarcodeData(convertedData)
      setModal({type : 'barcode' , isVisible : true})
    }else{
      Notiflix.Report.warning("경고", "데이터를 선택해주세요.", "확인")
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
            }}>작업 이력 보기</p>
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
          <div style={{width : '100%', display: 'flex', justifyContent: 'space-between', height: 64}}>
            <div style={{width : '100%' , height: '100%', display: 'flex', alignItems: 'flex-end', paddingLeft: 16,}}>
              <div style={{ display: 'flex', width: '100%' , alignItems : 'center' , justifyContent : 'space-between', marginBottom : 10}}>
                <p style={{fontSize: 22, padding: 0, margin: 0}}>작업 이력</p>
                <BarcodeButton onClick={openBarcodeModal}>바코드 미리보기</BarcodeButton>
              </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>

            </div>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              selectable
                headerList={[
                  SelectColumn,
                  ...searchModalList.workList
                ]}
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
                selectList={selectList}
                //@ts-ignore
                setSelectList={(p) => {
                  setSelectList(p as any)
                }}
            />
          </div>
          <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: "100%", height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>확인</p>
            </div>
          </div>
        </div>
      </Modal>
      <BarcodeModal
          title={'바코드 미리보기'}
          handleBarcode={handleBarcode}
          handleModal={handleModal}
          type={'record'}
          data={barcodeData}
          isVisible={modal.type === 'barcode' && modal.isVisible}
      />
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
  width: 110px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

const BarcodeButton = styled.button`
    height:32px;
    color:white;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    cursor: pointer;
    display:flex;
    justify-content:center;
    align-items:center;
    border: 0px;
`

export {WorkListModal}

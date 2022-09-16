import React, {useEffect, useState} from 'react'
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
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
import { TransferCodeToValue } from '../../common/TransferFunction'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const getApiType = (type: string) => {
  switch(type){
    case 'machine': return 'productToMachine'
    case 'mold': return 'productToMold'
    case 'tool': return 'productToTool'
    default: return
  }
}

const getKey = (type: string) => {
  switch(type){
    case 'machine': return 'machine_id'
    case 'mold': return 'mold_id'
    case 'tool': return 'tool_id'
    default: return
  }
}

const getDefaultSetting= (type: string, product:any, id: number) => {
  switch(type){
    case 'machine':
      return product.machines?.filter(machine => machine.machine.machine_id === id).map(machine => machine.setting)[0]
    case 'mold': return product.molds?.filter(mold => mold.mold.mold_id === id).map(mold => mold.setting)[0]
    case 'tool': return product.tools?.filter(tool => tool.tool.tool_id === id).map(tool => tool.setting)[0]
    default: return
  }
}

const getModule = (type:string) => ({
  key: getKey(type),
  apiType: getApiType(type),
  defaultSetting: (product: any, id: number) => getDefaultSetting(type, product, id)
})


const ProductInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchList, setSearchList] = useState<any[]>([])
  const module = getModule(column.type)

  useEffect(() => {
    if(isOpen) {
      loadData()
    }
  }, [isOpen])

  const toTableData = async (type: string, product: any) => {
    const defaultData = {
      customer: product.customer?.name ?? '-',
      model: product.model?.name ?? '-',
      code: product.code,
      name: product.name ?? '-',
      product_type: TransferCodeToValue(product.type, 'product'),
      unit: product.unit,
      stock: product.stock,
      spare: module.defaultSetting(product, row[module.key]) === 0 ? '스페어' : '기본'
    }
    switch(type){
      case 'tool': return {
       ...defaultData,
       average: await getToolAverage(product.product_id, row.tool_id)
      }

      default: return defaultData
    }
  }

  async function getToolAverage(productId:number, toolId:number) {
    const res = await RequestMethod("get", "toolAverage", {
      path:{
        product_id: productId,
        tool_id: toolId
      }
    })
    return res? res : 0.0
  }

  const loadData = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', module.apiType,{
      path: {
        id: row[module.key]
      }
    })

    if(res){
      if(res.length > 0) {
        const newSearchList = await Promise.all(await res.map(product => toTableData(column.type, product)))
        setSearchList(newSearchList)

      } else {
        Notiflix.Report.warning('경고', '품목이 없습니다.', '확인',() => setIsOpen(false))
      }
    }

    Notiflix.Loading.remove()
  }

  const ModalContents = () => (
      <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
        setIsOpen(true)
      }} hoverColor={"#19B9DF"} haveId>
        <p>품목 보기</p>
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
            height: 816,
            display:'flex', flexDirection:"column", justifyContent:"space-between"
          }}>
            <div style={{}}>

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
                }}>생산 품목 정보</p>
                <div style={{display: 'flex'}}>
                  <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                    setIsOpen(false)
                  }}>
                    <img style={{width: 20, height: 20}} src={IcX}/>
                  </div>
                </div>
              </div>
              {column.headerItems.map((items,index)=>{
                return <HeaderTable>
                  {
                    items.map(item => {
                      return (
                            <>
                              <HeaderTableTitle>
                                <HeaderTableText style={{fontWeight: 'bold'}}>{item.title}</HeaderTableText>
                              </HeaderTableTitle>
                              <HeaderTableTextInput style={{width: item.infoWidth}}>
                                <Tooltip placement={'rightTop'}
                                         overlay={
                                           <div style={{fontWeight : 'bold'}}>
                                             {!!row[item.key] ? row[item.key] : '-'}
                                           </div>
                                         } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                  <HeaderTableText>{!!row[item.key] ? row[item.key] : '-'}</HeaderTableText>
                                </Tooltip>
                              </HeaderTableTextInput>
                            </>
                        )
                    })
                  }
                </HeaderTable>
              })}
              <div style={{padding: '16px 16px 0 16px', width: 1776}}>
                <ExcelTable
                    headerList={column.type === 'tool' ? searchModalList.productToolInfo : searchModalList.productInfo}
                    row={searchList}
                    setRow={(e) => setSearchList([...e])}
                    width={1746}
                    rowHeight={32}
                    height={491}
                    type={'searchModal'}
                    headerAlign={'center'}
                />
              </div>
            </div>
                <div style={{height: 84, display: 'flex', alignItems: 'flex-end'}}>
                  <div
                      onClick={() => {
                        setIsOpen(false)
                      }}
                      style={{
                        width: "100%",
                        height: 40,
                        backgroundColor: POINT_COLOR,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                  >
                    <p>확인</p>
                  </div>
                </div>
            {/*}*/}
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
  margin-right: 62px;
  display: flex;
  align-items: center;
`

const HeaderTableText = styled.p`
  margin: 0;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {ProductInfoModal}

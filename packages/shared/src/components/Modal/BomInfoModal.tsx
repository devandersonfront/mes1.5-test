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
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
import {TransferCodeToValue} from '../../common/TransferFunction'
import {
  add_summary_info,
  change_summary_info_index,
  delete_summary_info,
  insert_summary_info,
  reset_summary_info
} from "../../reducer/infoModal";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import ModalButton from '../Buttons/ModalButton'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const BomInfoModal = ({column, row, onRowChange}: IProps) => {
  const tabRef = useRef(null)
  const tabStore = useSelector((rootState: RootState) => rootState.infoModal)
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>(undefined)
  const [searchList, setSearchList] = useState<any[]>([])
  const [headerData, setHeaderData] = useState<any>();

  useEffect(() => {
    if(isOpen) {
      setSelectRow(undefined)
      if(!!!row.bom_root_id) {
        const searchList = row.bom?.length > 0 ? changeRow(row.bom) : []
        setSearchList(searchList)
        dispatch(insert_summary_info({code: null, title: row.code, data: searchList, headerData: row}));
      } else {
        setSearchList([])
      }
      if(row.bom_root_id) {
        SearchBasic().then(() => {
          Notiflix.Loading.remove()
        })
      }
      setHeaderData(row)
    }else{
      dispatch(reset_summary_info());
    }
  }, [isOpen])

  useEffect(() => {
    if(isOpen) {
      const bomKey = tabStore?.datas[tabStore.index]?.code
      if(bomKey && tabStore.index !== 0){
        getModalData(bomKey)
      } else {
        setSearchList(tabStore?.datas[tabStore.index]?.data)
        setHeaderData(row)
      }
    }

  },[tabStore.index])


  const getModalData = async(bomKey: string) => {
      await RequestMethod("get", "bomLoad", {path: { key: bomKey }})
          .then((res) => {
            const result = changeRow(res);
            setSearchList(result)
            result.map((value, i) => {
              if(bomKey === value.parent.bom_root_id){
                setHeaderData(result[0].parent)
              }
            })
          })
  }


  const changeRow = (tmpRow: any, key?: string) => {
    let tmpData = []
    let row = [];
    if(typeof tmpRow === 'string') {
      let tmpRowArray = tmpRow.split('\n')
      row = tmpRowArray.map(v => {
        if (v !== "") {
          let tmp = JSON.parse(v)
          return tmp
        }
      }).filter(v => v)
    } else if(Array.isArray(tmpRow)){
      row = tmpRow
    } else {
      row = [tmpRow]
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
        name: childData.name,
        type_name: TransferCodeToValue(childData?.type, v.type === 0 ? "rawMaterial" : v.type === 1 ? "subMaterial" : "product"),
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
        setting:v.setting
      }
    })

    return tmpData
  }

  const SearchBasic = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', `bomLoad`,{path: { key: row.bom_root_id }})
    const searchList = changeRow(res)
    dispatch(insert_summary_info({code: row.bom_root_id, title: row.code, data: searchList, headerData: row}));
    setSearchList(searchList.length > 0 ? searchList : [])
  }


  // tab : 0 -> 원자재
  // tab : 1 -> 부자재
  // tab : 2 => 제품
  const checkDefaultSetting = () => {
    let rawDefault = null
    let subDefault = null
    let prodDefault = null

    searchList.map(row => {
      if(row.tab === 0 && !rawDefault){
        rawDefault = row.setting === 1
      }else if(row.tab === 1 && !subDefault){
        subDefault = row.setting === 1
      }else if(row.tab === 2 && !prodDefault){
        prodDefault = row.setting === 1
      }
    })

    return rawDefault !== false && subDefault !== false && prodDefault !== false
  }

  const filterList = () => {
    if(row.id?.includes('operation')){
      return searchList.map((v, i) => (
          {
            seq: i+1,
            parent: {
              ...row,
              additional: row.additional ?? [],
              process: row.processArray,
              model: row.model === '' ? null : row.modelData,
              type: row.type_id ?? row.type === '완제품' ? 2 : 1,
              product_id: typeof row.product_id === 'string' ? row.product.product_id : row.product_id ?? row.productId,
              code: row.code,
              customer: row.customer === '' || row.customer?.id === null ? null : row.customerData
            },
            child_product: v.tab === 2 ? {
              ...v.product,
              border:false
            } : null,
            child_rm: v.tab === 0 ? {
              ...v.raw_material,
              border:false,
              type:v.raw_material.type_id
            } : null,
            child_sm: v.tab === 1 ? {
              ...v.sub_material,
              border:false
            } : null,
            type: v.tab,
            key: row.bom_root_id,
            setting: v.setting,
            usage: v.usage,
            version: v.version
          }
      ))

    }else{
      if(!searchList.some(v => v.isChange)) return []
      return searchList.map((v, i) => (
          {
            seq: i+1,
            parent: {
              ...row,
              additional: row.additional ?? [],
              process: row.processArray,
              model: row.model?.id ? row.modal : null,
              type: row.type_id ?? row.type === '완제품' ? 2 : 1,
              product_id: typeof row.product_id === 'string' ? row.product.product_id : row.product_id ?? row.productId,
              code: row.code,
              work_standard_image: row.work_standard_image?.uuid,
              customer: row.customer === '' || row.customer?.id === null ? null : row.customer
            },
            child_product: v.tab === 2 ? {
              ...v.product,
              border: false
            } : null,
            child_rm: v.tab === 0 ? {
              ...v.raw_material,
              type:v.raw_material.type_id,
              border: false
            } : null,
            child_sm: v.tab === 1 ? {
              ...v.sub_material,
              border: false
            } : null,
            type: v.tab,
            key: row.bom_root_id,
            setting: v.setting,
            usage: v.usage?? 1,
            version: v.version
          }
      ))
    }
  }

  const executeValidation = () => {

    const hasNoData = searchList.length === 0
    const hasInvalidData = searchList.some(v => !v.rm_id && !v.sm_id && !v.product?.product_id)
    const hasDefaultSetting = checkDefaultSetting()

    if(hasNoData){
      throw("BOM은 하나라도 등록이 되어야합니다.")
    }else if(hasInvalidData){
      throw("데이터를 입력해주세요.")
    }else if(!hasDefaultSetting){
      throw("품목별 기본설정은 최소 한개 이상 필요합니다.")
    }
  }


  const SaveBasic = async () => {
      const body = filterList()
      if(body.length !== 0){
        const res = await RequestMethod('post', `bomSave`, body)
        if(res) {
          Notiflix.Report.success("저장되었습니다.","","확인", () => setIsOpen(false))
        }
      } else {
        setIsOpen(false)
      }
  }

  const ModalContents = () => {
    if(column.type === 'readonly' || row.bom_root_id || (column.type === 'bomRegister' && row.bom)){
      return(
          <UploadButton  onClick={() => {
            if (row.bom_root_id || (column.type === 'bomRegister' && row.bom)) {
              setIsOpen(true)
            } else {
              Notiflix.Report.warning("경고", "등록된 BOM 정보가 없습니다.", "확인", () => {
              })
            }
          }}
             hoverColor={'#19B9DF'} haveId status={column.modalType ? "modal" : "table"}
          >
            <p>BOM 보기</p>
          </UploadButton>
        )
    }else{
      return (
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
      )
    }
  }

  // 중복되는거 없는지 판단하자..
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

  const deleteTab = (index: number) => {
    if(tabStore.datas.length === 1 || index === 0) {
      return setIsOpen(false)
    }
    dispatch(delete_summary_info(index))
  }

  const getBomTab = () => {
    return tabStore.datas.map((v, i) => {
      return <TabBox ref={i === 0 ? tabRef : null} style={
        tabStore.index === i ? {
          backgroundColor: '#19B9DF',
          opacity: 1
        } : {
          backgroundColor: '#E7E9EB',
          opacity: 1
        }
      }>
        {
          //크롬처럼 탭 개수 많아졌을 경우 활성화된 탭은 x, 나머지는 타이틀 앞부분만
          tabRef.current && tabRef.current.clientWidth < 63 ?
            tabStore.index !== i ?
              <p onClick={() => dispatch(change_summary_info_index(i))}>{v.title}</p>
              :
              <div style={{cursor: 'pointer', marginLeft: 20, width: 20, height: 20}} onClick={() => {
                deleteTab(i)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            :
            <>
              <p onClick={() => {
                dispatch(change_summary_info_index(i));
              }}
                 style={{color: tabStore.index === i ? "white" : '#353B48'}}
              >{v.title}</p>
              <div style={{cursor: 'pointer', width: 20, height: 20}} onClick={() => {
                deleteTab(i)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </>
        }
      </TabBox>
    })
  }

  const getButtons = () => {
    return <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
      <Button onClick={() => {
        setSearchList(prev =>[
          ...prev,
          {
            setting: 1,
            seq: prev.length+1
          }
        ])
      }}>
        <p>행 추가</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === undefined || selectRow === 0){
          return;
        }else{
          let tmpRow = searchList.slice()
          let tmp = tmpRow[selectRow]
          tmpRow[selectRow] = {...tmpRow[selectRow - 1], seq: tmpRow[selectRow - 1].seq + 1, isChange: true}
          tmpRow[selectRow - 1] = {...tmp, seq: tmp.seq - 1, isChange: true}
          setSearchList(tmpRow)
          setSelectRow(selectRow-1)
        }
      }}>
        <p>위로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === searchList.length-1 || selectRow === undefined){
          return
        } else {
          let tmpRow = searchList.slice()
          let tmp = tmpRow[selectRow]
          tmpRow[selectRow] = {...tmpRow[selectRow + 1], seq: tmpRow[selectRow + 1].seq - 1, isChange: true}
          tmpRow[selectRow + 1] = {...tmp, seq: tmp.seq + 1, isChange: true}
          setSearchList(tmpRow)
          setSelectRow(selectRow + 1)
        }
      }}>
        <p>아래로</p>
      </Button>
      <Button style={{marginLeft: 16}} onClick={() => {
        if(selectRow === undefined){
          return Notiflix.Report.warning(
            '경고',
            '선택된 정보가 없습니다.',
            '확인',
          );
        } else {
          let tmpRow = [...searchList]
          tmpRow.splice(selectRow, 1)
          const filterRow = tmpRow.map((v , i)=>{
            return {...v , seq : i + 1, isChange:true}
          })
          setSearchList(filterRow)
          setSelectRow(undefined)
        }

      }}>
        <p>삭제</p>
      </Button>
    </div>
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
              }}>BOM 정보 {column.type === 'readonly' ? '' : '(해당 제품을 만드는데 필요한 BOM을 등록해주세요)'}</p>
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
                <HeaderTableText>{headerData && headerData.customer?.name ? headerData.customer?.name : row.customerArray ? row.customerArray.name : "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>모델</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{headerData && headerData.model?.model ? headerData.model?.model : row.modelArray ? row.modelArray.model : "-"}</HeaderTableText>
              </HeaderTableTextInput>
            </HeaderTable>
            <HeaderTable>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>CODE</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{headerData ? headerData.code ?? "-" :row.code ?? "-"}</HeaderTableText>
              </HeaderTableTextInput>
              <HeaderTableTitle>
                <HeaderTableText style={{fontWeight: 'bold'}}>품명</HeaderTableText>
              </HeaderTableTitle>
              <HeaderTableTextInput style={{width: 144}}>
                <HeaderTableText>{headerData && headerData.name ? headerData.name : row.name ?? "-"}</HeaderTableText>
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
                <HeaderTableText>{headerData ? headerData.process?.name ?? "-" : row.processArray ? row.processArray.name : "-"}</HeaderTableText>
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
                  {
                    getBomTab()
                  }
                </div>
              </div>
                {column.type !== "readonly" && tabStore.index === 0 && getButtons()}
            </div>
            <div style={{padding: '0 16px', width: 1776}}>
              <ExcelTable
                  headerList={column.type === "readonly" ?  searchModalList.readOnlyBomInfo : searchModalList.bomInfo(searchList, tabStore?.index)}
                  row={searchList ?? [{}]}
                  setRow={(e) => {
                    competeBom([...e])
                  }}
                  width={1746}
                  rowHeight={32}
                  height={552}
                  onRowClick={(clicked) => {
                    const e = searchList.indexOf(clicked)
                    if(!searchList[e].border){
                      const newSearchList = searchList.map((row,rowIdx) => ({
                        ...row,
                        border: rowIdx === e
                      }))
                      setSearchList(newSearchList)
                      setSelectRow(e)
                    }
                  }}
                  type={'searchModal'}
                  headerAlign={'center'}
              />
            </div>
            {
              column.type === 'readonly' ?
                <ModalButton buttonType={'readOnly'} closeButtonTitle={'확인'}
                             onClickCloseButton={() => setIsOpen(false)}/>
                :
                <ModalButton buttonType={'confirm'} onClickCloseButton={() => setIsOpen(false)}
                             closeButtonTitle={'취소'}
                             confirmButtonTitle={column.type !== 'readonly' && tabStore.index === 0 ? '등록하기' : '확인'}
                             onClickConfirmButton={() => {
                               if (column.type !== 'readonly' && tabStore.index === 0) {
                                 try{
                                   executeValidation()
                                   if (row.product_id) {
                                     SaveBasic()
                                   } else {
                                       onRowChange(
                                         column.type === "bomRegister" ?
                                           {
                                             ...row,
                                             isChange: true,
                                             bom: filterList()
                                           }
                                           :
                                           {
                                             ...row,
                                             ...searchList[selectRow],
                                             name: row.name,
                                             isChange: true
                                           }
                                       )
                                       Notiflix.Report.success("저장되었습니다.", "", "확인", () => setIsOpen(false))
                                     }
                                 } catch(errMsg){
                                   Notiflix.Report.warning("경고", errMsg, "확인")
                                 }
                               } else {
                                 setIsOpen(false)
                               }
                             }}/>
            }
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

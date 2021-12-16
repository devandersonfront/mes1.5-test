import React, {useEffect, useState} from 'react'
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
import {PaginationComponent}from '../Pagination/PaginationComponent'
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}


const DeviceInfoModal = ({column, row, onRowChange}: IProps) => {
  console.log("row : ", row)
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [searchList, setSearchList] = useState<any[]>([{seq: 1}])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })
  // console.log(row, column)
  useEffect(() => {
    if(isOpen) {
      // SearchBasic(searchKeyword, optionIndex, 1).then(() => {
      //   Notiflix.Loading.remove()
      // })
      if(row.devices !== undefined && row.devices !== null && row.devices.length > 0){
        console.log("row : ", row)
        const rowDevices = [];
        row.devices.map((device, index)=>{
          console.log("device : ", device)
          rowDevices.push({...device, seq:index+1, manager:device.manager?.name ?? "", manager_data:device.manager});

        })
        console.log("rowDevices : ", rowDevices)
        setSearchList(rowDevices);
      }
    }
  }, [isOpen, searchKeyword])
  // useEffect(() => {
  //   if(pageInfo.total > 1){
  //     SearchBasic(keyword, optionIndex, pageInfo.page).then(() => {
  //       Notiflix.Loading.remove()
  //     })
  //   }
  // }, [pageInfo.page])

  const changeRow = (row: any, key?: string) => {
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager ? row.manager.name : null
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)
    // const res = await RequestMethod('get', `machineDetailLoad`,{
    const res = await RequestMethod('get', `deviceSearch`,{
      path: {
        page: page,
        renderItem: 18,
      },
      params: {
        keyword: keyword ?? '',
        opt: option ?? 0
      }
    })

    if(res){
      let searchList = res.info_list.map((row: any, index: number) => {
        return changeRow(row)
      })

      setPageInfo({
        ...pageInfo,
        page: res.page,
        total: res.totalPages,
      })

      setSearchList([...searchList])
    }
  }

  const ModalContents = () => {

    if(row.devices?.length > 0){
      return (
          <>
            <div style={{
              padding: '3.5px 0px 0px 3.5px',
              width: '100%'
            }}>
              <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
                setIsOpen(true)
              }}>
                <p style={{color: 'white', textDecoration: 'underline'}}>주변장치 보기</p>
              </UploadButton>
            </div>
          </>
      )
    }else{
      return (<>
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%'
        }}>
        <UploadButton onClick={() => {
          setIsOpen(true)
        }}>
          <p>주변장치 등록</p>
        </UploadButton>
        </div>
      </>)

    }
  }

  const getManagerName = () => {
    if(row.manager){
      switch (typeof row.manager){
        case "string":

          return row.manager;
        case "object":


          return row.manager.name;
        default:
           return ""
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
          height: 816
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
            }}>주변장치 정보</p>
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
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>기계제조사</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.mfrName}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>기계 이름</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 770}}>
              <HeaderTableText>{row.name}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>기계종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.type}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>용접종류</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.weldingType}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>제조번호</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.mfrCode}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>담당자</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              {/*<HeaderTableText>{row.manager}</HeaderTableText>*/}
              <HeaderTableText>{getManagerName()}</HeaderTableText>
              {/*<HeaderTableText>{typeof row.manager == "object" ? row.manager.name : row.manager }</HeaderTableText>*/}
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>오버홀</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{row.interwork ? "유" : "무"}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
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
              if(selectRow === 0){
                return
              }
              let tmpRow = searchList

              let tmp = tmpRow[selectRow]
              tmpRow[selectRow] = tmpRow[selectRow - 1]
              tmpRow[selectRow - 1] = tmp

              setSearchList([...tmpRow.map((v, i) => {
                return {
                  ...v,
                  seq: i+1
                }
              })])
            }}>
              <p>위로</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              if(selectRow === searchList.length-1){
                return
              }
              let tmpRow = searchList

              let tmp = tmpRow[selectRow]
              tmpRow[selectRow] = tmpRow[selectRow + 1]
              tmpRow[selectRow + 1] = tmp

              setSearchList([...tmpRow.map((v, i) => {
                return {
                  ...v,
                  seq: i+1
                }
              })])
            }}>
              <p>아래로</p>
            </Button>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={searchModalList.deviceInfo}
              row={searchList ?? [{}]}
              setRow={(e) => {
                console.log(e)
                searchList[selectRow].device =
                setSearchList([...e])
              }}
              width={1746}
              rowHeight={32}
              height={560}
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
          <div style={{ height: 84, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
              }}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                console.log(row)
                if(selectRow !== undefined && selectRow !== null){
                  // console.log(row, searchList[selectRow], )
                  onRowChange({
                    ...row,
                    // ...searchList[selectRow],
                    machine_idPK:row.machine_id,
                    name: row.name,
                    devices:searchList.map((device)=>{
                      const tmpDevice = {...device};
                      tmpDevice.manager = device.manager_data;

                      return tmpDevice
                    }),
                    isChange: true,
                  })
                }
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
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {DeviceInfoModal}

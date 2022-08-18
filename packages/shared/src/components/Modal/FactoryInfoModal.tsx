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
// @ts-ignore
import {SelectColumn} from 'react-data-grid'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const FactoryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [selectRow, setSelectRow] = useState<number>(-1)
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [searchList, setSearchList] = useState<any[]>([])
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      if(!row.factory_id){
        Notiflix.Report.warning("경고","공장을 먼저 등록해주시기 바랍니다.","확인", () => onCloseEvent());
      }else {
        getData()
      }
    }
  }, [isOpen])


  const changeRow = (row: any, i : number) => {
    let random_id = Math.random()*1000;
    return{
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager,
      manager_name: row.manager?.name,
      appointment: row.manager?.appointment,
      telephone:row.manager?.telephone,
      id: `subFactory_${random_id}`,
      seq : i + 1
    }
  }

  const getData = async (page: number = 1) => {
    Notiflix.Loading.circle()

    const res = await RequestMethod('get', `subFactoryList`,{
      path: {
        factory_id: row.factory_id,
        page: page,
        renderItem: 18,
      },
      params: {
        sorts:"seq"
      }
    })

    if (res.totalPages > 0 && res.totalPages < res.page) {
      getData(1);
    } else {
      const searchList = res.info_list.map((row: any, index: number) => changeRow(row, index))
      setPageInfo({
        page: res.page,
        total: res.totalPages
      })
      setSearchList(searchList)
    }
    Notiflix.Loading.remove()
  }

  const saveSubFactory = async () => {
    Notiflix.Loading.circle();
    const filterList = searchList.map((list)=>{
      if(!list.name){
        Notiflix.Report.warning("경고","세분화명을 입력해주세요.","확인")
        return
      }else{
        return {...list , factory_id : row.factory_id, manager: list.manager?.user_id ? list.manager : list.user?.user_id ? list.user : null}
      }
    })

    if(filterList){
      await RequestMethod("post", "subFactorySave", filterList)
          .then((res) => {
            onRowChange({...row, subFactories:filterList})
            Notiflix.Loading.remove(300);
            Notiflix.Report.success("확인","저장되었습니다.","확인",() => onCloseEvent())
          })
          .catch((err) => {
            if(err.response?.status === 300){
              Notiflix.Loading.remove(300);
              Notiflix.Report.failure("경고","예상치 못한 에러가 발생했습니다.","확인", () => onCloseEvent())
            }else if(err.response?.status === 209){
              Notiflix.Loading.remove(300);
              Notiflix.Report.failure("경고", err.response.data.message,"확인",() => onCloseEvent())
            }
          })
    }else {
            Notiflix.Loading.remove(300);
            Notiflix.Report.failure("경고","공장을 먼저 등록해주시기 바랍니다.","확인",() => onCloseEvent())
    }
  }

  const deleteSubFactory = async () => {
    if(selectRow === -1){
      return Notiflix.Report.warning('오류', '삭제를 하기위해서는 선택을 해주세요', '확인')
    }
    if(searchList[selectRow]?.sf_id){
      Notiflix.Confirm.show(
        '행 삭제',
        '행을 삭제 하시겠습니까?',
        'Yes',
        'No',
        async () => {

          await RequestMethod("delete", "subFactoryDelete",[searchList[selectRow]])
          .then((res)=>{
            Notiflix.Report.success("확인", "삭제되었습니다.", "확인" ,() =>getData(1))
          })
        },
      );
    } else {
      let tmpRow = [...searchList]
      tmpRow.splice(selectRow, 1)
      setSearchList(tmpRow.map((v, i) => {
        return {
          ...v,
          seq: i+1
        }
      }))
      setSelectRow(-1)
    }
  }
  const ModalContents = () => (
        <div>
          <UploadButton onClick={() => {
            setIsOpen(true)
          }}
            hoverColor={POINT_COLOR}
            haveId={row.subFactories?.length}
          >
            <p>{row.subFactories?.length ? "세분화 보기" : "세분화 등록"}</p>
          </UploadButton>
        </div>

    )
  const changeData = (key:string) => {
    return !!row[key] ? row[key] : "-"
  }

  const onCloseEvent = () => {
    setIsOpen(false)
    setSelectRow(-1)
    setSelectList(new Set())
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
            }}>공장 정보</p>
            <div style={{display: 'flex'}}>
              {/*<Button>*/}
              {/*  <p>엑셀로 받기</p>*/}
              {/*</Button>*/}
              <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                setIsOpen(false)
              }}>
                <img style={{width: 20, height: 20}} src={IcX}/>
              </div>
            </div>
          </div>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>공장명</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{changeData("name")}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>공장 주소</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 786}}>
              <HeaderTableText>{changeData("address")}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>담당자</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{changeData("manager")}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>직책</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 144}}>
              <HeaderTableText>{changeData("appointment")}</HeaderTableText>
            </HeaderTableTextInput>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>전화번호</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 480}}>
              <HeaderTableText>{changeData("telephone")}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <HeaderTable>
            <HeaderTableTitle>
              <HeaderTableText style={{fontWeight: 'bold'}}>비고</HeaderTableText>
            </HeaderTableTitle>
            <HeaderTableTextInput style={{width: 1090}}>
              <HeaderTableText>{changeData("description")}</HeaderTableText>
            </HeaderTableTextInput>
          </HeaderTable>
          <div style={{display: 'flex', justifyContent: 'flex-end', margin: '24px 48px 8px 0'}}>
            <Button onClick={() => {
              let random_id = Math.random()*1000;
              setSearchList([
                ...searchList,
                {
                  seq: searchList.length+1,
                  id: `subFactory_${random_id}`,
                }
              ])
            }}>
              <p>행 추가</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              if(selectRow === 0){
                return
              }
              let tmpRow = [...searchList]

              let tmp = tmpRow[selectRow]
              tmpRow[selectRow] = tmpRow[selectRow - 1]
              tmpRow[selectRow - 1] = tmp
              setSelectRow((prevSelectRow)=> prevSelectRow - 1)
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

              if(selectRow > -1){
                if(selectRow === searchList.length-1){
                  return
                }

                let tmpRow = [...searchList]
                let tmp = tmpRow[selectRow]
                tmpRow[selectRow] = tmpRow[selectRow + 1]
                tmpRow[selectRow + 1] = tmp
                setSelectRow((prevSelectRow)=> prevSelectRow + 1)
                setSearchList([...tmpRow.map((v, i) => {
                  return {
                    ...v,
                    seq: i+1
                  }
                })])
              }
            }}>
              <p>아래로</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              let tmpRow = [...searchList]
              deleteSubFactory()
            }}>
              <p>삭제</p>
            </Button>
          </div>
          <div style={{padding: '0 16px', width: 1776}}>
            <ExcelTable
              headerList={[
                  ...searchModalList.factoryInfo
              ]}

              row={searchList ?? [{}]}
              setRow={(e) => {
                let tmp: Set<any> = selectList
                const newSearchList = e.map(v => {
                  if(v.isChange) {
                            tmp.add(v.id)
                            v.isChange = false
                  }
                  return {
                    ...v,
                    noneSelected: false
                  }
                })
                setSelectList(tmp)
                setSearchList(newSearchList)
              }}
              width={1746}
              rowHeight={32}
              height={568}
              selectList={selectList}
              setSelectList={(e) => {
                setSelectList(e as Set<number>);
              }}
              onRowClick={(clicked) => {const e = searchList.indexOf(clicked)

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
              onClick={onCloseEvent}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                saveSubFactory();
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
  height:100%;
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
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex; 
  align-items: center;
`

export {FactoryInfoModal}

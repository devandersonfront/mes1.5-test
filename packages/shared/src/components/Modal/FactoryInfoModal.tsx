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
import Notiflix from 'notiflix'
import {UploadButton} from '../../styles/styledComponents'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'

interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const optionList = ['제조번호','제조사명','기계명','','담당자명']

const FactoryInfoModal = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [title, setTitle] = useState<string>('기계')
  const [optionIndex, setOptionIndex] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [selectRow, setSelectRow] = useState<number>()
  const [selectList, setSelectList] = useState<Set<number>>(new Set());
  const [searchList, setSearchList] = useState<any[]>([])
  const [searchKeyword, setSearchKeyword] = useState<string>('')
  const [pageInfo, setPageInfo] = useState<{page: number, total: number}>({
    page: 1,
    total: 1
  })

  useEffect(() => {
    if(isOpen) {
      if(!row.factory_id){
        Notiflix.Report.warning("경고","공장을 먼저 등록해주시기 바랍니다.","확인", () => setIsOpen(false));
      }
      SearchBasic(searchKeyword, optionIndex, 1).then(() => {
        Notiflix.Loading.remove()
      })
    }
  }, [isOpen, searchKeyword])


  const changeRow = (row: any, key?: string) => {
    let random_id = Math.random()*1000;
    let tmpData = {
      ...row,
      machine_id: row.name,
      machine_idPK: row.machine_id,
      manager: row.manager,
      manager_name: row.manager?.name,
      appointment: row.manager?.appointment,
      telephone:row.manager?.telephone,
      id: `subFactory_${random_id}`
    }

    return tmpData
  }

  const SearchBasic = async (keyword: any, option: number, page: number) => {
    Notiflix.Loading.circle()
    setKeyword(keyword)
    setOptionIndex(option)

    if(!row.factory_id && !row.factory?.factory_id){
      return
    }

    const res = await RequestMethod('get', `subFactoryList`,{
      path: {
        factory_id: column.type === "subFactory" ? row.factory.factory_id : row.factory_id,
        // factory_id: row.factory_id,
        page: page,
        renderItem: 18,
      },
      params: {
        sorts:"name"
      }
    })

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
  const saveSubFactory = async () => {
    Notiflix.Loading.standard();
    let result = [];

    //row.factory_id
    //seq
    //name
    //manager:{
    // user_id : searchList.userId
    // name : searchList.name
    // appointment : searchList.appointment
    // telephone: searchList.telephone
    // email : searchList.email
    // id : searchList..id
    // additional : searchList.additional
    //}
    //description :


    const filterList = searchList.map((list)=>{
      if(!list.manager){
        return {...list, manager : list.manager_info , managerId : list.manager_info?.user_id}
      }else{
        return list
      }
    })



    if(filterList){
      await RequestMethod("post", "subFactorySave", filterList)
          .then((res) => {
            onRowChange({...row, subFactories:filterList})
            Notiflix.Loading.remove(300);
            Notiflix.Report.success("확인","저장되었습니다.","확인",() => setIsOpen(false))

          })
          .catch((err) => {
            Notiflix.Loading.remove(300);
            Notiflix.Report.failure("경고","예상치 못한 에러가 발생했습니다.","확인",() => setIsOpen(false))
          })
    }else {
            Notiflix.Loading.remove(300);
            Notiflix.Report.failure("경고","공장을 먼저 등록해주시기 바랍니다.","확인",() => setIsOpen(false))
    }
  }

  const deleteSubFactory = async() => {
    // Notiflix.Loading.standard();

    const deleteRows = [];

    searchList.map((row)=>{
      if(selectList.has(row.id)){
          deleteRows.push(row);
      }
    })

    await RequestMethod("delete", "subFactoryDelete",deleteRows.filter((row)=> row.sf_id))
        .then((res)=>{
          Notiflix.Report.success("확인", "삭제되었습니다.", "확인" ,() =>{
            SearchBasic(searchKeyword, optionIndex, 1).then(() => {
              Notiflix.Loading.remove()
            });
          })
        })
        .catch((err) => {

        })
  }
  const ModalContents = () => {
    if(row.subFactories && row.subFactories.length > 0){
      return (<>
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%'
        }}>
          <UploadButton style={{width: '100%', backgroundColor: '#ffffff00'}} onClick={() => {
            setIsOpen(true)
          }}>
            <p style={{color: 'white', textDecoration: 'underline'}}>세분화 보기</p>
          </UploadButton>
        </div>
      </>)
    }else{
      return (<>
        <div style={{
          padding: '3.5px 0px 0px 3.5px',
          width: '100%'
        }}>
        <UploadButton onClick={() => {
          setIsOpen(true)
        }}>
          <p>세분화 등록</p>
        </UploadButton>
        </div>
      </>)

    }
  }

  const changeData = (key:string) => {
    if(column.type === "subFactory" && row.factory){
      return row["factory"].key
    }else{
      return row[key]
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
              <HeaderTableText>{changeData("description") ?? "-"}</HeaderTableText>
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
              let tmp = searchList

              deleteSubFactory()
              // setSearchList([
              //   ...searchList,
              //   {
              //     seq: searchList.length-1
              //   }
              // ])
            }}>
              <p>행 삭제</p>
            </Button>
            <Button style={{marginLeft: 16}} onClick={() => {
              if(selectRow === 0){
                return
              }
              let tmpRow = [...searchList]

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
              let tmpRow = [...searchList]

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
              headerList={[
                  SelectColumn,
                  ...searchModalList.factoryInfo
              ]}

              row={searchList ?? [{}]}
              setRow={(e) => {

                let tmp: Set<any> = selectList
                e.map(v => {
                  if(v.isChange) tmp.add(v.id)
                })
                setSelectList(tmp)

                // e.map((v)=>{
                //   v.manager_name = v.manager?.name;
                //   v.appointment = v.manager?.appointment;
                //   v.telephone = v.manager?.telephone;
                // })

                setSearchList([...e])
              }}
              width={1746}
              rowHeight={32}
              height={568}
              // setSelectRow={(e) => {
              //   setSelectRow(e)
              // }}
              selectList={selectList}
              setSelectList={(e) => {
                setSelectList(e as Set<number>);
              }}
              setSelectRow={(e) => {

                if(!searchList[e].border){
                  searchList.map((v,i)=>{
                    v.border = false;
                  })
                  searchList[e].border = true
                  setSearchList([...searchList])
                }
                // if(selectList.has(searchList[e].id)){
                //   selectList.delete(searchList[e].id)
                // }else{
                //   selectList.add(searchList[e].id)
                // }
                // setSelectList(selectList);
                setSelectRow(e)
              }}

              type={'searchModal'}
              headerAlign={'center'}
            />
          </div>
          <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
            <div
              onClick={() => {
                setIsOpen(false)
                setSelectList(new Set())
              }}
              style={{width: 888, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
              <p>취소</p>
            </div>
            <div
              onClick={() => {
                saveSubFactory();
                setSelectList(new Set())
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

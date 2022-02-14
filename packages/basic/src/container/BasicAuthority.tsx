import React, {useEffect, useState} from 'react'
import {ExcelTable, Header as PageHeader, RequestMethod, TextEditor} from 'shared'
// @ts-ignore
import {SelectColumn} from 'react-data-grid'
import Notiflix from "notiflix";
import {useRouter} from 'next/router'
import TreeViewTable from '../../../main/component/TreeView/TreeView'
import {IMenu} from '../../../main/common/@types/type'
import {AUTHORITY_LIST} from '../../../main/common/configset'
import {AxiosResponse} from 'axios'
import styled from 'styled-components'

export interface IProps {
  children?: any
  page?: number
  keyword?: string
  option?: number
}

const title = '권한 관리'

const BasicAuthority = ({page, keyword, option}: IProps) => {
  const [row, setRow] = useState<Array<any>>([])
  const [auth, setAuth] = useState<Array<IMenu>>(AUTHORITY_LIST)
  const [selectIndex, setSelectIndex] = useState<number>(-1)

  const router = useRouter()

  useEffect(() => {
    loadAuthorityList().then(() => Notiflix.Loading.remove())
  }, [])

  const loadAuthorityList = async () => {
    Notiflix.Loading.circle()
    const res = await RequestMethod('get', 'authorityAll')

    if(res) {
      setRow([...res])
    }
  }

  const changeListToAuth = (list: string[]) => {
    let tmpMenu = auth
    const MenuDivide = (dmenu: IMenu) => {
      let tmp = dmenu
      if (tmp.value) tmp.check = list.indexOf(tmp.value) !== -1;
      // using stack structure, recursively add authorities

      tmp.child = tmp.child.map(inner => MenuDivide(inner))

      let cnt = 0
      if (tmp.child.length !== 0) {
        tmp.child.map(inner => {
          if (inner.check) cnt++
        })
        tmp.check = tmp.child.length === cnt;
      }

      return tmp
    }

    tmpMenu = tmpMenu.map(menu => MenuDivide(menu))
    setAuth([...tmpMenu])
  }

  const changeAuthToList = (index: number) => {
    let tmpAuth: string[] = []

    const checkAuth = (dmenu: IMenu) => {
      if(dmenu.value && dmenu.checkable && dmenu.check) {
        tmpAuth.push(dmenu.value)
      }

      dmenu.child.map(inner => {
        return checkAuth(inner)
      })
    }

    auth.map(menu => {
      checkAuth(menu)
    })

    return tmpAuth
  }

  const updateAuth = async (data: any) => {
    if(data.ca_id){
      const updatedAuthorities = changeAuthToList(data.authorities)
      await RequestMethod('post', 'authoritySave', {
        ...data,
        authorities: updatedAuthorities
      }).then(async (res: AxiosResponse) => {
        if (res){
          await new Promise((resolve) => {
            changeListToAuth(updatedAuthorities)
            // update row datum
            let temporaryRows = row
            temporaryRows[selectIndex].authorities = updatedAuthorities
            setRow([ ...temporaryRows])
            resolve(true)
          }).then(() =>Notiflix.Report.success('저장 성공!', '권한이 성공적으로 변경됐습니다.', '확인', () => {
            loadAuthorityList().then(() => Notiflix.Loading.remove())
          }))
        }
      })
    }
  }

  const createAuth = async (data: any) => {

    if(data){
      const addedAuthorities = changeAuthToList(data.authorities)
      const res = await RequestMethod('post', 'authoritySave', {
        ca_id: undefined,
        name: data.name,
        authorities: addedAuthorities
      })

      if (res){
        await new Promise((resolve) => {
          changeListToAuth(addedAuthorities)
          // update row datum
          let temporaryRows = row
          temporaryRows[selectIndex].authorities = addedAuthorities
          setRow([ ...temporaryRows])
          resolve(true)
        }).then(() => Notiflix.Report.success('저장 성공!', '권한이 성공적으로 등록됐습니다.', '확인', () => {
          loadAuthorityList().then(() => Notiflix.Loading.remove())
        }))
      }
    } else {
      Notiflix.Report.failure('권한 없음', '권한을 선택해주세요', '확인')
    }
  }


  const deleteAuth = () =>  {
    if(selectIndex === -1){
      return Notiflix.Notify.warning('삭제를 하기 위해서는 선택을 해주세요')
    }

    if(row[selectIndex]?.ca_id){
      Notiflix.Confirm.show(
        '권한명 삭제',
        '권한명을 삭제 하시겠습니까?',
        'Yes',
        'No',
        async () => {
          const res = await RequestMethod('delete', 'authorityDelete', [row[selectIndex]])
          if (res){
            Notiflix.Report.success('삭제 성공!', '권한이 성공적으로 삭제됐습니다.', '확인', () => {
              loadAuthorityList().then(() => {
                Notiflix.Loading.remove()
              })
            })
          }
        },
      );
    } else {
      let tmpRow = [...row]
      tmpRow.splice(selectIndex, 1)
      setRow([...tmpRow])
    }
  }

  const addRow = () => {

    const tempRow = [...row]
    tempRow.unshift({ca_id: "",name: '',authorities: []})
    setRow(tempRow)

  }

  const leftButtonOnClick = (index: number) => {
    switch(index){
      case 0:
        return addRow()
      case 1:

        return deleteAuth()
    }
  }

  const saveAppointmentAuthorityDetails = async () => {
    Notiflix.Loading.hourglass('권한을 저장하고 있습니다..')
    new Promise( async (resolve) => {
      if (selectIndex !== -1 && row[selectIndex].ca_id) {
        await updateAuth(row[selectIndex])
      } else {
        await createAuth(row[selectIndex])
      }
      resolve(true)
    }).then(() => Notiflix.Loading.remove(1000))


  }

  const competeAuthority = (rows) => {

      const tempRow = [...rows]
      const spliceRow = [...rows]

      spliceRow.splice(selectIndex, 1)
      if(spliceRow){
        if(spliceRow.some((row)=> row.name.toUpperCase() === tempRow[selectIndex].name.toUpperCase())){
          return Notiflix.Report.warning(
            '권한명 경고',
            `중복되는 권한명이 존재합니다.`,
            'Okay'
          );
        }
      }

      setRow(rows)
  }

  return (
    <div>
      <PageHeader
        title={title}
        buttonsOnclick={saveAppointmentAuthorityDetails}
        leftButtonOnClick={leftButtonOnClick}
      />
      <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: 40, marginBottom: 16}}>
        <div style={{display: 'flex'}}>
          <HeaderButton style={{marginLeft: 0}} onClick={() => addRow()}>
            {'행추가'}
          </HeaderButton>
          <HeaderButton onClick={() => deleteAuth()}>
            {'삭제'}
          </HeaderButton>
        </div>
        <div>
          <HeaderButton onClick={() => saveAppointmentAuthorityDetails()}>
            {'저장하기'}
          </HeaderButton>
        </div>
      </div>
      <div style={{display: 'flex'}}>
        <div style={{marginRight: 30}}>
          <ExcelTable
            clickable
            width={280}
            headerList={[{key: 'name', width: 280, name: '권한명(필수)', editor: TextEditor}]}
            row={row}
            setRow={(row) => competeAuthority(row)}
            setSelectRow={(index) => {
              changeListToAuth(row[index].authorities ?? [])
              setSelectIndex(index)
              setRow([...row.map((v, i) => {
                if(index === i){
                  return {
                    ...v,
                    border: true,
                  }
                }else{
                  return {
                    ...v,
                    border: false,
                  }
                }
              })])
            }}
          />
        </div>
        <TreeViewTable item={auth} setItem={setAuth} selectIndex={selectIndex}/>
      </div>
    </div>
  );
}

const HeaderButton = styled.button`
    height:32px;
    color:white;
    border-radius:6px;
    font-size:15px;
    font-weight:bold;
    background:#717C90;
    padding: 0 20px;
    cursor: pointer;
    display:flex;
    margin-left: 16px;
    justify-content:center;
    align-items:center;
`;

export {BasicAuthority};

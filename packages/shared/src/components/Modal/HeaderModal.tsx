import React  from 'react'
import styled from 'styled-components'
//@ts-ignore
import IcSearchButton from '../../../public/images/ic_search.png'
//@ts-ignore
import IcX from '../../../public/images/ic_x.png'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import { BaseModal } from './BaseModal'
import CloseButton from '../Buttons/CloseButton'
import ModalButton from '../Buttons/ModalButton'
import Styled from 'styled-components'
import { POINT_COLOR } from '../../common/configset'
import { UploadButton } from '../../styles/styledComponents'


const HeaderModal = (props) => {
  // const headers = [
  //   [
  //     {key:'거래처', value: row.customer_id ?? '-'},
  //     {key:'모델', value:  row.cm_id ?? '-'},
  //   ],
  //   [
  //     {key:'CODE', value: row.code ?? '-'},
  //     {key:'품명', value: row.name ?? '-'},
  //     {key:'품목 종류', value: row.type ?? '-'}
  //   ],
  //   [
  //     {key:'단위', value: row.unit ?? '-'},
  //     {key:'재고량', value: row.stock ?? 0}
  //   ]
  // ]

  const Headers = () => (
    props.headers.map(header =>
      <HeaderTable>
        {
          header.map(headerItem => {
            if(headerItem){
              return <>
                <HeaderTableTitle>
                  <HeaderTableText style={{fontWeight: 'bold'}}>{headerItem.key}</HeaderTableText>
                </HeaderTableTitle>
                <HeaderTableTextInput style={{width: 144}}>
                  <Tooltip placement={'rightTop'}
                           overlay={
                             <div style={{fontWeight : 'bold'}}>
                               {headerItem.value}
                             </div>
                           } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                    <HeaderTableText>{headerItem.value}</HeaderTableText>
                  </Tooltip>
                </HeaderTableTextInput>
              </>
            }
          })
        }
      </HeaderTable>
    )
  )

  return (
    <Wrapper>
      {
        props.interface
      }
      <BaseModal isOpen={props.isOpen} style={{ content: {height: 816, width: 1776}}}>
        <Header>
          <div style={{
            padding: '16px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <p style={{
              color: 'black',
              fontSize: 22,
              fontWeight: 'bold',
              margin: 0,
            }}>{props.modalTitle}</p>
            <CloseButton onClick={props.onClose}/>
          </div>
          <div>
          {
            Headers()
          }
          </div>
        </Header>
        {
          props.children
        }
        <ModalButton buttonType={'readOnly'} closeButtonTitle={'확인'} onClickCloseButton={props.onClose}/>
      </BaseModal>
      </Wrapper>
  )
}

const Wrapper = Styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
`

const Header = Styled.div`

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
  white-space: nowrap;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {HeaderModal}

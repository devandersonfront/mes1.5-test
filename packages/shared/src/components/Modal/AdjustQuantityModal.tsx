import React, { useRef, useState } from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
//@ts-ignore
import Barcode from 'react-barcode';
import Notiflix from "notiflix";
import { BaseModal } from './BaseModal'
import { CellButton } from '../../styles/styledComponents'
import { IExcelHeaderType } from '../../@types/type'
import CloseIcon from '../../../public/images/xmark-solid.svg'
import PlusIcon from '../../../public/images/plus-solid.svg'
import MinusIcon from '../../../public/images/minus-solid.svg'
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}
const AdjustQuantityModal = ({column, row, onRowChange}:IProps) => {

    const [ quantity , setQuantity ] = useState<number | undefined>()
    const [isOpen, setIsOpen] = useState<boolean>(false)

  const onChange = (event) => {
        setQuantity(event.target.value.replace(/[^0-9]/g, ""))
    }

    const onClose = () => {
      setQuantity(undefined)
      setIsOpen(false)
    }

    const onConfirm = () => {
        if(quantity > 0){
            setQuantity(undefined)
        }else{
            Notiflix.Report.warning('주의','수량을 입력해주세요','확인')
        }
    }


    return(
      <>
        <CellButton onClick={() => {setIsOpen(true)}}>
          {column.modalTitle}
        </CellButton>
        <BaseModal isOpen={isOpen} style={{ content: {height: 300, width: 450}}}>
          <ModalContent>
                <ModalHeader>
                  <div>
                    <p style={{fontWeight:'bold',fontSize: 25, margin:0}}>재고 조정</p>
                    <p style={{fontSize : 18, opacity: .5, margin:0, width:300, whiteSpace:'nowrap',textOverflow: 'ellipsis', overflow:'hidden'}}>CODE : {row.code}</p>
                  </div>
                  <div>
                  <img onClick={onClose} src={CloseIcon} style={{opacity: .5,height: '2em', width: '2em', cursor: 'pointer'}}></img>
                  </div>
                </ModalHeader>
                <Divider/>
                <ModalBody>
                  <CounterBox>
                    <Img src={MinusIcon}></Img>
                    <input
                      style={{height: '2.5em', width: '3.3em',textAlign:'center', fontSize: '1.5em', margin: '0 1.3em', borderRadius: '0.5em', border: 'solid 0.1em #E1E1E1'}}
                      type={'number'}
                      placeholder={'0'}
                      onChange={onChange}
                      value={quantity}
                      maxLength={6}
                    />
                    <Img src={PlusIcon}></Img>
                  </CounterBox>
                  <ButtonBox>
                    <Button color={'#19B9DF'} onClick={onConfirm}>확인</Button>
                  </ButtonBox>
                </ModalBody>
          </ModalContent>
        </BaseModal>
      </>
    )
}


export {AdjustQuantityModal}
const ModalContent = Styled.div`
    flex:1;
    display : flex;
    flex-direction: column;
    justify-content : space-between;
`

const ModalHeader = Styled.div`
    flex: 1;
    display : flex;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
`
const Divider = Styled.hr`
    width: 100%;
    margin: 0;
    opacity: .5;
`

const ModalBody = Styled.div`
    flex: 3.5;
    display : flex;
    flex-direction: column;
    justify-content: space-around;
`

const CounterBox = Styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`

const ButtonBox = Styled.div`
    display : flex;
    justify-content : center;
`
const Img = Styled.img`
      height: 2.5em;
      width: 2.5em;
      background-color: #EEEEEE;
      border-radius: 50%;
      padding: 0.5em;
      opacity: .5;
`


const Button = Styled.button`
      height: 3em;
      width: 25em;
      font-size: 1em;
      font-weight: 400;
      border-radius: 0.5em;
      border: none;
      cursor : pointer;
      background : ${(props)=> props.color &&  props.color}
`
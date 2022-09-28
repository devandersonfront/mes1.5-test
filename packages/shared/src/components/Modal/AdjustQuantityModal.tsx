import React, { useRef, useState } from 'react'
import Styled from 'styled-components'
import BasicModal from "./BasicModal"
//@ts-ignore
import Barcode from 'react-barcode';
import Notiflix from "notiflix";
import { BaseModal } from './BaseModal'
import { UploadButton } from '../../styles/styledComponents'
import { IExcelHeaderType } from '../../@types/type'
//@ts-ignore
import CloseIcon from '../../../public/images/xmark-solid.svg'
//@ts-ignore
import PlusIcon from '../../../public/images/plus-solid.svg'
//@ts-ignore
import MinusIcon from '../../../public/images/minus-solid.svg'
import { checkInteger } from '../../common/Util'
import { RequestMethod } from '../../common/RequestFunctions'
import { POINT_COLOR } from '../../common/configset'
import { ModalWrapper } from '@material-ui/pickers/wrappers/ModalWrapper'
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}
const AdjustQuantityModal = ({column, row, onRowChange}:IProps) => {
  const [ quantity , setQuantity ] = useState<string | undefined>('0')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const maxLength = column.maxLength ?? 6
    const min = Number('-'.padEnd(maxLength + 1, '9'))
    const max = Number(''.padEnd(maxLength, '9'))

  const onChange = (event) => {
      const res = checkInteger(event.target.value)
      setQuantity(res)
    }

  const onClose = () => {
    setQuantity('0')
    setIsOpen(false)
  }

  const onPlus = () => {
      setQuantity(Math.min(max, Number(quantity) + 1).toString())
  }

  const onMinus = () => {
    setQuantity(Math.max(min, Number(quantity) -1).toString())
  }

  const onConfirm = async () => {
      if(quantity === '0'){
        onClose()
      }else {
        const postBody = {
          product: row.product,
          adjust_stock: Number(quantity).toFixed(1)
        }
        Notiflix.Loading.circle()
        const res = await RequestMethod('post', 'stockAdjustSave', [postBody])
        if(res){
          onClose()
          Notiflix.Report.success('저장되었습니다.','','확인',()=> {
            row.reload()});
        }
      }
    }


    return(
      <Wrapper>
        <UploadButton hoverColor={POINT_COLOR} onClick={() => {setIsOpen(true)}}>
          <p>{column.modalTitle}</p>
        </UploadButton>
        <BaseModal isOpen={isOpen} style={{ content: {height: 300, width: 450}}}>
          <ModalContent>
                <ModalHeader>
                  <div>
                    <p style={{fontWeight:'bold',fontSize: 25, margin:0}}>재고 조정({min.toLocaleString()} ~ {max.toLocaleString()})</p>
                    <p style={{fontSize : 18, opacity: .5, margin:0, width:300, whiteSpace:'nowrap',textOverflow: 'ellipsis', overflow:'hidden'}}>CODE : {row.code}</p>
                  </div>
                  <div>
                  <img onClick={onClose} src={CloseIcon} style={{opacity: .5,height: '2em', width: '2em', cursor: 'pointer'}}></img>
                  </div>
                </ModalHeader>
                <Divider/>
                <ModalBody>
                  <CounterBox>
                    <Img src={MinusIcon} onClick={onMinus}></Img>
                    <input
                      style={{height: '2.5em', width: '3.3em',textAlign:'center', fontSize: '1.5em', margin: '0 1.3em', borderRadius: '0.5em', border: 'solid 0.1em #E1E1E1'}}
                      type={'text'}
                      onChange={onChange}
                      value={quantity}
                      maxLength={quantity.startsWith('-') ? maxLength + 1 : maxLength}
                    />
                    <Img src={PlusIcon} onClick={onPlus}></Img>
                  </CounterBox>
                  <ButtonBox>
                    <Button color={'#19B9DF'} onClick={onConfirm}>확인</Button>
                  </ButtonBox>
                </ModalBody>
          </ModalContent>
        </BaseModal>
      </Wrapper>
    )
}


export {AdjustQuantityModal}
const Wrapper = Styled.div`
  width: 100%;
  height:100%;
  display: flex;
  justify-content:center;
  align-items:center;
`
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
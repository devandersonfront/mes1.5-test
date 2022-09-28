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
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import { HeaderModal } from './HeaderModal'
interface IProps {
  column: IExcelHeaderType
  row: any
  onRowChange: (e: any) => void
}

const AdjustLotInfo = ({column, row, onRowChange}: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [lotList, setLotList] = useState<any[]>([])

  useEffect(() => {
    if(isOpen) {
      console.log('rw',row)
      const newLotList = row.involvedRecord?.map((record, recordIdx) => changeRow(record, recordIdx))
      setLotList(newLotList)
    }
  }, [isOpen])

  const changeRow = (record: any, i: number) => {
    return {
      seq: i + 1,
      lot_number: record.lot_number,
      start: record.start,
      end: record.end,
      worker: record.worker?.name ?? "-",
      amount: record.current,
      adjust: row.adjust_stock > 0 ? record.current : (record.good_quantity * -1)
    }
  }

  const modalInterface = <UploadButton onClick={() => {
        setIsOpen(true)
      }} hoverColor={POINT_COLOR} haveId>
          <p>LOT 보기</p>
      </UploadButton>

  const headers = [
    [
      {key:'거래처', value: row.customer_name ?? '-'},
      {key:'모델', value:  row.customer_model ?? '-'},
    ],
    [
      {key:'CODE', value: row.product_id ?? '-'},
      {key:'품명', value: row.name ?? '-'},
    ],
    [
      {key:'작업자', value: row.worker ?? '-'},
      {key:'조정 날짜', value: row.date ?? '-'},
      {key:'조정 수량', value: row.adjust_stock ?? 0}
    ]
  ]
  return (
    <HeaderModal modalTitle={'재고 조정 LOT 리스트'} headers={headers} interface={modalInterface} onClose={() => setIsOpen(false)} isOpen={isOpen}>
            <ExcelTable
              headerList={searchModalList.lotStock.concat( {key: 'adjust', name: '조정량'},)}
              row={lotList ?? [{}]}
              width={1746}
              rowHeight={32}
              height={568}
              type={'searchModal'}
              headerAlign={'center'}
            />
    </HeaderModal>
  )
}

export {AdjustLotInfo}

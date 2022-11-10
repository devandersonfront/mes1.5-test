import React, {useEffect, useRef, useState} from 'react'
import { IExcelHeaderType, TransferType } from '../../@types/type'
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
import { TransferCodeToValue, TransferValueToCode } from '../../common/TransferFunction'
import {useDispatch} from 'react-redux'
import {change_summary_info_index, insert_summary_info, reset_summary_info} from '../../reducer/infoModal'
import {UploadButton} from "../../styles/styledComponents";
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css';
import { ParseResponse } from '../../common/Util'

const headerItems:{title: string, infoWidth: number, key: string, unit?: string}[][] = [
    [{title: '거래처', infoWidth: 144, key: 'customer'}, {title: '모델', infoWidth: 144, key: 'model'},],
    [
        {title: 'CODE', infoWidth: 144, key: 'code'},
        {title: '품명', infoWidth: 144, key: 'name'},
        {title: '품목 종류', infoWidth: 144, key: 'type'},
        {title: '생산 공정', infoWidth: 144, key: 'process'},
    ],
    [{title: '단위', infoWidth: 144, key: 'unit'},{title: '목표 생산량', infoWidth: 144, key: 'goal'},],
]


const InputMaterialViewModal = ({isOpen, isClose, data , onClick}) => {

    const [selectIndex, setSelectIndex] = React.useState<number>(0)
    const firstPage = selectIndex + 1  === 1
    const lastPage = selectIndex + 1 >= data?.length

    const onClickEvent = () => {
        onClick()
    }
    return (
        <SearchModalWrapper >
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
                {/* BOM 정보 */}
                <div style={{width: 1776, height: 800 , display : 'flex' , flexDirection : "column", justifyContent : 'space-between'}}>
                    <div>
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
                            }}>자재 정보보기 {/*(해당 제품을 만드는데 사용할 자재를 선택해주세요. 자재 정보가 없으면 BOM 수정 버튼을 눌러 BOM 정보를 수정해주세요)*/}</p>
                            <div style={{display: 'flex'}}>
                                <div style={{cursor: 'pointer', marginLeft: 20}} onClick={() => {
                                    isClose()
                                }}>
                                    <img style={{width: 20, height: 20}} src={IcX}/>
                                </div>
                            </div>
                        </div>
                        {
                            headerItems && headerItems.map((infos, index) => {
                                return (
                                    <HeaderTable key={index.toString()}>
                                        {
                                            infos.map((info,i) => {
                                                return (
                                                    <React.Fragment key={''+index+i}>
                                                        <HeaderTableTitle>
                                                            <HeaderTableText style={{fontWeight: 'bold'}}>{info.title ?? "-"}</HeaderTableText>
                                                        </HeaderTableTitle>
                                                        <HeaderTableTextInput style={{width: info.infoWidth}}>
                                                            <Tooltip placement={'rightTop'}
                                                                     overlay={
                                                                         <div style={{fontWeight : 'bold'}}>
                                                                             {data[selectIndex][info.key] ?? "-"}
                                                                         </div>
                                                                     } arrowContent={<div className="rc-tooltip-arrow-inner"></div>}>
                                                                <HeaderTableText>{data[selectIndex][info.key] ?? "-"}</HeaderTableText>
                                                            </Tooltip>
                                                            {info.unit && <div style={{marginRight:8, fontSize: 15}}>{info.unit}</div>}
                                                        </HeaderTableTextInput>
                                                    </React.Fragment>
                                                )
                                            })
                                        }
                                    </HeaderTable>
                                )
                            })
                        }
                    </div>
                            {
                                data?.length > 1 ?
                                    <div style={{ display : 'flex' , justifyContent : 'space-around' , alignItems : 'center'}}>
                                            <div style={{display: 'flex', alignItems: 'center', flex:0.25, justifyContent: 'center', cursor: !firstPage && 'pointer'}} onClick={
                                                firstPage ? null :
                                                    () => setSelectIndex((prev) => prev -1)}>
                                                {
                                                    !firstPage && <span style={{fontSize: '50px'}} className="material-symbols-outlined">
                                                    keyboard_double_arrow_left
                                                </span>
                                                }
                                            </div>
                                            <div style={{display : 'flex' , flexDirection : 'column' , alignItems :"center", flex: 0.5}}>
                                                <ExcelTable
                                                    headerList={searchModalList.bomRegisterModal}
                                                    row={data[selectIndex].searchList ?? [{}]}
                                                    width={1500}
                                                    height={500}
                                                    rowHeight={32}
                                                    type={'searchModal'}
                                                    headerAlign={'center'}
                                                />
                                                <br/>
                                                {selectIndex + 1}/{data.length}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', flex: 0.25, justifyContent:'center', cursor:!lastPage && 'pointer'}} onClick={
                                                lastPage ? null :
                                                    () => {
                                                        setSelectIndex((prev) => prev + 1)
                                                    }}>
                                                {!lastPage && <span style={{fontSize: '50px'}} className="material-symbols-outlined">
                                                    keyboard_double_arrow_right
                                                </span>
                                                }
                                            </div>
                                    </div>
                                            :
                                            <ExcelTable
                                                headerList={searchModalList.bomRegisterModal}
                                                row={data[0]?.searchList ?? [{}]}
                                                width={1500}
                                                height={500}
                                                rowHeight={32}
                                                type={'searchModal'}
                                                headerAlign={'center'}
                                            />

                            }
                    <div style={{ height: 45, display: 'flex', alignItems: 'flex-end'}}>
                        <div
                            onClick={isClose}
                            style={{width: 888, height: 40, backgroundColor: '#E7E9EB', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p style={{color: '#717C90'}}>취소</p>
                        </div>
                        <div
                            onClick={onClickEvent}
                            style={{width: 888, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                        >
                            <p>저장하기</p>
                        </div>
                    </div>
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
  background-color: #19B9DF;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const HeaderTableTitle = styled.div`
  width: 99px;
  padding: 0 8px;
  display: flex;
  align-items: center;
`

export {InputMaterialViewModal}

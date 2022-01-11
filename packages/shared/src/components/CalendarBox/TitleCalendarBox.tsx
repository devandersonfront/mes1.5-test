import React, {useState} from 'react';
import {BoxWrap, DropBoxContainer, InnerBoxWrap, SelectButton, TitleBox} from "../../styles/styledComponents";
import styled from "styled-components";
import Calendar, {OnChangeDateCallback} from "react-calendar";
import moment from "moment";
import {POINT_COLOR} from "../../common/configset";
import Modal from "react-modal";
import useOnclickOutside from "react-cool-onclickoutside";

interface IProps{
    value: string
    onChange: (date: Date) => void
}

const TitleCalendarBox = ({value, onChange}:IProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [select, setSelect] = useState<Date>(moment().toDate())
    const ref = useOnclickOutside(() => setIsOpen(false))

    return (
        <div style={{display: "flex", marginBottom: '8px', alignItems: "center"}}>
            <TitleBox>등록 날짜</TitleBox>
            <ValueBox>
                {value}
            </ValueBox>
            <SelectButton onClick={()=>setIsOpen(true)}>
                날짜선택
            </SelectButton>
            <Modal
                isOpen={isOpen}
                style={{
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
                        zIndex: 101
                    }
                }}
            >
                <DropBoxContainer ref={ref}>
                    <InnerBoxWrap style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'space-between',
                        flexDirection: 'column'
                    }}>
                        <BoxWrap style={{backgroundColor: 'white', flexDirection: 'row', display: 'flex'}}>
                            <div  style={{display: 'inline-block', float: 'left', flex: 1, marginRight: 20}}>
                                <Calendar
                                    maxDate={moment().toDate()}
                                    onChange={(date) => {
                                        setSelect(date)
                                    }}
                                    value={select}
                                />
                            </div>
                        </BoxWrap>
                        <div>
                            <div style={{ height: 40, display: 'flex', alignItems: 'flex-end'}}>
                                <div
                                    onClick={() => {
                                        setIsOpen(false)
                                    }}
                                    style={{flex: 1, height: 40, backgroundColor: '#b3b3b3', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <p>취소</p>
                                </div>
                                <div
                                    onClick={() => {
                                        onChange(select)
                                        setIsOpen(false)
                                    }}
                                    style={{flex: 1, height: 40, backgroundColor: POINT_COLOR, display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                                >
                                    <p>확인</p>
                                </div>
                            </div>
                        </div>
                    </InnerBoxWrap>
                </DropBoxContainer>
            </Modal>
        </div>
    );
};


const ValueBox = styled.div`
    padding-left: 16px;
    color: white;
    font-size: 16px;
    background-color: #353B48;
    width: 93%;
    height: 40px;
    display: flex;
    align-items: center;
`

export {TitleCalendarBox}

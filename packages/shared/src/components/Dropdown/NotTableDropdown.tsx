import React, {useEffect, useState} from "react"
import styled from "styled-components"
import 'rc-tooltip/assets/bootstrap_white.css';
//@ts-ignore
import arrow_down from "../../../public/images/filter_open_b.png"
//@ts-ignore
import arrow_up from "../../../public/images/filter_close_b.png"

interface Option {
    title:string, value:number | string
}

interface Props {
    options:Option[]
    width?: number | string
    onChangeEvent:(option:Option) => void
    selectData?: string
}

const NotTableDropdown = ({options, width, selectData, onChangeEvent}:Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectValue, setSelectValue] = useState<{title:string, value:any}>()

    useEffect(() => {
        const selectedValue = options.find((option) => option.title === selectData)
        if(selectedValue !== undefined) setSelectValue(selectedValue)
    },[])

    return (
        <Container style={{width:width}}>
            <Label onClick={(e) => {
                setIsOpen(open => !open)
            }}>
                <>{selectValue?.title ?? selectData ?? options[0].title}</>
                <img  src={isOpen ? arrow_up : arrow_down} style={{width:35, height:35,}}/>
            </Label>
            <Select open={isOpen}  >
                {options.map((option:Option, index) =>
                    <Option value={option.value} onClick={() => {
                        setSelectValue(option)
                        onChangeEvent(option)
                        setIsOpen(false)
                    }}>{option.title}</Option>
                )}
            </Select>
        </Container>
    )
}

const Container = styled.div`
    position: relative;
    width: 390px;
    height: 35px;
    border-radius: 4px;
    border: 0.5px solid #B3B3B3;
    background-size: 20px;
    cursor: pointer;
`

const Label = styled.button`
    display: flex;
    justify-content:space-between;
    align-items: center;
    width:inherit;
    height: inherit;
    border: 0 none;
    outline: 0 none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
`

const Select = styled.ul<{open:boolean}>`
    width: 100%;
    background: #F4F6FA;
    color: black;
    list-style-type: none;
    padding: 0;
    overflow: hidden;
    max-height: 0;
    transition: .3s ease-in;
    ${props => props.open ? "max-height: 100px;" : "none"}
    overflow: auto;
    margin:0;
`

const Option = styled.li`
    border-bottom: 0.5px dash;
    padding: 5px 15px 5px;
    transition: .1s;
    &:hover{
        background:#e3e3ff;
    }
`

export default NotTableDropdown

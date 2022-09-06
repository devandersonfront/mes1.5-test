import React, {useState} from "react"
import styled from "styled-components"
import 'rc-tooltip/assets/bootstrap_white.css';
import arrow_down from "../../../public/images/filter_open_b.png"
import arrow_up from "../../../public/images/filter_close_b.png"

interface Option {
    title:string, value:number | string
}

interface Props {
    options:Option[]
    width?: number | string
    onChangeEvent:(option:Option) => void

}

const NotTableDropdown = ({options, width, onChangeEvent}:Props) => {

    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectValue, setSelectValue] = useState<{title:string, value:any}>()

    return (
        <Container style={{width:width}}>
            <Label onClick={(e) => {
                setIsOpen(open => !open)
            }}>
                <>{selectValue?.title ?? options[0].title}</>
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
    width: 400px;
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
    padding-left: 15px;
    background: transparent;
    cursor: pointer;
`

const Select = styled.ul<{open:boolean}>`
    width: 100%;
    background: #e9ebff;
    color: black;
    list-style-type: none;
    padding: 0;
    border-radius: 6px;
    overflow: hidden;
    max-height: 0;
    transition: .3s ease-in;
    ${props => props.open ? "max-height: 100px;" : "none"}
    overflow:scroll;
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

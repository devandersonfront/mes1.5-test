import React, {ChangeEvent, useEffect} from 'react'
import {IExcelHeaderType} from '../../common/@types/type'
import Notiflix from 'notiflix'
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../reducer";
import {insert_machine_list} from "../../reducer/machineSelect";
import styled from 'styled-components'

interface IProps {
  value: string|number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  unit?: string
}

const RegisterInput = ({value, onChange, placeholder, unit}: IProps) => (
  <div style={{
    width: '100%',
    height: '100%',
  }} >
    <div style={{
      width: '100%',
      height: '100%',
    }}>
      <div style={{width: 50, height: 32, position: 'absolute', right: '3%', display: 'flex', alignItems: 'center'}}>
        <p>{unit}</p>
      </div>
      <RegInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  </div>
)

const RegInput = styled.input`
  text-align: left;
  width: 100%;
  height: calc(100% - 3px);
`

export {RegisterInput};

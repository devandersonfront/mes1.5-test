import React, {ChangeEvent} from 'react'
import styled from 'styled-components'

interface IProps {
  value: string|number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  unit?: string
  inputType?: string
}

const RegisterInput = ({value, onChange, placeholder, unit, inputType}: IProps) => (
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
        type={inputType ?? 'text'}
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

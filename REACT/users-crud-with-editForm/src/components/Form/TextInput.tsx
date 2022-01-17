import React from 'react'
import { TFormBaseInputProps } from '.'

export type TFormTextInputData = {}

export type TFormTextInputProps = TFormBaseInputProps<TFormTextInputData, string>

export default ({field, value, onChange}: TFormTextInputProps) => {
  return (
    <div>
      <label>{field.title}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
import React from 'react'
import { TFormBaseInputProps } from '.'

export type TFormSelectOption = {
  title: string
  value: string
}

export type TFormSelectData = {
  options: TFormSelectOption[]
}

export type TFormSelectProps = TFormBaseInputProps<TFormSelectData, string>

export default ({field, value, onChange}: TFormSelectProps) => {

  return (
    <div>
      <label>{field.title}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {field.data.options.map((option) => (<option key={option.value} value={option.value}>{option.title}</option>))}
      </select>
    </div>
  )
}
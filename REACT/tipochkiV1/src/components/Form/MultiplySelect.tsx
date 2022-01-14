import React from 'react'
import { TFormBaseInputProps } from '.'

export type TFormMultiplySelectOption = {
  title: string
  value: string
}

export type TFormMultiplySelectData = {
  options: TFormMultiplySelectOption[]
}

export type TFormMultiplySelectProps = TFormBaseInputProps<TFormMultiplySelectData, string[]>

export default ({field, value, onChange}: TFormMultiplySelectProps) => {
  const handleOnChange = (option: string) => {
    if(value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else {
      onChange([option].concat(value))
    }
  }

  return (
    <div>
      <div>
        <label>{field.title}</label>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'auto auto auto auto auto'}}>
        {field.data.options.map((option) => (
          <div key={option.value}>
            <label>
              <input 
                type="checkbox" 
                value={option.value}
                checked={value.includes(option.value)}
                onChange={(e) => handleOnChange(e.target.value)} 
              />
              {option.title}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}
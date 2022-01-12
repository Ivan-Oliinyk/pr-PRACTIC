import React, { ChangeEvent } from 'react'

type InputProps = {
  label: string,
  value: string,
  onChange: (value: string) => void
}

const handleChange = (onChange: InputProps['onChange']) => (event: ChangeEvent<HTMLInputElement>) => {
  onChange(event.target.value)
}

export default ({label, value, onChange}: InputProps) => {
  return (
    <div>
      <label>{label}</label> <br />
      <input value={value} onChange={handleChange(onChange)} />
    </div>
  )
}
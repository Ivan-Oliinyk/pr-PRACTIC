import React, { ChangeEvent } from 'react'

export type TSearchInputProps = {
  value: string,
  onChange: (value: string) => void
}

const handleOnChange = (onChange: TSearchInputProps['onChange']) => (event: ChangeEvent<HTMLInputElement>) => {
  onChange(event.target.value)
}

export default ({value, onChange}: TSearchInputProps) => {
  return (
    <div>
      <input
        type="search" 
        value={value}
        onChange={handleOnChange(onChange)}
      />
    </div>
  )
}
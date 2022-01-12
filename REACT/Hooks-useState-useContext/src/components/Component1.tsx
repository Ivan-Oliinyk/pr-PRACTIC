import React from 'react'
import Component2 from './Component2'

type Component1Props = {
  data: {[key: string]: string}
  onChange: (key: string, value: string) => void
}

const handleOnChange = (key: string, onChange: Component1Props['onChange']) => (value: string) => {
  onChange(key, value)
}

export default ({data, onChange}: Component1Props) => {
  return (
    <div>
      {Object.keys(data).map(key => <Component2 key={key} label={key} value={data[key]} onChange={handleOnChange(key, onChange)} />)}
    </div>
  )
}
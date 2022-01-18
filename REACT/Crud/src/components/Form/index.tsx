import React from 'react'
import MultiplySelect, { TFormMultiplySelectProps } from './MultiplySelect'
import Select, { TFormSelectProps } from './Select'
import TextInput, { TFormTextInputData, TFormTextInputProps } from './TextInput'

export type TFormBaseItem = {
  [key: string]: unknown
}

export type TFormFieldType = "text" | "multiply" | "select"

export type TFormFieldData = TFormMultiplySelectProps | TFormTextInputData

export type TFormField<T extends TFormFieldData = TFormFieldData> = {
  name: string
  title: string
  type: TFormFieldType
  data: T
}

export type TFormBaseInputProps<T extends TFormFieldData, U = unknown> = {
  field: TFormField<T>
  value: U
  onChange: (value: U) => void
}

export type TFormProps<T extends TFormBaseItem = TFormBaseItem> = {
  item: T
  fields: TFormField[]
  onChange: (key: string, value: unknown) => void
}

 

const handlerChange = (onChange: TFormProps['onChange']) => (key: string) => (value: unknown) => {
  onChange(key, value)
}

export default ({item, fields, onChange}: TFormProps) => {
  const handlerOnChange = handlerChange(onChange)
  
  return (
    <form onSubmit={() => {}}>
      {fields.map((field) => {
        const props = {
          field,
          value: item[field.name],
          onChange: handlerOnChange(field.name)
        }

        switch(field.type) {
          case "text": return <TextInput key={field.name} {...props as TFormTextInputProps} />;
          case "multiply": return <MultiplySelect key={field.name} {...props as TFormMultiplySelectProps} />;
          case "select": return <Select key={field.name} {...props as TFormSelectProps} />;
        }
      })}
    </form>
  )
}
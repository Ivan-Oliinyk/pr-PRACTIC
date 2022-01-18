import React from 'react'
import { useNavigate } from 'react-router-dom'
import Form, { TFormField } from '../../components/Form'
import { TCrudItem } from '../../contexts/types'
import useItem from '../../hooks/crud/useItem'
import { TCrudContainer } from '../../pages/crud/types'

export type TCreateContainerProps<T extends TCrudItem = any> = {
  formFields: TFormField[],
} & TCrudContainer<T>


export default ({formFields, context, basePath}: TCreateContainerProps) => {
  const navigate = useNavigate()
  const [item, onChange, onSave] = useItem<TCrudItem>(formFields, context, undefined)

  return (
    <div>
      <Form 
        fields={formFields}
        item={item as TCrudItem}
        onChange={onChange}
      />
      <hr />
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2rem'}}>
        <button onClick={() => navigate(basePath)}>Cancel</button>
        <button onClick={onSave(() => navigate(basePath))}>Save</button>
      </div>
    </div>
  )
}
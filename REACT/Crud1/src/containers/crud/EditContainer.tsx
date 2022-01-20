import React from 'react'
import { useNavigate } from 'react-router-dom'
import Form, { TFormField } from '../../components/Form'
import { TCrudItem } from '../../contexts/types'
import useItem from '../../hooks/crud/useItem'
import { TCrudContainer } from '../../pages/crud/types'


export type TEditContainerProps<T extends TCrudItem = any> = {
  formFields: TFormField[],
  id: string
} & TCrudContainer<T>


export default ({formFields, context, basePath, id}: TEditContainerProps) => {
  const navigate = useNavigate()

  const [item, onChange, onSave, onRemove] = useItem<TCrudItem>(formFields, context, id)

  if(!item) {
    return <h2>Error: item not found</h2>
  }

  return (
    <div>
      <Form 
        fields={formFields}
        item={item}
        onChange={onChange}
      />
      <hr />
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2rem'}}>
        <button onClick={onRemove(() => navigate(basePath))}>Remove</button>
        <button onClick={onSave(() => navigate(basePath))}>Save</button>
      </div>
    </div>
  )
}
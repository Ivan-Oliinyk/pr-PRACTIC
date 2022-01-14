import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form, { TFormField } from '../components/Form'
import { TUser, UsersDispatchContext, UsersStateContext } from '../contexts/UsersContext'
import skills from '../skills.json'
import { THaveId } from './EditContainer'


const FIELDS: TFormField[] = [
  {name: 'name', title: 'Name', data: {}, type: 'text'},
  {name: 'email', title: 'Email', data: {}, type: 'text'},
  {
    name: 'skills', 
    title: 'Skills', 
    data: {
      options: skills.map((title) => ({title, value: title}))
    }, 
    type: 'multiply'
  },
]


function createNew<T extends THaveId>(): T {
  const innerFields = FIELDS.reduce((acc: {[key: string]: unknown}, field) => {
    acc[field.name] = field.type === 'text' ? '' : []
    return acc
  }, {})

  return {
    _id: String(Date.now()),
    ...innerFields
  } as T
} 

export default () => {
  const navigate = useNavigate()
  const items = useContext(UsersStateContext)
  const dispatch = useContext(UsersDispatchContext)
  
  const [item, setItem] = useState<TUser>(createNew<TUser>())

  const handleOnChange = (key: string, value: unknown) => {
    setItem({
      ...item as TUser,
      [key]: value
    })
  }

  const handleOnSave = () => {
    dispatch(items.concat(item))
    navigate('/')
  }

  const handleOnCancel = () => {
    navigate('/')
  }

  return (
    <div>
      <Form 
        fields={FIELDS}
        item={item}
        onChange={handleOnChange}
      />
      <hr />
      <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '2rem'}}>
        <button onClick={handleOnCancel}>Cancel</button>
        <button onClick={handleOnSave}>Save</button>
      </div>
    </div>
  )
}
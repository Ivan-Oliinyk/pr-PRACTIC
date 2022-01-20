import React, { useState } from 'react'
import data from '../data-users.json'
import { TCrudContextDispatch } from './types'

export type TUser = {
  _id: string
  name: string
  email: string
  skills: string[]
}

export type TUsersDispatch = TCrudContextDispatch<TUser>

export const UsersStateContext = React.createContext<TUser[]>([])

export const UsersDispatchContext = React.createContext<TUsersDispatch>(console.log)

function prepareData(): TUser[] {
  return data.map(({_id, list, email, skills}) => {
    return {
      _id: _id.toString(),
      name: list,
      email,
      skills: skills.split(', ')
    }
  })
}

export default ({children}: React.PropsWithChildren<{}>) => {
  const [users, setUsers] = useState<TUser[]>(prepareData())
  return (
    <UsersStateContext.Provider value={users}>
      <UsersDispatchContext.Provider value={setUsers}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  )
}
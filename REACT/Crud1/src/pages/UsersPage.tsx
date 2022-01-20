import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { TFormField } from '../components/Form'
import { TTableField } from '../components/Table'
import { TUser, UsersStateContext, UsersDispatchContext } from '../contexts/UsersContext'
import CreatePage, { TCreatePageProps } from './crud/CreatePage'
import EditPage, { TEditPageProps } from './crud/EditPage'
import ListPage, { TListPageProps } from './crud/ListPage'
import skills from '../skills.json'

const basePath = '/users'

const context = {
  // store: UsersStateContext,
  store: (state:any) => state.users.users,
  // dispatch: UsersDispatchContext
  dispatch: 'USER'
}

const fields: TTableField[] = [
  {_id: '_id', 'title': "#", sortable: true},
  {_id: 'name', 'title': "Name", sortable: true},
  {_id: 'email', 'title': "Email", sortable: true},
  {_id: 'skills', 'title': "Skills", sortable: false}
]

const searchFields = ['_id', 'name', 'email', 'skills']

const formFields: TFormField[] = [
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

const CREATE_PAGE_PROPS: TCreatePageProps<TUser> = {
  title: 'User - Create',
  basePath,
  context,
  formFields
}

const EDIT_PAGE_PROPS: TEditPageProps<TUser> = {
  title: 'User %id - Edit',
  basePath,
  context,
  formFields
}

const LIST_PAGE_PROPS: TListPageProps<TUser> = {
  title: 'Users - List',
  basePath,
  context,
  fields,
  searchFields
}

export default () => {
  return (
    <Routes>
      <Route path="/" element={<ListPage {...LIST_PAGE_PROPS} />} />
      <Route path="/:id/edit" element={<EditPage {...EDIT_PAGE_PROPS} />} />
      <Route path="/create" element={<CreatePage {...CREATE_PAGE_PROPS} />} />
    </Routes>
  )
}
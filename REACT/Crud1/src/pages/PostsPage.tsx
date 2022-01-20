import React, { useContext, useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import { TFormField } from '../components/Form'
import { TFormSelectData } from '../components/Form/Select'
import { TTableField } from '../components/Table'
import { TPost, PostsStateContext, PostsDispatchContext } from '../contexts/PostsContext'
import { UsersStateContext } from '../contexts/UsersContext'
import CreatePage, { TCreatePageProps } from './crud/CreatePage'
import EditPage, { TEditPageProps } from './crud/EditPage'
import ListPage, { TListPageProps } from './crud/ListPage'
import {useTypedSelector} from "../hooks/useTypedSelector";


const basePath = '/posts'

const context = {
  // store: PostsStateContext,
  store: (state:any) => state.posts.posts,
  // dispatch: PostsDispatchContext
  dispatch: 'POST'
}

const fields: TTableField[] = [
  {_id: '_id', 'title': "#", sortable: true},
  {_id: 'title', 'title': "Title", sortable: true},
  {_id: 'body', 'title': "Body", sortable: true},
  {_id: 'author_id', 'title': "Author", sortable: true}
]

const searchFields = ['_id', 'title', 'author_id']

const formFields: TFormField[] = [
  {name: 'title', title: 'Title', data: {}, type: 'text'},
  {name: 'body', title: 'Body', data: {}, type: 'text'},
  {
    name: 'author_id', 
    title: 'Author', 
    data: {
      options: []
    }, 
    type: 'select'
  },
]

const CREATE_PAGE_PROPS: TCreatePageProps<TPost> = {
  title: 'Post - Create',
  basePath,
  context,
  formFields
}

const EDIT_PAGE_PROPS: TEditPageProps<TPost> = {
  title: 'Post %id - Edit',
  basePath,
  context,
  formFields
}

const LIST_PAGE_PROPS: TListPageProps<TPost> = {
  title: 'Posts - List',
  basePath,
  context,
  fields,
  searchFields
}

export default () => {
  // const users = useContext(UsersStateContext)
  const {users} = useTypedSelector(state => state.users)

  const cachedFormFields: TFormField[] = useMemo(() => {
    return formFields.map((field) => {
      if(field.name === 'author_id') {
        (field.data as TFormSelectData).options = users.map((user) => (
          {
            title: user.name,
            value: user._id
          }
        ))
      }
      return field
    })
  }, [users])

  return (
    <Routes>
      <Route path="/" element={<ListPage {...LIST_PAGE_PROPS} />} />
      <Route path="/:id/edit" element={<EditPage {...EDIT_PAGE_PROPS} formFields={cachedFormFields} />} />
      <Route path="/create" element={<CreatePage {...CREATE_PAGE_PROPS} formFields={cachedFormFields} />} />
    </Routes>
  )
}
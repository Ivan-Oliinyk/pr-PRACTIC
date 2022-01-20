import React, { useState } from 'react'
import data from '../data-posts.json'
import { TCrudContextDispatch } from './types'

export type TPost = {
  _id: string
  title: string
  body: string
  author_id: string
}

export type TPostsDispatch = TCrudContextDispatch<TPost>

export const PostsStateContext = React.createContext<TPost[]>([])

export const PostsDispatchContext = React.createContext<TPostsDispatch>(console.log)

function prepareData(): TPost[] {
  return data.map(({_id, title, body, author_id}) => {
    return {
      _id: _id.toString(),
      title,
      body,
      author_id: author_id.toString()
    }
  })
}

export default ({children}: React.PropsWithChildren<{}>) => {
  const [posts, setPosts] = useState<TPost[]>(prepareData())
  return (
    <PostsStateContext.Provider value={posts}>
      <PostsDispatchContext.Provider value={setPosts}>
        {children}
      </PostsDispatchContext.Provider>
    </PostsStateContext.Provider>
  )
}
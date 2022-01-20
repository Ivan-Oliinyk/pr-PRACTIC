import React from 'react'
import { TCrudContextDispatch, TCrudItem } from '../../contexts/types'

export type TCrudContext<StoreItem extends TCrudItem = any> = {
  // store: React.Context<StoreItem[]>,
  store: (state:any) => {},
  // dispatch: React.Context<TCrudContextDispatch<StoreItem>>
  dispatch: string
}

export type TCrudContainer<StoreItem extends TCrudItem = any> = {
  context: TCrudContext<StoreItem>
  basePath: string
}

export type TCrudPageProps<StoreItem extends TCrudItem = any> = {
  title: string
  basePath: string
}
import React from 'react'
import { Link } from 'react-router-dom'
import ListContainer, { TListContainerProps } from '../../containers/crud/ListContainer'
import { TCrudItem } from '../../contexts/types'
import { TCrudPageProps } from './types'

export type TListPageProps<T extends TCrudItem = any> = {

} & TCrudPageProps<T> & TListContainerProps<T>

export default ({title, basePath, ...rest}: TListPageProps) => {
  return (
    <div>
      <h2>{title}</h2>
      <hr />
      <div className="Container">
        <div>
          <Link to={`${basePath}/create`}>New</Link>
        </div>
        <ListContainer basePath={basePath} {...rest} />
      </div>
    </div>
  )
}
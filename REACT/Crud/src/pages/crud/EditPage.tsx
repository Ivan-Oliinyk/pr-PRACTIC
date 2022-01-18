import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { TCreateContainerProps } from '../../containers/crud/CreateContainer'
import EditContainer from '../../containers/crud/EditContainer'
import { TCrudItem } from '../../contexts/types'
import { TCrudPageProps } from './types'

export type TEditPageProps<T extends TCrudItem = TCrudItem> = {
  
} & TCrudPageProps<T> & TCreateContainerProps<T>

export default ({title, ...rest}: TEditPageProps<any>) => {
  const {id} = useParams()

  if(!id) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <h2>{title.replace('%id', id)}</h2>
      <hr />
      <div className="Container">
        <EditContainer id={id} {...rest} />
      </div>
    </div>
  )
}
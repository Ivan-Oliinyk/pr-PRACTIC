import React, { FC } from 'react'
import CreateContainer, { TCreateContainerProps } from '../../containers/crud/CreateContainer'
import { TCrudItem } from '../../contexts/types'
import { TCrudPageProps } from './types'

export type TCreatePageProps<T extends TCrudItem = TCrudItem> = {
  
} & TCrudPageProps<T> & TCreateContainerProps<T>

export default ({title, ...rest}: TCreatePageProps<any>) => {
  return (
    <div>
      <h2>{title}</h2>
      <hr />
      <div className="Container">
        <CreateContainer {...rest} />
      </div>
    </div>
  )
}
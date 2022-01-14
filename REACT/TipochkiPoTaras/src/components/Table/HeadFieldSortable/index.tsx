import React from 'react'
import { TTableField, TTableProps } from '..'
import { TTableHeadProps } from '../Head'
import SortAsc from './SortAsc'
import SortDesc from './SortDesc'
import SortNone from './SortNone'

export type TTableHeadFieldProps = {
  id: string
  title: string
} & Omit<TTableHeadProps, "fields">

export type TTableHeadSortFieldProps = {
  title: string
  onClick: () => void
}

export default ({id, title, sortField, sortDirection, onSortFieldChange, onSortDirectionChange}: TTableHeadFieldProps) => {
  if(id === sortField) {
    return sortDirection === 'ASC' ? <SortAsc title={title} onClick={() => onSortDirectionChange('DESC')} /> :
    <SortDesc title={title} onClick={() => onSortDirectionChange('ASC')} />
  }

  return <SortNone title={title} onClick={() => onSortFieldChange(id)} />
}
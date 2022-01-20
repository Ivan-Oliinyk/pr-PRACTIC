import React from 'react'
import { TTableProps } from '.'
import HeadField from './HeadField'
import HeadFieldSortable from './HeadFieldSortable'

export type TTableHeadProps = Omit<TTableProps, "items" | "onClick">

export default (
  {fields, ...rest}: TTableHeadProps
  ) => {
  return (
    <tr>
      {fields.map((field) => (
        field.sortable ? <HeadFieldSortable key={field._id} id={field._id} title={field.title} {...rest} /> : 
        <HeadField key={field._id} title={field.title} /> 
      ))}
    </tr>
  )
}
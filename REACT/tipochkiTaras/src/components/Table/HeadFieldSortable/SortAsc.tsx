import React from 'react'
import { TTableHeadSortFieldProps } from '.'


export default ({title, onClick}: TTableHeadSortFieldProps) => {
  return (
    <th onClick={() => onClick()}>{title} ▲</th>
  )
}
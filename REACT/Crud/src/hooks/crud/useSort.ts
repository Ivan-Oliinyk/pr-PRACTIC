import { useState } from "react"

function sortASC(a: string, b: string) {
  return (b > a ? -1 : 1)
}

function sortDESC(a: string, b: string) {
  return (a > b ? -1 : 1)
}

function sortItems<T extends {[key: string]: any}>(
  items: T[], 
  sortField: string, 
  sortDirection: 'ASC' | 'DESC'
  ): T[] {

    return items.sort((a, b) => (
      sortDirection === 'ASC' ? 
      sortASC(String(a[sortField]), String(b[sortField])) : 
      sortDESC(String(a[sortField]), String(b[sortField]))
    ))
}

export type TSortSetField = (field: string) => void 
export type TSortSetDirection = (dir: 'ASC' | 'DESC') => void 

export default <T>(items: T[]): [string, string, TSortSetField, TSortSetDirection, T[]] => {
  const [sortField, setSortField] = useState<string>('_id')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC')
  
  return [
    sortField,
    sortDirection,
    setSortField,
    setSortDirection,
    sortItems<T>(items, sortField, sortDirection)
  ]
}
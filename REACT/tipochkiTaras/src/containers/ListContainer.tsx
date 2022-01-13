import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination, { TPaginationData } from '../components/List/Pagination'
import Search from '../components/List/Search'
import Table, { TTableField } from '../components/Table'
import { UsersStateContext } from '../contexts/UsersContext'

const defaultPagination = {
  page: 1,
  limit: 10,
  count: 1
}

function filterItems<T extends {[key: string]: any}>(
  items: T[],
  searchValue: string,
  searchFields: string[]
  ): T[] {
    searchValue = searchValue.toLocaleLowerCase()
    return items.filter((item) => (
      searchFields.some(field => String(item[field]).toLocaleLowerCase().includes(searchValue))
    ))
}

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

function paginateItems<T extends {[key: string]: any}>(
  items: T[], 
  pagination: TPaginationData
  ): T[] {
    return items.slice(pagination.limit * (pagination.page - 1), pagination.limit * pagination.page)
}


const FIELDS: TTableField[] = [
  {_id: '_id', 'title': "#", sortable: true},
  {_id: 'name', 'title': "Name", sortable: true},
  {_id: 'email', 'title': "Email", sortable: true},
  {_id: 'skills', 'title': "Skills", sortable: false}
]

const SEARCH_FIELDS = ['_id', 'name', 'email', 'skills']

export default () => {
  const navigate = useNavigate()

  const users = useContext(UsersStateContext)
  
  const [sortField, setSortField] = useState<string>('_id')
  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('ASC')

  const [searchValue, setSearchValue] = useState<string>('')

  const [page, setPage] = useState<number>(1)

  const filteredItems = filterItems(users, searchValue, SEARCH_FIELDS)

  const sortedItems = sortItems(filteredItems, sortField, sortDirection)

  const pagination: TPaginationData = {
    ...defaultPagination,
    page,
    count: sortedItems.length
  }

  const paginatedItems = paginateItems(sortedItems, pagination)

  useEffect(() => {
    setPage(1)
  }, [searchValue])


  const handleNavEdit = (id: string) => {
    navigate(`/${id}/edit`)
  }

  return (
    <div>
      <Search value={searchValue} onChange={setSearchValue} />
      <Table
        fields={FIELDS}
        items={paginatedItems}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortFieldChange={setSortField}
        onSortDirectionChange={setSortDirection}
        onClick={handleNavEdit}
      />
      <Pagination pagination={pagination} onChange={setPage}/>
    </div>
  )
}
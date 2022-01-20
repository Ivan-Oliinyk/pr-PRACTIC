import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../../components/List/Pagination'
import Search from '../../components/List/Search'
import Table, { TTableField } from '../../components/Table'
import { TCrudItem } from '../../contexts/types'
import useFilter from '../../hooks/crud/useFilter'
import usePagination from '../../hooks/crud/usePagination'
import useSort from '../../hooks/crud/useSort'
import { TCrudContainer } from '../../pages/crud/types'
import {useTypedSelector} from "../../hooks/useTypedSelector";

export type TListContainerProps<T extends TCrudItem = any> = {
  fields: TTableField[],
  searchFields: string[],
} & TCrudContainer<T>


export default ({fields, searchFields, context, basePath}: TListContainerProps) => {
  const navigate = useNavigate()
  const items = useTypedSelector(context.store) as TCrudItem[]

  const [searchValue, setSearchValue, filteredItems] = useFilter(items, searchFields)
  const [sortField, sortDirection, setSortField, setSortDirection, sortedItems] = useSort(filteredItems)
  const [pagination, setPage, paginatedItems] = usePagination(sortedItems, searchValue)


  const handleNavEdit = (id: string) => {
    navigate(`${basePath}/${id}/edit`)
  }

  return (
    <div>
      <Search value={searchValue} onChange={setSearchValue} />
      <Table
        fields={fields}
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
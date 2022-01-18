import {useEffect, useState} from 'react'
import { TPaginationData } from '../../components/List/Pagination'


function paginateItems<T extends {[key: string]: any}>(
  items: T[], 
  pagination: TPaginationData
  ): T[] {
    return items.slice(pagination.limit * (pagination.page - 1), pagination.limit * pagination.page)
}


export type TPaginationSetPage = (value: number) => void

export default <T>(items: T[], trigger: any, limit: number = 10): [TPaginationData, TPaginationSetPage, T[]] => {
  const [page, setPage] = useState<number>(1)

  const pagination: TPaginationData = {
    limit,
    page,
    count: items.length
  }

  useEffect(() => {
    setPage(1)
  }, [trigger])

  return [
    pagination,
    setPage,
    paginateItems(items, pagination),
  ]
}
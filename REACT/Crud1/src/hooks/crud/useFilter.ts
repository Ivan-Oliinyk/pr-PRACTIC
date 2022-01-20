import {useState} from 'react'


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

export type TFilterSetSearch = (value: string) => void

export default <T>(items: T[], searchFields: string[]): [string, TFilterSetSearch, T[]] => {
  const [searchValue, setSearchValue] = useState<string>('')

  return [
    searchValue,
    setSearchValue,
    filterItems(items, searchValue, searchFields)
  ]
}
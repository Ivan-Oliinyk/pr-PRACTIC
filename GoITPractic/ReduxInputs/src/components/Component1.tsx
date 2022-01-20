import { Dispatch } from "react"
import { useAppDispatch, useAppSelector } from "../hooks/redux"
import { TAction, TItem } from "../store/reducers/mainReducer"



export default function Component1() {

  const list: TItem[] = useAppSelector(store => store.mainReducer)


  const dispatch = useAppDispatch()

  function handlerChange(key: string, value: string) {

    dispatch({ type: 'CHANGE', payload: list.map((item: TItem) => 
      (item.key === key) ? {key, value} : item
    )})
  }



  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      COMPONENT 1
      {
        list.map((item: TItem) =>
          <label
            style={{ display: 'flex' }}
            key={item.key}>
            <input
              style={{ border: '1px solid red' }}
              type="text"
              value={item.value}
              onChange={(event) => handlerChange(item.key, event.target.value)} />
          </label>
        )
      }

    </div>
  )
}
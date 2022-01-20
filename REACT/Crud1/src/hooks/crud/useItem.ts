import React, { useContext, useState } from 'react'
import { TFormField } from '../../components/Form'
import { TCrudItem } from '../../contexts/types'
import { TCrudContext } from '../../pages/crud/types'
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../useTypedSelector";

function fieldValue(type: TFormField['type']) {
  switch(type) {
    case "text":
    case "select":
      return ""
    case "multiply": 
      return []
  }
}

function createNew<T extends TCrudItem>(fields: TFormField[]): T {
  const innerFields = fields.reduce((acc: {[key: string]: unknown}, field) => {
    acc[field.name] = fieldValue(field.type)
    return acc
  }, {})

  return {
    _id: String(Date.now()),
    ...innerFields
  } as T
}

function find<T extends TCrudItem>(items: T[], id: string): T | undefined {
  return items.find(item => item._id === id)
} 

export type THandlerOnChange = (key: string, value: unknown) => void

export type THandlerOnSave = (cb: () => void) => () => void

export type THandlerOnRemove = (cb: () => void) => () => void

export default <T extends TCrudItem>(
  formFields: TFormField[], 
  context: TCrudContext<T>,
  id: string | undefined
): [T | undefined, THandlerOnChange, THandlerOnSave, THandlerOnRemove] => {

  // const items = useContext(context.store) as T[]
  const items = useTypedSelector(context.store) as T[]
  const [item, setItem] = useState<T | undefined>(id ? find<T>(items, id) : createNew<T>(formFields))
  // const dispatch = useContext(context.dispatch)
  const dispatch = useDispatch()

  const handleOnChange: THandlerOnChange = (key: string, value: unknown) => {
    item && setItem({
      ...item,
      [key]: value
    })
  }

  const handleOnSave: THandlerOnSave = (cb) => () => {
    if(item) {
      if(id) {
        // dispatch(items.map(oldItem => oldItem._id === id ? item : oldItem))
        dispatch({type: `EDIT_${context.dispatch}`, payload: item})
      } else {
        // dispatch(items.concat(item))
        dispatch({type: `ADD_${context.dispatch}`, payload: item})
      }
    }
    
    cb()
  }

  const handleOnRemove: THandlerOnRemove = (cb) => () => {
    if(item) {
      // dispatch(items.filter(exItem => exItem._id !== item?._id))
      dispatch({type: `DEL_${context.dispatch}`, payload: item._id})
    }
    
    cb()
  }

  return [
    item,
    handleOnChange,
    handleOnSave,
    handleOnRemove
  ]
}
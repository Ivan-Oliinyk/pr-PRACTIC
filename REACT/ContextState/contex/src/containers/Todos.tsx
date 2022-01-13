import React from 'react'

import { TodoContext } from '../context/TodoContext'
import Todo from '../components/Todo'

const Todos = () => {
  const { todos, updateTodo } = React.useContext(TodoContext) as ContextType
  return (
    <>
      {todos.map((todo: ITodo) => (
        
      ))}
    </>
  )
}

export default Todos
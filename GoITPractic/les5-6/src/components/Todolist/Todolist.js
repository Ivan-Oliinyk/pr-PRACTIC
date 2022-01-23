import React from "react";
import TodoItem from "./TodoItem";
import "./Todolist.css";

const Todolist = ({ todos, onDeleteTodo, onCompliteTodo }) => (
  <div className="Todo__wrapper">
    <h2 className="Todo__title">Todo List</h2>
    <ul className="Todo__list">
      {todos.map(({ id, text, complited }, idx) => (
        <TodoItem
          key={id}
          text={text}
          complited={complited}
          onComplited={() => onCompliteTodo(idx)}
          onDelete={() => onDeleteTodo(idx)}
        />
      ))}
    </ul>
    <p>Todo Counter: {todos.length} </p>
    <p>
      Todo in work: {todos.filter(({ complited }) => !complited).length || 0}
    </p>
    <p>
      Todo Complited: {todos.filter(({ complited }) => complited).length || 0}
    </p>
  </div>
);

export default Todolist;

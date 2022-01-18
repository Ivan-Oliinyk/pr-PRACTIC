import React from "react";
import "./Todolist.css";

const Todolist = ({ todos, onDeleteTodo, onCompliteTodo }) => (
  <div className="Todo__wrapper">
    <h2 className="Todo__title">Todo List</h2>
    <ul className="Todo__list">
      {todos.map(({ id, text, complited }, idx) => (
        <li className="Todo__item" key={id}>
          <p className={complited ? "comlited" : ""}>{text}</p>
          <div className="Btn__wrapper">
            <button
              onClick={() => onCompliteTodo(idx)}
              className="btn__complited"
              type="button"
            >
              Complited
            </button>
            <button
              onClick={() => onDeleteTodo(id)}
              className="btn__delete"
              type="button"
            >
              Delete
            </button>
          </div>
        </li>
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

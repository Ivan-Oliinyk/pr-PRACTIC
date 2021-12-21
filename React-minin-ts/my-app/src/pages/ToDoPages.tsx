import React, { useState, useEffect } from "react";
import { ToDoForm } from "../components/ToDoForm";
import { ToDoList } from "../components/ToDoList";
import { IToDo } from "../Interfases";
declare var confirm: (question: string) => boolean;

export const ToDoPages: React.FC = () => {
  const [todos, setTodos] = useState<IToDo[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("todos") || "[]") as IToDo[];

    setTodos(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addHandler = (title: string) => {
    const newToDo: IToDo = {
      title: title,
      id: Date.now(),
      complited: false,
    };

    // setTodos([newToDo, ...todos]);
    setTodos((prev) => [newToDo, ...prev]);
  };

  const toogleHandler = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            complited: !todo.complited,
          };
        }
        return todo;
      })
    );
  };
  const removeHandler = (id: number) => {
    const should = confirm("Вы уверенны что хотите удалить запись?");
    if (should) {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    }
  };

  return (
    <React.Fragment>
      <ToDoForm onAdd={addHandler} />
      <ToDoList
        todos={todos}
        onRemove={removeHandler}
        onToggle={toogleHandler}
      />
    </React.Fragment>
  );
};

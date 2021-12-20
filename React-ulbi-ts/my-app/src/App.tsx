import React, { useState } from "react";
import { NavBar } from "./components/NavBar";
import { ToDoForm } from "./components/ToDoForm";
import { ToDoList } from "./components/ToDoList";
import { IToDo } from "./Interfases";

const App: React.FC = () => {
  const [todos, setTodos] = useState<IToDo[]>([]);

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
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  return (
    <>
      <NavBar />
      <div className="container">
        <ToDoForm onAdd={addHandler} />
        <ToDoList
          todos={todos}
          onRemove={removeHandler}
          onToggle={toogleHandler}
        />
      </div>
    </>
  );
};

export default App;

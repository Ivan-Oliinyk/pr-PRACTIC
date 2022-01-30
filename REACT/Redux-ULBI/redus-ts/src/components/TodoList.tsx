import React, { useEffect } from "react";
import { useActions } from "../hooks/useActions";
import { useTypedSelector } from "../hooks/useTypeSelector";
import { fetchTodos } from "../store/action-creators/todo";

const TodoList: React.FC = () => {
  const { page, error, loading, limit, todos } = useTypedSelector(
    (state) => state.todo
  );
  const { fetchTodos, setTodoPage } = useActions();
  const pages = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchTodos(page, limit);
  }, [page]);

  if (loading) {
    return <h1>loading ....</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.id} - {todo.title}
        </div>
      ))}
      <div style={{ display: "flex" }}>
        {pages.map((p, i) => (
          <div
            key={i}
            style={{
              backgroundColor: p === page ? "green" : "white",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => setTodoPage(p)}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;

import React, { useEffect } from "react";
import { useActions } from "../hooks/useAction";
import { useTypeSelector } from "../hooks/useTypeSelector";

const TodoList: React.FC = () => {
  const { error, loading, page, todos, limit } = useTypeSelector(
    ({ todo }) => todo
  );

  const { fetchTodos, setTodoPage } = useActions();

  const pages = [1, 2, 3, 4, 5];

  useEffect(() => {
    fetchTodos(page, limit);
  }, [page]);

  if (loading) {
    return <h1>Loading ... </h1>;
  }

  if (error) {
    return <h1>{Error}</h1>;
  }

  return (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          {todo.id}) {todo.title};
        </div>
      ))}
      {pages.map((p) => (
        <button
          key={p}
          style={{
            backgroundColor: p === page ? "green" : "white",
            cursor: "pointer",
            padding: "10px",
            margin: "1px",
            borderRadius: "5px",
          }}
          onClick={() => setTodoPage(p)}
        >
          {p}
        </button>
      ))}
    </div>
  );
};

export default TodoList;

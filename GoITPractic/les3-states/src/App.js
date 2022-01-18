import React, { Component } from "react";
import ColorPicker from "./components/Colorpicker";
import Counter from "./components/Counter/Counter";
import Dropdown from "./components/Dropdown/Dropdown";
import Todolist from "./components/Todolist";
import TodoEditor from "./components/TodoEditor/TodoEditor";
import Filter from "./components/Filter/Filter";

const colorPickerOptions = [
  { label: "red", color: "red" },
  { label: "green", color: "green" },
  { label: "orange", color: "orange" },
  { label: "purple", color: "purple" },
  { label: "teal", color: "teal" },
  { label: "black", color: "black" },
  { label: "yellow", color: "yellow" },
  { label: "blue", color: "blue" },
];

const todos = [
  { id: "id-1", text: "learn React", complited: false },
  { id: "id-2", text: "learn angular", complited: true },
  { id: "id-3", text: "learnn HTML", complited: false },
  { id: "id-4", text: "Learn CSS", complited: false },
  { id: "id-5", text: "undenstend Reduce", complited: false },
];

class App extends Component {
  state = {
    todos: todos,
    filter: "",
  };

  deleteTodo = (todoId) => {
    this.setState(({ todos }) => ({
      todos: todos.filter(({ id }) => id !== todoId),
    }));
  };

  compliteTodo = (index) => {
    this.setState(({ todos }) => ({
      todos: todos.map((el, idx) =>
        idx === index ? { ...el, complited: !el.complited } : el
      ),
    }));
  };

  addTodo = (text) => {
    const todo = {
      id: Date.now(),
      text,
      complited: false,
    };

    this.setState(({ todos }) => ({
      todos: [todo, ...todos],
    }));
  };

  onChangeFilter = (e) => {
    this.setState({ filter: e.currentTarget.value });
  };

  getVisibleTodos = () => {
    const { todos, filter } = this.state;
    const normalizeFilter = filter.toLowerCase();

    return todos.filter((todo) =>
      todo.text.toLowerCase().includes(normalizeFilter)
    );
  };

  render() {
    const { todos, filter } = this.state;
    const visibleTodos = this.getVisibleTodos();

    return (
      <>
        <Counter />
        <Dropdown />
        <ColorPicker options={colorPickerOptions} />
        <Filter value={filter} onChange={this.onChangeFilter} />
        <TodoEditor onSubmit={this.addTodo} />
        <Todolist
          todos={visibleTodos}
          onDeleteTodo={this.deleteTodo}
          onCompliteTodo={this.compliteTodo}
        />
      </>
    );
  }
}

export default App;

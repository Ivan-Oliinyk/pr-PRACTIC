import React, { Component } from "react";
import ColorPicker from "./components/Colorpicker";
import Counter from "./components/Counter/Counter";
import Dropdown from "./components/Dropdown/Dropdown";
import Todolist from "./components/Todolist";

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

class App extends Component {
  state = {
    todos: [
      { id: "id-1", text: "Todo 1", complited: false },
      { id: "id-2", text: "Todo 2", complited: true },
      { id: "id-3", text: "Todo 3", complited: false },
      { id: "id-4", text: "Todo 4", complited: false },
      { id: "id-5", text: "Todo 5", complited: false },
    ],
  };

  deleteTodo = (todoId) => {
    this.setState((prevState) => ({
      todos: prevState.todos.filter(({ id }) => id !== todoId),
    }));
  };

  compliteTodo = (index) => {
    this.setState((prevState) => ({
      todos: prevState.todos.map((el, idx) =>
        idx === index ? { ...el, complited: !el.complited } : el
      ),
    }));
  };

  render() {
    const { todos } = this.state;

    return (
      <>
        <Counter />
        <Dropdown />
        <ColorPicker options={colorPickerOptions} />
        <Todolist
          todos={todos}
          onDeleteTodo={this.deleteTodo}
          onCompliteTodo={this.compliteTodo}
        />
      </>
    );
  }
}

export default App;

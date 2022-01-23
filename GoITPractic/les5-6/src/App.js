import React, { Component } from "react";
import ColorPicker from "./components/Colorpicker";
import Counter from "./components/Counter/Counter";
import Dropdown from "./components/Dropdown/Dropdown";
import Todolist from "./components/Todolist";
import TodoEditor from "./components/TodoEditor/TodoEditor";
import Filter from "./components/Filter/Filter";
import Modal from "./components/Modal/Modal";
import Clock from "./components/Clock/Clock";
import Tabs from "./components/Tabs/Tabs";
import tabsItrem from "./tabs.json";

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

// const todos = [
//   { id: "id-1", text: "learn React", complited: false },
//   { id: "id-2", text: "learn angular", complited: true },
//   { id: "id-3", text: "learnn HTML", complited: false },
//   { id: "id-4", text: "Learn CSS", complited: false },
//   { id: "id-5", text: "undenstend Reduce", complited: false },
// ];

class App extends Component {
  state = {
    todos: [],
    filter: "",
    showModal: false,
  };

  componentDidMount() {
    const todos = localStorage.getItem("todos");
    const parseTodos = JSON.parse(todos);

    console.log("ParseTodos => :", parseTodos);

    if (parseTodos) {
      this.setState({ todos: parseTodos });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    localStorage.setItem("todos", JSON.stringify(this.state.todos));
  }

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

  toggleModal = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };

  render() {
    const { todos, filter, showModal } = this.state;
    const visibleTodos = this.getVisibleTodos();

    return (
      <>
        <button className="btn modal" type="button" onClick={this.toggleModal}>
          Open modal
        </button>
        {showModal && (
          <Modal close={this.toggleModal}>
            <Clock></Clock>
            <h2>This is modal</h2>
            <p>
              Существует несколько стадий жизненного цикла, каждый из которых
              вызывает для компонента методы наследуемые от React.Component. Мы
              можем переопределить их поведение добавив необходимый функционал,
              в рамках установленных правил. Существует несколько стадий
              жизненного цикла, каждый из которых вызывает для компонента методы
              наследуемые от React.Component. Мы можем переопределить их
              поведение добавив необходимый функционал, в рамках установленных
              правил. Существует несколько стадий жизненного цикла, каждый из
              которых вызывает для компонента методы наследуемые от
              React.Component. Мы можем переопределить их поведение добавив
              необходимый функционал, в рамках установленных правил.
            </p>
            <button type="button" onClick={this.toggleModal}>
              Close modal
            </button>
          </Modal>
        )}
        <Tabs items={tabsItrem}></Tabs>
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

import React, { Component } from "react";
import "./TodoEditor.scss";

class TodoEditor extends Component {
  state = {
    message: "",
  };

  handleOnChange = (e) => {
    this.setState({ message: e.currentTarget.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    console.log(this.state.message);
    console.log("Submit");
    this.props.onSubmit(this.state.message);
    this.setState({ message: "" });
  };

  render() {
    return (
      <>
        <form className="TodoEditor" onSubmit={this.handleSubmit}>
          <textarea
            value={this.state.message}
            onChange={this.handleOnChange}
          ></textarea>
          <button className="btn" type="submit">
            Save
          </button>
        </form>
      </>
    );
  }
}

export default TodoEditor;

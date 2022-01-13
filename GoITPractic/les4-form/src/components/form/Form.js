import React from "react";
import { Component } from "react/cjs/react.production.min";
import "./Form.css";

class Form extends Component {
  state = {
    name: "",
    phone: "",
    email: "",
  };

  handleNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  handlePhoneChange = (event) => {
    this.setState({ phone: event.target.value });
  };

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  render() {
    return (
      <>
        <form>
          <h2>Form</h2>
          <label>
            <h3>Name :</h3>
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleNameChange}
            ></input>
          </label>
          <label>
            <h3>Phone :</h3>
            <input
              type="phone"
              value={this.state.phone}
              onChange={this.handlePhoneChange}
            ></input>
          </label>
          <label>
            <h3>Email :</h3>
            <input
              type="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            ></input>
          </label>
        </form>
      </>
    );
  }
}

export default Form;

import React from "react";
import { Component } from "react/cjs/react.production.min";
import "./Form.css";

class Form extends Component {
  state = {
    name: "",
    phone: "",
    email: "",
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.data(this.state);
    this.reset();
  };

  reset = () => {
    this.setState({ name: "", phone: "", email: "" });
  };

  labelsData = [
    { name: "name", type: "text", title: "Name :" },
    { name: "phone", type: "phone", title: "Phone :" },
    { name: "email", type: "email", title: "Email :" },
  ];

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <h2>Form</h2>
          {this.labelsData.map(({ name, type, title }, i) => (
            <label key={i}>
              <h3>{title}</h3>
              <input
                name={name}
                type={type}
                value={this.state[name]}
                onChange={this.handleChange}
              ></input>
            </label>
          ))}
          <button className="btn" type="submit">
            Submit
          </button>
        </form>
      </>
    );
  }
}

export default Form;

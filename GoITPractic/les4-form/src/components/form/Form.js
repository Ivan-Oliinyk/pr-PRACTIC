import React from "react";
import { Component } from "react/cjs/react.production.min";
import "./Form.css";

class Form extends Component {
  state = {
    name: "",
    phone: "",
    email: "",
    experiance: "Junior",
    licence: false,
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

  handleLicenceChange = (e) => {
    this.setState({ licence: e.currentTarget.checked });
  };

  reset = () => {
    this.setState({ name: "", phone: "", email: "" });
  };

  labelsData = [
    { name: "name", type: "text", title: "Name :" },
    { name: "phone", type: "phone", title: "Phone :" },
    { name: "email", type: "email", title: "Email :" },
  ];

  radioData = ["Junior", "Middle", "Senior"];

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
          <div className="radio-box">
            <h2>Experiance</h2>
            {this.radioData.map((el) => (
              <label className="input__radio" key={el}>
                <input
                  type="radio"
                  name="experiance"
                  value={el}
                  onChange={this.handleChange}
                  checked={this.state.experiance === el}
                />
                {el}
              </label>
            ))}
          </div>
          <div className="checkbox-wrapper">
            <label>
              <input
                type="checkbox"
                name="licence"
                value="true-licence"
                checked={this.state.licence}
                onChange={this.handleLicenceChange}
              />
              Согласны ли вы с условием ?
            </label>
          </div>
          <button className="btn" type="submit" disabled={!this.state.licence}>
            Submit
          </button>
        </form>
      </>
    );
  }
}

export default Form;

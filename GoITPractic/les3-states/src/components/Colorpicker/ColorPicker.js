import React, { Component } from "react";
import "./ColorPicker.css";

class ColorPicker extends Component {
  state = {
    activeOptionsIdx: 0,
  };

  changeColor = (value) => {
    this.setState({ activeOptionsIdx: value });
  };

  render() {
    return (
      <div
        className="ColorPicker__wrapper"
        style={{
          backgroundColor:
            this.props.options[this.state.activeOptionsIdx].color,
        }}
      >
        <h1 className="Color__name">Name</h1>
        <div className="Img__wrapper-container">
          {this.props.options.map(({ label, color }, index) => (
            <button
              type="button"
              key={index}
              style={{
                backgroundColor: color,
                boxShadow:
                  this.state.activeOptionsIdx === index && `0 0 20px ${color}`,
              }}
              className={
                this.state.activeOptionsIdx === index
                  ? "img__wrapper active-btn"
                  : "img__wrapper"
              }
              onClick={() => this.changeColor(index)}
            ></button>
          ))}
        </div>
      </div>
    );
  }
}

export default ColorPicker;

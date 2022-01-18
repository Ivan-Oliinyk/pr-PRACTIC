import React, { Component } from "react";
import "./ColorPicker.css";

class ColorPicker extends Component {
  state = {
    activeOptionsIdx: 0,
  };

  changeColor = (index) => {
    this.setState({ activeOptionsIdx: index });
  };

  makeOptionClassName = (index) => {
    const optionClasses = ["img__wrapper"];

    index === this.state.activeOptionsIdx && optionClasses.push("active-btn");

    return optionClasses.join(" ");
  };

  render() {
    const { activeOptionsIdx } = this.state;
    const { options } = this.props;
    const activeOptionColor = options[activeOptionsIdx].color;
    const activeOptionLabel = options[activeOptionsIdx].label;

    return (
      <div
        className="ColorPicker__wrapper"
        style={{
          backgroundColor: activeOptionColor,
        }}
      >
        <h1 className="Color__name">{activeOptionLabel}</h1>
        <div className="Img__wrapper-container">
          {options.map(({ label, color }, index) => {
            return (
              <button
                type="button"
                key={label}
                style={{
                  backgroundColor: color,
                  boxShadow: activeOptionsIdx === index && `0 0 20px ${color}`,
                }}
                className={this.makeOptionClassName(index)}
                onClick={() => this.changeColor(index)}
              ></button>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ColorPicker;

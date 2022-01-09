import React from "react";
import style from "./Counter.module.css";

const { counter, counter__value, counter__controls } = style;

class Counter extends React.Component {
  constructor() {
    super();

    this.state = {
      value: 0,
    };
  }

  handleIncrement = (event) => {
    console.log("increment");
    const { target } = event;

    setTimeout(() => {
      console.log(target);
    }, 1000);
  };

  handleDecreement = () => {
    console.log("decrement");
  };

  render() {
    return (
      <div className={counter}>
        <span className={counter__value}>0</span>
        <div className={counter__controls}>
          <button type="button" onClick={this.handleIncrement}>
            Add 1
          </button>
          <button type="button" onClick={this.handleDecreement}>
            Minus 1
          </button>
        </div>
      </div>
    );
  }
}

export default Counter;

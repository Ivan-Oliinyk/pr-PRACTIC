import React from "react";
import "./Counter.css";
import Controls from "./Controls";
import Value from "./Value";

class Counter extends React.Component {
  static defaultProps = {
    initialvalue: 0,
  };

  state = {
    value: this.props.initialvalue,
  };

  handleIncrement = () => {
    this.setState((prev) => ({ value: prev.value + 1 }));
  };

  handleDecreement = () => {
    this.setState((prev) => ({ value: prev.value - 1 }));
  };

  render() {
    return (
      <div className="counter">
        <Value value={this.state.value} />
        <Controls
          onIcrement={this.handleIncrement}
          onDecrement={this.handleDecreement}
        />
      </div>
    );
  }
}

export default Counter;

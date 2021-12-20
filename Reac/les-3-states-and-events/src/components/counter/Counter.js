import React from "react";
import './Counter.css'
import Controls from "./Controls";
import CounterValue from "./value";

class Counter extends React.Component {
  static defaultProps = {
    initialValue: 0
  }

  state = {
    value: this.props.initialValue
  }

  handleIncrement = () => {
    this.setState(prevState => ({
        value: prevState.value + 1,
    }))    
  }

  handleDecrement = () => {
    this.setState(prevState => ({
      value: prevState.value -1,
    })) 
  }

  render() {
    return (
      <div className="Counter">
        <CounterValue value = {this.state.value} />
        <Controls onIncrement={this.handleIncrement} onDecrement={this.handleDecrement} />
      </div>
    );
  }
}

export default Counter

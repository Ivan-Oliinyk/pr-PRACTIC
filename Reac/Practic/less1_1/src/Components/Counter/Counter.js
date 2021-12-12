import React from 'react';
import './Counter.css'

class Counter extends React.Component {
  constructor() {
    super()

    this.state = {
      value: 1,
    }
  }

  handleIncrement = (event) => {
    this.state.value += 1
  }

   handleDecrement = () => {
     this.state.value -= 1
  }

  render() {
    return (
      <div className='Counter'>
        <span className='Counter__value'>{this.state.value}</span>
        <div className='Counter__controls'>
          <button className="button" type="button" onClick={this.handleIncrement}>Add 1</button>
          <button className="button" type="button" onClick={this.handleDecrement}>Munus 1</button>
        </div>
      </div>
    )
  }
}

export default Counter;
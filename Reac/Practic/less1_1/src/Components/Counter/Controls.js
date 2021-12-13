import React from "react";

const Controls = ({onIncrement, onDecrement}) => (
  <div className='Counter__controls'>
    <button className="button" type="button" onClick={onIncrement}>Add 1</button>
    <button className="button" type="button" onClick={onDecrement}>Munus 1</button>
  </div>
)

export default Controls
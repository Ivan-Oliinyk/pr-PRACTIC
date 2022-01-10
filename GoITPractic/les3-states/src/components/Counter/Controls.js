import React from "react";

const Controls = ({ onIcrement, onDecrement }) => (
  <div className="counter__controls">
    <button type="button" onClick={onIcrement}>
      Add 1
    </button>
    <button type="button" onClick={onDecrement}>
      Minus 1
    </button>
  </div>
);

export default Controls;

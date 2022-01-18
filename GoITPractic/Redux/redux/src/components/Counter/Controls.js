import React from "react";

const Controls = ({ step, onIcrement, onDecrement }) => (
  <div className="counter__controls">
    <button type="button" onClick={onIcrement}>
      Add {step}
    </button>
    <button type="button" onClick={onDecrement}>
      Minus {step}
    </button>
  </div>
);

export default Controls;

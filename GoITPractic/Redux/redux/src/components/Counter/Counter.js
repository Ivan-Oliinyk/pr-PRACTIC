import React from "react";
import { connect } from "react-redux";
import "./Counter.css";
import Controls from "./Controls";
import Value from "./Value";
import * as action from "../../redux/actions";

const Counter = ({ value, step, onIncrement, onDecrement }) => {
  return (
    <div className="counter">
      <Value value={value} />
      <Controls
        step={step}
        onIcrement={() => onIncrement(step)}
        onDecrement={() => onDecrement(step)}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  value: state.counter.value,
  step: state.counter.step,
});

const mapDispatchToProps = (dispatch) => ({
  onIncrement: (value) => dispatch(action.increment(value)),
  onDecrement: (value) => dispatch(action.decrement(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Counter);

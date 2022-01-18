import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

// const initialState = {
//   // counterValue: 0,
//   counter: {
//     value: 0,
//     step: 1,
//   },
// };

// const reducer = (state = initialState, { type, payload }) => {
//   switch (type) {
//     case "counter/Increment":
//       return {
//         // counterValue: state.counterValue + payload,
//         ...state,
//         counter: {
//           ...state.counter,
//           value: state.counter.value + payload,
//         },
//       };

//     case "counter/Decrement":
//       return {
//         // counterValue: state.counterValue - payload,
//         ...state,
//         counter: {
//           ...state.counter,
//           value: state.counter.value - payload,
//         },
//       };

//     default:
//       return state;
//   }
// };

// const counterInitialState = {
//   value: 1,
//   step: 2,
// };

const valueReducer = (state = 10, { type, payload }) => {
  switch (type) {
    case "counter/Increment":
      return state + payload;

    case "counter/Decrement":
      return state - payload;

    default:
      return state;
  }
};

const stepReducer = (state = 5, action) => state;

const counterReducer = combineReducers({
  value: valueReducer,
  step: stepReducer,
});

const rootReducer = combineReducers({
  counter: counterReducer,
});

// const store = createStore(reducer, composeWithDevTools());
const store = createStore(rootReducer, composeWithDevTools());

export default store;

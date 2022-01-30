import { createStore, combineReducers, applyMiddleware } from "redux";
import cashReducer from "./cashReducer";
import customerReducer from "./customReducer";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  cash: cashReducer,
  customers: customerReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

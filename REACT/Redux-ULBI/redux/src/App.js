import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  addCustomerAction,
  addRemoveByNameAction,
  clearAllUserAction,
} from "./store/customReducer";

import {
  addCashAction,
  getCashAction,
  clearCashAction,
} from "./store/cashReducer";
import { fetchCusomers } from "./store/asyncAction/customers";

function App() {
  const dispatch = useDispatch();
  const cash = useSelector((state) => state.cash.cash);
  const customers = useSelector((state) => state.customers.customers);
  // console.log(customers);
  // console.log(cash);

  const addCash = (n = 1) => {
    dispatch(addCashAction(n));
  };

  const getCash = (n = 1) => {
    dispatch(getCashAction(n));
  };

  const clearCash = () => {
    dispatch(clearCashAction());
  };

  const clearAllUsers = () => {
    dispatch(clearAllUserAction());
  };

  const addUser = (title) => {
    if (title) {
      const customer = {
        title,
        id: Date.now(),
      };

      return dispatch(addCustomerAction(customer));
    }
  };

  const removeUserByName = (title) => {
    if (title) {
      // dispatch({ type: "REMOVE_CUSTOMERS", payload: name });
      dispatch(addRemoveByNameAction(title));
    }
  };

  return (
    <div>
      <div className="cash-wrapper">
        <h1>cash</h1>
        <div className="cash">{cash}</div>
        <div className="btn-wrapper">
          <button className="btn" type="button" onClick={() => addCash()}>
            Add cash
          </button>
          <button className="btn" type="button" onClick={() => getCash()}>
            Get cash
          </button>
          <button className="btn" type="button" onClick={() => clearCash()}>
            Clear cash
          </button>
        </div>
      </div>
      <div className="users">
        <div className="btn-users">
          <button
            className="btn"
            type="button"
            onClick={() => addUser(prompt())}
          >
            Add user
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => removeUserByName(prompt())}
          >
            Delete user by name
          </button>
          <button className="btn" type="button" onClick={() => clearAllUsers()}>
            Clear users
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => dispatch(fetchCusomers())}
          >
            Get User form DB
          </button>
        </div>
        {customers.length === 0 ? (
          <h2>user was upsend</h2>
        ) : (
          <div>
            <ol
              className="list
            "
            >
              {customers.map(({ title, id }, i) => (
                <li key={i} onClick={() => removeUserByName(title)}>
                  {title}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

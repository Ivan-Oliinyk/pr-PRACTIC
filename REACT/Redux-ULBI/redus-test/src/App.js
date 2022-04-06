import { useDispatch, useSelector } from "react-redux";
import {
  addCustomerAction,
  removeCustomerAction,
  removeAllCustomers,
} from "./store/customerReducer";

import { ADD_CASH, GET_CASH } from "./store/cashReducer";

function App() {
  const dispatch = useDispatch();
  const cash = useSelector(({ cash }) => cash.cash);
  const customers = useSelector((state) => state.customers.customers);

  const addCash = (value) => dispatch({ type: ADD_CASH, payload: value });

  const getCash = (value) => dispatch({ type: GET_CASH, payload: value });

  const addCustomer = (name) => {
    if (name !== "") {
      dispatch(addCustomerAction(name));
    }
  };

  const removeCustomer = (name) => dispatch(removeCustomerAction(name));

  const removeAllCostomer = () => dispatch(removeAllCustomers());

  console.log(cash);
  console.log(customers);

  return (
    <div className="App">
      <div>
        <h2>{cash}</h2>
        <div>
          <button onClick={() => addCash(1)}>Add cash</button>
          <button onClick={() => getCash(1)}>Get cash</button>
        </div>
      </div>
      <div>
        <h2>Customers</h2>
        <div>
          <button onClick={() => addCustomer(prompt())}>Add customer</button>
          <button onClick={() => removeCustomer(prompt())}>
            Remove customer
          </button>
          <button onClick={() => removeAllCostomer()}>Remove ALL</button>
        </div>
        {customers.length === 0 ? (
          <p>no costomers</p>
        ) : (
          <div>
            <ol>
              {customers.map((name, i) => (
                <li
                  onClick={() => removeCustomer(name)}
                  key={i}
                  style={{
                    cursor: "pointer",
                    padding: "10px",
                    backgroundColor: "green",
                    display: "inline-block",
                    margin: "5px",
                  }}
                >
                  {name}
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

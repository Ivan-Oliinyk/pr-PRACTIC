import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomers } from "./asyncActions/customers";
import { addCash, getCash, clearCash } from "./store/cashReducer";
import {
  addUser,
  removeUser,
  clearUser,
  clearAllUsers,
} from "./store/customerReducer";

const App = () => {
  const dispatch = useDispatch();
  const cash = useSelector((state) => state.cash.cash);
  const users = useSelector((state) => state.customers.users);

  const handleOnAddCash = (cash) => {
    dispatch(addCash(cash));
  };

  const handleOnGetCash = (cash) => {
    dispatch(getCash(cash));
  };

  const handleOnClearCash = () => {
    dispatch(clearCash());
  };

  const handleOnAddUser = (name) => {
    const user = {
      name,
      id: Date.now(),
    };

    dispatch(addUser(user));
  };

  const deleteUserByName = (name) => {
    dispatch(removeUser(name));
  };

  const deleteOnClick = (id) => {
    dispatch(clearUser(id));
  };

  const clearUserList = () => {
    dispatch(clearAllUsers());
  };

  return (
    <div className="container">
      <div className="cash__wrapper">
        <div className="count">{cash}</div>
        <div className="btns">
          <button
            type="button"
            onClick={() => handleOnAddCash(Number(prompt()))}
          >
            Add cash
          </button>
          <button
            type="button"
            onClick={() => handleOnGetCash(Number(prompt()))}
          >
            Get cash
          </button>
          <button type="button" onClick={() => handleOnClearCash()}>
            Clear
          </button>
        </div>
      </div>
      <div className="users__wrapper">
        <div className="btns">
          <button type="button" onClick={() => handleOnAddUser(prompt())}>
            Add user
          </button>
          <button type="button" onClick={() => deleteUserByName(prompt())}>
            Delete user by name
          </button>
          <button type="button" onClick={() => clearUserList()}>
            Clear all
          </button>
          <button type="button" onClick={() => dispatch(fetchCustomers())}>
            Get user from dB
          </button>
        </div>
        {users.length === 0 ? (
          <p className="Aler">No User in list</p>
        ) : (
          <ol className="user__list">
            {users.map(({ name, id }) => (
              <li key={id} onClick={() => deleteOnClick(id)}>
                {name}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default App;

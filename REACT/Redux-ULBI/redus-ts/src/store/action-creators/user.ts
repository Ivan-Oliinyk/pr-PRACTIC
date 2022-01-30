import { Dispatch } from "redux";
import { UserAction, UserActionTypes } from "../../types/user";
import axios from "axios";

// https://jsonplaceholder.typicode.com/users
export const fetchUsers = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    try {
      dispatch({ type: UserActionTypes.FETCH_USERS });
      const response = await await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      setTimeout(() => {
        dispatch({
          type: UserActionTypes.FETCH_USERS_SUCCESS,
          payload: response.data,
        });
      }, 1000);
    } catch (e) {
      dispatch({
        type: UserActionTypes.FETCH_USERS_ERROR,
        payload: "Произошла ошибка при загурзке пользователя",
      });
    }
  };
};

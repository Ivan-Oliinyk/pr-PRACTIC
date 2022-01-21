const deafaultState = {
  users: [],
};

const ADD_USER = "ADD_USER";
const REMOVE_USER = "REMOVE_USER";
const CLEAR_USER = "CLEAR_USER";
const CLEAR_LIST = "CLEAR_LIST";

export const customerReducer = (state = deafaultState, action) => {
  switch (action.type) {
    case ADD_USER:
      return { ...state, users: [...state.users, action.payload] };
    case REMOVE_USER:
      return {
        ...state,
        users: state.users.filter(
          (el) => el.name.toLowerCase() !== action.payload.toLowerCase()
        ),
      };
    case CLEAR_USER:
      return {
        ...state,
        users: state.users.filter(({ id }) => id !== action.payload),
      };
    case CLEAR_LIST:
      return { ...state, users: [] };

    default:
      return state;
  }
};

export const addUser = (payload) => ({ type: ADD_USER, payload });
export const removeUser = (payload) => ({ type: REMOVE_USER, payload });
export const clearUser = (payload) => ({ type: CLEAR_USER, payload });
export const clearAllUsers = () => ({ type: CLEAR_LIST });

const deafaultState = {
  cash: 0,
};

const ADD_CASH = "ADD_CASH";
const GET_CASH = "GET_CASH";
const CLEAR = "CLEAR";

export const cashReducer = (state = deafaultState, action) => {
  switch (action.type) {
    case ADD_CASH:
      return { ...state, cash: state.cash + action.payload };
    case GET_CASH:
      return { ...state, cash: state.cash - action.payload };
    case CLEAR:
      return { ...state, cash: 0 };

    default:
      return state;
  }
};

export const addCash = (payload) => ({ type: ADD_CASH, payload });
export const getCash = (payload) => ({ type: GET_CASH, payload });
export const clearCash = () => ({ type: CLEAR });

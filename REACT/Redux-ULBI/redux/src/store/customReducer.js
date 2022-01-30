const defaultState = {
  customers: [],
};

const ADD_CUSTOMER = "ADD_CUSTOMER";
const REMOVE_CUSTOMERS = "REMOVE_CUSTOMERS";
const CLEAR_CUSTOMERS = "CLEAR_CUSTOMERS";
const ADD_MANY_USERS = "ADD_MANY_USERS";

const customerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };

    case REMOVE_CUSTOMERS:
      return {
        ...state,
        customers: state.customers.filter(
          ({ title }) => title.toLowerCase() !== action.payload.toLowerCase()
        ),
      };

    case CLEAR_CUSTOMERS:
      return { ...state, customers: [] };

    case ADD_MANY_USERS:
      return {
        ...state,
        customers: [...state.customers, ...action.payload],
      };

    default:
      return state;
  }
};

export const addCustomerAction = (payload) => ({
  type: ADD_CUSTOMER,
  payload,
});

export const addRemoveByNameAction = (payload) => ({
  type: REMOVE_CUSTOMERS,
  payload,
});

export const clearAllUserAction = () => ({
  type: CLEAR_CUSTOMERS,
});

export const addManyUsersAction = (payload) => ({
  type: ADD_MANY_USERS,
  payload,
});

export default customerReducer;

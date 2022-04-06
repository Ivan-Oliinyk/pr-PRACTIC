const defaultState = {
  customers: [],
};

const ADD_CUSTOMER = "ADD_CUSTOMER";
const REMOVE_CUSTOMER = "REMOVE_CUSTOMER";
const REMOVE_ALL_CUSTOMERS = "REMOVE_ALL_CUSTOMERS";
const ADD_MANY_CUSTOMERS = "ADD_MANY_CUSTOMERS";

export const customerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_MANY_CUSTOMERS:
      return { ...state, customers: [...state.customers, ...action.payload] };

    case ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case REMOVE_CUSTOMER:
      return {
        ...state,
        customers: [
          ...state.customers.filter(
            ({ name }) => name.toLowerCase() !== action.payload.toLowerCase()
          ),
        ],
      };
    case REMOVE_ALL_CUSTOMERS:
      return { customers: [] };

    default:
      return state;
  }
};

export const addManyCustomersAction = (payload) => ({
  type: ADD_MANY_CUSTOMERS,
  payload,
});

export const addCustomerAction = (payload) => ({
  type: ADD_CUSTOMER,
  payload,
});

export const removeCustomerAction = (payload) => ({
  type: REMOVE_CUSTOMER,
  payload,
});

export const removeAllCustomers = () => ({ type: REMOVE_ALL_CUSTOMERS });

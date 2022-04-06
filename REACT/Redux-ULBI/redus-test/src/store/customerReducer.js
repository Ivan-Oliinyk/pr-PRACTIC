const defaultState = {
  customers: ["Ivan", "Sandra"],
};

const ADD_CUSTOMER = "ADD_CUSTOMER";
const REMOVE_CUSTOMER = "REMOVE_CUSTOMER";
const REMOVE_ALL_CUSTOMERS = "REMOVE_ALL_CUSTOMERS";

export const customerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_CUSTOMER:
      return { ...state, customers: [...state.customers, action.payload] };
    case REMOVE_CUSTOMER:
      return {
        ...state,
        customers: [
          ...state.customers.filter(
            (name) => name.toLowerCase() !== action.payload.toLowerCase()
          ),
        ],
      };
    case REMOVE_ALL_CUSTOMERS:
      return { customers: [] };

    default:
      return state;
  }
};

export const addCustomerAction = (payload) => ({
  type: ADD_CUSTOMER,
  payload,
});

export const removeCustomerAction = (payload) => ({
  type: REMOVE_CUSTOMER,
  payload,
});

export const removeAllCustomers = () => ({ type: REMOVE_ALL_CUSTOMERS });

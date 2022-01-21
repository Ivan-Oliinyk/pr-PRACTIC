export type TItem = {
  [key: string]: { type: string; value: string };
};

export type TAction = {
  type: string;
  payload: any;
};

const defaultState: TItem = {
  name: { type: "text", value: "John DeVill" },
  email: { type: "email", value: "test@gmail.com" },
  password: { type: "password", value: "6" },
};

export function mainReducer(state = defaultState, action: TAction) {
  switch (action.type) {
    case "CHANGE":
      return { ...action.payload };

    default:
      return state;
  }
}

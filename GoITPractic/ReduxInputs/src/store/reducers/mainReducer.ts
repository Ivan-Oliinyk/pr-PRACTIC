export type TItem = {
  key: string;
  value: string;
};

export type TAction = {
  type: string;
  payload: any;
};

const defaultState: TItem[] = [
  { key: "INPUT_1", value: "123" },
  { key: "INPUT_2", value: "ABC" },
  { key: "INPUT_3", value: "ABC" },
  { key: "INPUT_4", value: "ABC" },
  { key: "INPUT_5", value: "ABC" },
];

export function mainReducer(state = defaultState, action: TAction) {
  switch (action.type) {
    case "CHANGE":
      return action.payload;

    default:
      return state;
  }
}

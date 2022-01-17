import React, { useState } from "react";
import data from "../data-l7P1yDRd0eO4EvNXu0KtS.json";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  skills: string[];
};

export type TUsersDispatch = (users: TUser[]) => void;

export const UsersStateContext = React.createContext<TUser[]>([]);

export const UsersDispatchContext = React.createContext<TUsersDispatch>(
  console.log
);

function prepareData(): TUser[] {
  return data.map(({ _id, list, email, skills }) => {
    return {
      _id: _id.toString(),
      name: list,
      email,
      skills: skills.split(", "),
    };
  });
}

export default ({ children }: React.PropsWithChildren<{}>) => {
  const [users, setUsers] = useState<TUser[]>(prepareData());
  return (
    <UsersStateContext.Provider value={users}>
      <UsersDispatchContext.Provider value={setUsers}>
        {children}
      </UsersDispatchContext.Provider>
    </UsersStateContext.Provider>
  );
};

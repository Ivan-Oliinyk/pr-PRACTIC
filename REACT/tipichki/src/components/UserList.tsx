import React from "react";
import User from "./User";
import { UserProps } from "./User";

export type UserListProps = {
  dataList: UserProps[];
};

const UserList: React.FC<UserListProps> = ({ dataList }) => {
  return (
    <>
      <ul className="list">
        {dataList.map(({ list, email, skills, _id }) => (
          <User key={_id} list={list} email={email} skills={skills} _id={_id} />
        ))}
      </ul>
    </>
  );
};

export default UserList;

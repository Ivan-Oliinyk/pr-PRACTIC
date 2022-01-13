import React from "react";

export type UserProps = {
  list: string;
  email: string;
  skills: string;
  _id?: number;
};

const User: React.FC<UserProps> = ({ list, email, skills, _id }) => {
  return (
    <li>
      <h2>{list}</h2>
      <p>{email}</p>
      <p>{skills}</p>
      <p className="number">{_id}</p>
      <div className="btn-wrapper">
        <button className="btn edit">Edit</button>
        <button className="btn delete">Delete</button>
      </div>
    </li>
  );
};

export default User;

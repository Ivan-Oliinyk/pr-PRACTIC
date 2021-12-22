import React from "react";
import { NavLink } from "react-router-dom";

type Value = { value: string; classname: string; linkTo: string };

export const Btn: React.FC<Value> = ({ value, classname, linkTo }) => {
  return (
    <NavLink className={classname} to={linkTo}>
      <p>{value}</p>
    </NavLink>
  );
};

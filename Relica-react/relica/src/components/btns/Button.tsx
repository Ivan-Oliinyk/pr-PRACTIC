import React from "react";
import { NavLink } from "react-router-dom";

type Value = { value: string; prop: string; linkTo: string };

export const Button: React.FC<Value> = ({ value, prop, linkTo }) => {
  return (
    <li className="btn__item">
      {/* <a className="btn btn__link" href="/"> */}
      <NavLink className={prop} to={linkTo}>
        <p>{value}</p>
      </NavLink>
    </li>
  );
};

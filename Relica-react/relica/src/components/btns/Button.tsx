import React from "react";
import { Link } from "react-router-dom";

type Value = { value: string; prop: string; link: string };

export const Button: React.FC<Value> = ({ value, prop, link }) => {
  return (
    <li className="btn__item">
      {/* <a className="btn btn__link" href="/"> */}
      <Link className={prop} to={link}>
        <p>{value}</p>
      </Link>
    </li>
  );
};

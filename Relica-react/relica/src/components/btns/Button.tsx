import React from "react";

type Value = { value: string; prop: string };

export const Button: React.FC<Value> = ({ value, prop }) => {
  return (
    <li className="btn__item">
      {/* <a className="btn btn__link" href="/"> */}
      <a className={prop} href="/">
        <p>{value}</p>
      </a>
    </li>
  );
};

import React from "react";

type Value = { value: string };

export const Button: React.FC<Value> = ({ value }) => {
  return (
    <li className="btn__item">
      <a className="btn btn__link" href="/">
        <p>{value}</p>
      </a>
    </li>
  );
};

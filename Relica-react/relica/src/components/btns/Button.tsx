import React from "react";
import {useNavigate } from "react-router-dom";

type Value = { value: string; prop: string; linkTo: string };

export const Button: React.FC<Value> = ({ value, prop, linkTo }) => {
  const navigate = useNavigate();

  return (
    <li className="btn__item btn">
      <button className={prop} type="button" onClick={() => navigate(linkTo)}>
        {value}
      </button>
    </li>
  );
};

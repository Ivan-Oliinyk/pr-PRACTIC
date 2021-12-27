import React from "react";
import { useNavigate } from "react-router-dom";

type Value = { value: string; classname: string; linkTo: string };

export const Btn: React.FC<Value> = ({ value, classname, linkTo }) => {
  const navigate = useNavigate()
  return (
    <button className={classname} type="submit" onClick={() => navigate(linkTo)}>
      <p>{value}</p>
    </button>
  );
};

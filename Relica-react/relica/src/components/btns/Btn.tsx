import React from "react";

type Value = { value: string; classname: string };

export const Btn: React.FC<Value> = ({ value, classname }) => {
  return (
    <a className={classname} href="/">
      <p>{value}</p>
    </a>
  );
};

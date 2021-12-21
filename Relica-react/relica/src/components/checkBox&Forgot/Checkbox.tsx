import React from "react";

type Value = { value: string };

export const Checkbox: React.FC<Value> = ({ value }) => {
  return (
    <label className="input-checkbox__wrapper">
      <input className="input-checkbox" type="checkbox" />
      {value}
    </label>
  );
};

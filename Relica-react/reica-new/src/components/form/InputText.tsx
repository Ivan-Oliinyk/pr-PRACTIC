import React from "react";

type Value = { value: string };

export const InputText: React.FC<Value> = ({ value }) => {
  return (
    <div className="user-name__input-wrapper input-wrapper">
      <input
        className="input-text"
        type="text"
        name="name"
        placeholder={value}
      />
      <span className="user-name__input-descr">{value}</span>
    </div>
  );
};

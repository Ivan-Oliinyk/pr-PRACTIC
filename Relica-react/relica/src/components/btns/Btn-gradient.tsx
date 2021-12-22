import React from "react";

type Value = { value: string };

export const BtnGradient: React.FC<Value> = ({ value }) => {
  return (
    <button className="btn btn__gradient" type="button">
      {value}
    </button>
  );
};

import React from "react";

type Value = { value: string; cb?: () => void };

export const BtnGradient: React.FC<Value> = ({ value, cb }) => {
  return (
    <button className="btn btn__gradient" type="button" onClick={cb}>
      {value}
    </button>
  );
};

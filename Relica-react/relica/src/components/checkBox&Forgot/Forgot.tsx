import React from "react";

type Value = { value: string };

export const Forgot: React.FC<Value> = ({ value }) => {
  return (
    <a className="link_color" href="/">
      {value}
    </a>
  );
};

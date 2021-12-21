import React from "react";

type Value = { value: string };

export const Title: React.FC<Value> = ({ value }) => {
  return <h1 className="title-desription">{value}</h1>;
};

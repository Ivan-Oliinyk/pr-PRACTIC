import React from "react";

type Value = { value: string };

export const Title: React.FC<Value> = ({ value }) => {
  return (
    <>
      <h2 className="title">{value}</h2>
    </>
  );
};

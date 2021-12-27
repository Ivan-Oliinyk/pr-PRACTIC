import React from "react";

type Value = { value: string; substring?: string };

export const Title: React.FC<Value> = ({ value, substring }) => {
  return (
    <>
      <h2 className="title">{value}</h2>
      <p className="question">{substring}</p>
    </>
  );
};

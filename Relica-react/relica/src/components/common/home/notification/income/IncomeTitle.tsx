import React from "react";

type Ttitle = { title: string };

export const IncomeTitle: React.FC<Ttitle> = ({ title }) => {
  return (
    <>
      <h1 className="title">{title}</h1>
    </>
  );
};

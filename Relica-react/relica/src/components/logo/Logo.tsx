import React from "react";
import { useNavigate } from "react-router-dom";

type Value = {
  linkTo: string;
};

export const Logo: React.FC<Value> = ({ linkTo }) => {
  const navigate = useNavigate();

  return (
    <div className="logo-wrapper" onClick={() => navigate(linkTo)}>
      <img className="logo" src="/images/logo.png" alt="Logo" />
      <p className="title">Relica</p>
    </div>
  );
};

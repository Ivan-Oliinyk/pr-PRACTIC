import React from "react";
import { Outlet } from "react-router-dom";
import { MainBg } from "../main-bg/main-bg";

export const Login: React.FC = () => {
  return (
    <section className="hero">
      <MainBg />
      <Outlet />
    </section>
  );
};

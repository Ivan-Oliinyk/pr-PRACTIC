import React from "react";
import { Outlet } from "react-router-dom";
import { LogoBgImage } from "../layout/login/LogoBgImage";

export const Login: React.FC = () => {
  return (
    <section className="logoPage">
      <LogoBgImage />
      <Outlet />
    </section>
  );
};

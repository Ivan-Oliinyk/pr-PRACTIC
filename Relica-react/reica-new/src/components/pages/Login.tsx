import React from "react";
import { Outlet } from "react-router-dom";
import { LogoBgImage } from "../layout/login/LogoBgImage";

export const Login: React.FC = () => {
  return (
    <section className="loginPage">
      <LogoBgImage />
      <div className="login-content">
        <Outlet />
      </div>
    </section>
  );
};

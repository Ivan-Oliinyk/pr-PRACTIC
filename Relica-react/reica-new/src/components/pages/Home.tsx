import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../header/Header";

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main className="container main">
        <Outlet />
      </main>
    </>
  );
};

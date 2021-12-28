import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "../components/pages/Login";
import { WelcomePage } from "../components/layout/login/WelcomePage";
import { SelectWallet } from "../components/layout/login/SelectWallet";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route index element={<WelcomePage />} />
          <Route path="Select-Wallet" element={<SelectWallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

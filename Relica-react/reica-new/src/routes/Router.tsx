import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Login } from "../components/pages/Login";
import { WelcomePage } from "../components/layout/login/WelcomePage";
import { SelectWallet } from "../components/layout/login/SelectWallet";
import { UserName } from "../components/layout/login/UserName";
import { LoginWithWallet } from "../components/layout/login/LoginWithWallet";

import { Home } from "../components/pages/Home";

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route index element={<WelcomePage />} />
          <Route path="/Select-Wallet" element={<SelectWallet />} />
          <Route path="/User-name" element={<UserName />} />
          <Route path="/Login-with-wallet" element={<LoginWithWallet />} />
        </Route>
        <Route path="/Home" element={<Home />}>
          {/* <Route index element={<WelcomePage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Welcome from "../layout/Login/Welcome";
import SelectWallet from "../layout/Login/SelectWallet";
import UserName from "../layout/Login/UserName";
import LoginWithWallet from "../layout/Login/LoginWithWallet";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route index element={<Welcome />} />
          <Route path="Select-wallet" element={<SelectWallet />} />
          <Route path="User-name" element={<UserName />} />
          <Route path="Login-with-wallet" element={<LoginWithWallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

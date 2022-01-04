import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Welcome from "../layout/Login/Welcome";
import SelectWallet from "../layout/Login/SelectWallet";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route index element={<Welcome />} />
          <Route path="Select-wallet" element={<SelectWallet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

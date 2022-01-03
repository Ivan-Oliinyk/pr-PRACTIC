import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Welcome from "../layout/Login/Welcome";
import SelectWaller from "../layout/Login/SelectWaller";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />}>
          <Route index element={<Welcome />} />
          <Route path="Select-wallet" element={<SelectWaller />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

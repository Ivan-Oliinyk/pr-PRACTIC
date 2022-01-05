import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutingLoginPage from "./RoutingLoginPage";
import Home from "../pages/Home";
import { NotFoundPage } from "../pages/NotfoundPage";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutingLoginPage />} />
        <Route path="/home" element={<Home />} />
        {/* <Route path="**" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

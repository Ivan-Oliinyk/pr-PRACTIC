import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutingLoginPage from "./RoutingLoginPage";
import RoutingHomePage from "./RoutingHomePage";

const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutingLoginPage />} />
        <Route path="/home/*" element={<RoutingHomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

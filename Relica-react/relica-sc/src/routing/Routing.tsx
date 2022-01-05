import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutingLoginPage from "./RoutingLoginPage";
import Home from "../pages/Home";
import Posts from "../layout/home/Posts";
import { EditProfile } from "../layout/home/EditProfile";

const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutingLoginPage />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Posts />} />
          <Route path="EditProfile" element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

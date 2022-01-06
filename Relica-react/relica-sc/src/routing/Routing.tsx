import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutingLoginPage from "./RoutingLoginPage";
import Home from "../pages/Home";
// import { NotFoundPage } from "../pages/NotfoundPage";
import Posts from "../layout/home/Posts";
import { Chat } from "../layout/home/Chat";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutingLoginPage />} />
        <Route path="/home" element={<Home />}>
          <Route index element={<Posts />}></Route>
          <Route path="Chat" element={<Chat />}></Route>
        </Route>
        {/* <Route path="**" element={<NotFoundPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

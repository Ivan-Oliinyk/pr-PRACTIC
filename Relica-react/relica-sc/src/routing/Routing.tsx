import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoutingLoginPage from "./RoutingLoginPage";
import Home from "../pages/Home";
import Posts from "../layout/home/Posts";
import { Chat } from "../layout/home/Chat";
import { EditProfile } from "../layout/home/EditProfile";
import { Gallery } from "../layout/home/Gallary";

const Routing: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<RoutingLoginPage />} />
        <Route path="/home" element={<Home />}>
          {/* <Route index element={<Posts />}></Route> */}
          <Route index element={<Posts />} />
          <Route path="Chat" element={<Chat />}></Route>
          <Route path="EditProfile" element={<EditProfile />} />
          <Route path="Gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

import React from "react";
import { Route, Routes } from "react-router-dom";
import Posts from "../layout/home/Posts";
import { Chat } from "../layout/home/Chat";
import { EditProfile } from "../layout/home/EditProfile";
import { Gallery } from "../layout/home/Gallary";
import { Notification } from "../layout/home/Notification";
import { ActiveLog } from "../layout/home/notification/ActiveLog";
import { Income } from "../layout/home/notification/Income";
import Home from "../pages/Home";

const RoutingHomePage = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Posts />} />
        <Route path="Chat" element={<Chat />}></Route>
        <Route path="EditProfile" element={<EditProfile />} />
        <Route path="Gallery" element={<Gallery />} />
        <Route path="Notification" element={<Notification />}>
          <Route index element={<ActiveLog />} />
          <Route path="Income" element={<Income />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RoutingHomePage;

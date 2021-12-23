import React from "react";
import { Routes, Route } from "react-router-dom";

import { Login } from "./components/layout/Login";
import { HeroContext } from "./components/common/login/HeroContext";
import { SelectWallet } from "./components/common/login/SelectWallet";
import { LoginWithWallet } from "./components/common/login/LoginWithWallet";
import { UserName } from "./components/common/login/UserName";
import { NotFoundPage } from "./pages/NotfoundPage";

import { Home } from "./components/layout/Home";
import { Post } from "./components/common/home/Posts";
import { Chat } from "./components/common/home/Chat";
import { Gallery } from "./components/common/home/Gallery";
import { Notification } from "./components/common/home/Notification";
import { ActiveLog } from "./components/common/home/notification/ActiveLog";
import { Income } from "./components/common/home/notification/Income";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route index element={<HeroContext />} />
          <Route path="/SelectWallet" element={<SelectWallet />} />
          <Route path="/UserName" element={<UserName />} />
          <Route path="/LoginWithWallet" element={<LoginWithWallet />} />
        </Route>

        <Route path="/HomePage" element={<Home />}>
          <Route index element={<Post />} />
          <Route path="Chat" element={<Chat />} />
          <Route path="Gallery" element={<Gallery />} />
          <Route path="Notification" element={<Notification />}>
            <Route index element={<ActiveLog />} />
            <Route path="Income" element={<Income />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

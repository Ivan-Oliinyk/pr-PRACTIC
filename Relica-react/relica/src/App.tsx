import React from "react";
import { Routes, Route } from "react-router-dom";

import { Login } from "./components/layout/Login";
// import { HomePage } from "./pages/Home-page";
import { Home } from "./components/layout/Home";

import { HeroContext } from "./components/common/login/HeroContext";
import { SelectWallet } from "./components/common/login/SelectWallet";
import { LoginWithWallet } from "./components/common/login/LoginWithWallet";
import { UserName } from "./components/common/login/UserName";
import { NotFoundPage } from "./pages/NotfoundPage";

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
        <Route path="/HomePage" element={<Home />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;

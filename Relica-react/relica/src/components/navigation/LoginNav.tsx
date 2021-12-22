import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { HeroContext } from "../common/HeroContext";
import { SelectWallet } from "../common/SelectWallet";
import { LoginWithWallet } from "../common/LoginWithWallet";
import { UserName } from "../common/UserName";

export const LoginNav: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroContext />}></Route>
      <Route path="/SelectWallet" element={<SelectWallet />}></Route>
      <Route path="/UserName" element={<UserName />}></Route>
      <Route path="/LoginWithWallet" element={<LoginWithWallet />}></Route>
    </Routes>
  );
};

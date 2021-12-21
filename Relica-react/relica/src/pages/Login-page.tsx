import React from "react";
import { MainBg } from "../components/main-bg/main-bg";
import { HeroContext } from "../components/heroContext/HeroContext";
import { SelectWallet } from "../components/selectWallet/SelectWallet";
import { LoginWithWallet } from "../components/LoginWithWallet/LoginWithWallet";

export const LoginPage: React.FC = () => {
  return (
    <section className="hero">
      <MainBg />
      {/* <HeroContext /> */}
      <SelectWallet />
      {/* <LoginWithWallet /> */}
    </section>
  );
};

import React from "react";
import { MainBg } from "../components/main-bg/main-bg";
import { HeroContext } from "../components/layout/HeroContext";
import { SelectWallet } from "../components/layout/SelectWallet";
import { LoginWithWallet } from "../components/layout/LoginWithWallet";
import { UserName } from "../components/layout/UserName";

export const LoginPage: React.FC = () => {
  return (
    <section className="hero">
      <MainBg />
      <HeroContext />
      {/* <SelectWallet /> */}
      {/* <UserName /> */}
      {/* <LoginWithWallet /> */}
    </section>
  );
};

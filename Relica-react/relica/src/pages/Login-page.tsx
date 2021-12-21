import React from "react";
import { MainBg } from "../components/main-bg/main-bg";
import { HeroContext } from "../components/heroContext/HeroContext";

export const LoginPage: React.FC = () => {
  return (
    <section className="hero">
      <MainBg />
      <HeroContext />
    </section>
  );
};

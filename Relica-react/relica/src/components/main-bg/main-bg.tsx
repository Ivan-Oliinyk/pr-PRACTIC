import React from "react";
// import BgImage from "../../assets/images/logo.png";
import { Logo } from "../logo/Logo";
import { Title } from "./Title";

export const MainBg: React.FC = () => {
  return (
    <div className="hero__img">
      <div className="content-wrapper">
        <Logo linkTo="/" />
        <Title value="Post photos. Make money. Maintain ownership" />
      </div>
    </div>
  );
};

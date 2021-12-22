import React from "react";
import { Logo } from "../logo/Logo";
import { InputSearch } from "./Input-search";
import { BtnGradient } from "../btns/Btn-gradient";
import { SocialListLinks } from "./SocialListLinks";
import { Avatar } from "../common/home/Avatar";

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container container">
        <Logo />
        <InputSearch />
        <BtnGradient value="Make a post" />
        <SocialListLinks />
        <Avatar />
      </div>
    </header>
  );
};

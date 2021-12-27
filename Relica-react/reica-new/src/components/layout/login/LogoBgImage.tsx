import React from "react";
// import BgImage from "../../assets/images/logo.png";
import { Logo } from "../../logo/Logo";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";

export const LogoBgImage: React.FC = () => {
  return (
    <div className="loginPage__img">
      <div className="content-wrapper">
        <Logo
          linkTo="/"
          image="/images/logo.png"
          classname="h1 big bolt"
          text="Relica"
          tagname={TagVariants.p}
        />
        <Typography
          tagname={TagVariants.h1}
          classname="h1 medium"
          children="Post photos. Make money. Maintain ownership"
          color="white"
        />
      </div>
    </div>
  );
};

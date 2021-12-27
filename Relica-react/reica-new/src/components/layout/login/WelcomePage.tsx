import React from "react";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";
import { TypographyProps } from "../../typography/Typography";
// import { Card } from "../../card/Card";

export const WelcomePage: React.FC = () => {
  return (
    <>
      <Typography
        classname="h2 big"
        tagname={TagVariants.h2}
        children="Welcome"
      />
    </>
  );
};

import React from "react";
import { Typography } from "../typography/Typography";
// import { TagVariants } from "../typography/Typography";
import { TypographyProps } from "../typography/Typography";

export const CardHeader: React.FC<TypographyProps> = (
  classname,
  tagname,
  color = "black",
  ...rest
) => {
  return (
    <>
      <Typography
        tagname={tagname}
        classname={classname + " " + color}
        children={rest}
      />
    </>
  );
};

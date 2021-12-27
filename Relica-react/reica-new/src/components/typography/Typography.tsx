import React from "react";

export enum TagVariants {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
  h6 = "h6",
  p = "p",
  div = "div",
  span = "span",
}

export interface TypographyProps {
  classname: string;
  tagname: TagVariants;
  color?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  classname,
  tagname,
  color = "black",
  ...rest
}) => {
  return React.createElement(tagname, {
    className: `${classname} ${color}`,
    ...rest,
  });
};

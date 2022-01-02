import React from "react";
import styled, { css } from "styled-components";

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
  button = "button",
}

type TypographyProps = {
  tagName: TagVariants;
  size: string;
  height?: string;
  weight: string;
  width?: string | number;
  color?: string;
  align?: string;
  padding?: string;
};

const Typography: React.FC<TypographyProps> = ({
  tagName,
  size,
  height,
  weight,
  width = "100%",
  children,
  color = "#fff",
  align = "start",
  padding,
}) => {
  return React.createElement(
    styled(`${tagName}`)`
      font-size: ${size};
      line-height: ${height};
      font-weight: ${weight};
      width: ${width};
      color: ${color};
      text-align: ${align};
      padding: ${padding};
    `,
    { children }
  );
};

export default Typography;

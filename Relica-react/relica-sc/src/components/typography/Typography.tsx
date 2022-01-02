import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

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

export type TypographyProps = {
  tagName: TagVariants;
  size?: string;
  height?: string | number;
  weight?: string | number;
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
  width,
  color,
  align,
  padding,
  children,
}) => {
  return React.createElement(
    styled(`${tagName}`)`
      font-size: ${size || baseTheme.size.base};
      line-height: ${height || baseTheme.lineHeight.normal};
      font-weight: ${weight || baseTheme.weight.normal};
      width: ${width || baseTheme.width.full};
      color: ${color || baseTheme.colors.black};
      text-align: ${align};
      padding: ${padding};

      @media (max-width: 992px) {
        color: ${(props) =>
          props.color === baseTheme.colors.white
            ? baseTheme.colors.black
            : "red"};
      }
    `,
    { children }
  );
};

export default Typography;

import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";

const Container = styled.button<IFlexProps>`
  ${flexStyles}
  cursor: pointer;

  &:hover,
  &:focus {
    background: linear-gradient(
      45deg,
      ${baseTheme.colors.blueV2},
      ${baseTheme.colors.blueV1}
    );
    color: ${baseTheme.colors.white};
    border-color: ${baseTheme.colors.blueV2};
  }
`;

const Button: React.FC<IFlexProps> = ({ children, ...props }) => {
  return (
    <>
      <Container {...props}>{children}</Container>
    </>
  );
};

export default Button;

import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";
import { useNavigate } from "react-router-dom";

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

interface IButtonProps extends IFlexProps {
  linkTo?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const Button: React.FC<IButtonProps> = ({
  children,
  linkTo = "",
  type = "button",
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Container
        type={type || "button"}
        onClick={() => navigate(linkTo)}
        {...props}
      >
        {children}
      </Container>
    </>
  );
};

export default Button;

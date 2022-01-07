import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import { IFlexProps } from "../common/FlexWrapper";
import { flexStyles } from "../common/FlexWrapper";
import { useNavigate } from "react-router-dom";

const Container = styled.button<IFlexProps>`
  ${flexStyles}
  cursor: pointer;
  box-shadow: 0 0 3px ${baseTheme.colors.greyPrimary};

  &:hover,
  &:focus {
    background: ${baseTheme.gradients.bluetobluev3}
    color: ${baseTheme.colors.white};
    border-color: ${baseTheme.colors.blueV2};
  }
`;

interface IButtonProps extends IFlexProps {
  linkTo?: string;
  type?: "button" | "submit" | "reset" | undefined;
  cb?: () => void;
}

const Button: React.FC<IButtonProps> = ({
  children,
  linkTo = "",
  cb,
  type = "button",
  ...props
}) => {
  const navigate = useNavigate();

  return (
    <>
      {cb ? (
        <Container type={type || "button"} onClick={cb} {...props}>
          {children}
        </Container>
      ) : (
        <Container
          type={type || "button"}
          onClick={() => navigate(linkTo)}
          {...props}
        >
          {children}
        </Container>
      )}
    </>
  );
};

export default Button;

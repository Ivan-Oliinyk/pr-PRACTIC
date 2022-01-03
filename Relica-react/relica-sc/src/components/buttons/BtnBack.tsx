import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import { useNavigate } from "react-router-dom";

interface IContainerStyled {
  opacity?: string;
  cursor?: string;
  linkTo?: string;
}

const Container = styled.button<IContainerStyled>`
  padding: 10px 0;
  display: flex;
  align-items: center;
  opacity: ${(props) => props.opacity || "1"};
  color: ${baseTheme.colors.blueV1};
  font-size: ${baseTheme.size.base};
  font-weight: ${baseTheme.weight.bolt};
  cursor: ${(props) => props.cursor || "pointer"};
  transition: color 300ms linear;
  svg {
    fill: ${baseTheme.colors.blueV1};
    margin-right: 0.5rem;
    transition: fill 300ms linear;
  }

  &:hover,
  &:focus {
    color: ${baseTheme.colors.blueV2};
    svg {
      fill: ${baseTheme.colors.blueV2};
    }
  }
`;

const BtnBack: React.FC<IContainerStyled> = ({
  children = "Back",
  linkTo = "",
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Container onClick={() => navigate(linkTo)}>
        <svg width="16" height="16">
          <use href="/images/symbol-defs.svg#icon-arrow"></use>
        </svg>
        {children}
      </Container>
    </>
  );
};

export default BtnBack;

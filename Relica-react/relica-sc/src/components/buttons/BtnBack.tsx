import React from "react";
import styled, { css } from "styled-components";
import { baseTheme } from "../../styles/theme";
import { useNavigate } from "react-router-dom";

interface IContainerStyled {
  linkTo?: string;
  hidden?: boolean;
}

const Container = styled.button<IContainerStyled>`
  padding: 10px 0;
  display: flex;
  align-items: center;
  color: ${baseTheme.colors.blueV1};
  font-size: ${baseTheme.size.base};
  font-weight: ${baseTheme.weight.bolt};
  cursor: pointer;
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

  ${({ hidden }) =>
    hidden &&
    css`
      cursor: auto;
      opacity: 0;

      @media (max-width: ${baseTheme.media.laptop}) {
        display: none;
        padding: 0;
        margin: 0;
      } ;
    `}
`;

const BtnBack: React.FC<IContainerStyled> = ({
  children = "Back",
  linkTo = "",
  hidden,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <Container onClick={() => navigate(linkTo)} hidden={hidden}>
        <svg width="16" height="16">
          <use href="/images/symbol-defs.svg#icon-arrow"></use>
        </svg>
        {children}
      </Container>
    </>
  );
};

export default BtnBack;

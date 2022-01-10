import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";

export const NavWrapper = styled.nav`
  max-width: 970px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 1.5rem;
`;

export const List = styled.ul`
  margin-top: 2rem;
  display: flex;

  li {
    width: calc(100% / 3);
  }

  button {
    padding: 0.5em;
    /* width: calc(100% / 3); */
    width: 100%;
    color: ${baseTheme.colors.greyPrimary};
    border-bottom: 3px solid ${baseTheme.colors.greyPrimary};
    cursor: pointer;
    transition: all 250ms linear;
    text-align: center;

    p {
      color: ${baseTheme.colors.greyPrimary};
      transition: all 250ms linear;
    }

    &:hover,
    &:focus {
      border-bottom: 3px solid ${baseTheme.colors.blueV1};
      p {
        color: ${baseTheme.colors.blueV1};
      }
    }
  }
`;

import styled from "styled-components";
import { baseTheme } from "../../../styles/theme";

export const Navigate = styled.nav`
  font-size: 1.6rem;
  color: ${baseTheme.colors.greyPrimary};
`;

export const NavList = styled.ul`
  display: flex;
  width: 100%;

  a {
    width: 50%;
    &.active {
      li {
        color: ${baseTheme.colors.blueV1};
        &:after {
          background-color: ${baseTheme.colors.blueV1};
          height: 3px;
        }
      }
    }

    li {
      &:after {
        content: "";
        display: block;
        width: 100%;
        height: 2px;
        background-color: ${baseTheme.colors.greyPrimary};
        position: absolute;
        bottom: 0;
        left: 0;
        transition: all 250ms linear;
      }

      &:hover,
      &:focus,
      &.active {
        &:after {
          background-color: ${baseTheme.colors.blueV1};
          height: 3px;
        }

        color: ${baseTheme.colors.blueV1};
      }
    }
  }
`;

export const NavItem = styled.li`
  position: relative;
  /* width: 50%; */
  text-align: center;
  padding: 0.5em;
  cursor: pointer;
  transition: all 250ms linear;
  font-weight: 700;

  /* &:after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    background-color: ${baseTheme.colors.greyPrimary};
    position: absolute;
    bottom: 0;
    left: 0;
    transition: all 250ms linear;
  }

  &:hover,
  &:focus,
  &.active {
    &:after {
      background-color: ${baseTheme.colors.blueV1};
      height: 3px;
    }

    color: ${baseTheme.colors.blueV1};
  } */
`;

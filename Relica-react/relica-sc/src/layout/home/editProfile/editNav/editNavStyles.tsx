import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const List = styled.ul`
  width: 30rem;
`;

export const Item = styled.li`
  min-height: 8rem;
  padding: 1.5em 0.75em;
  border-left: 3px solid transparent;

  font-size: 2rem;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${baseTheme.colors.blueLight};
    border-left: 3px solid ${baseTheme.colors.blueV1};
  }
`;

export const ItemTwitter = styled.li`
  display: flex;
  align-items: center;

  u {
    min-height: 8rem;
    padding: 1.5em 0.75em;
    border-left: 3px solid transparent;
    color: ${baseTheme.colors.blueV1};
    cursor: pointer;

    &:hover,
    &:focus {
      color: ${baseTheme.colors.blueV2};
      background-color: transparent;
      border-color: transparent;
    }
  }
`;

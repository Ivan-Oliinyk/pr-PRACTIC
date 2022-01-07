import styled from "styled-components";
import { baseTheme } from "../../../../styles/theme";

export const ChatUsersWrapper = styled.div`
  width: 37rem;
  min-height: calc(100vh - 9.6rem);
  border-right: 1px solid ${baseTheme.colors.greySecondary};
`;

export const SearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 10rem;
  width: 100%;
  border-bottom: 1px solid ${baseTheme.colors.greySecondary};

  div {
    max-width: 90%;
  }
`;

export const List = styled.ul`
  padding: 1rem 0;
  overflow: auto;
  height: calc(100vh - 19.6rem);
`;

import React from "react";
import styled from "styled-components";
import { InputSearch } from "../../../components/form/InputSearch";
import { baseTheme } from "../../../styles/theme";
import { ChatList } from "./ChatList";
import PropsType from "./PropsType";

const ChatUsersWrapper = styled.div`
  width: 37rem;
  min-height: calc(100vh - 9.6rem);
  border-right: 1px solid ${baseTheme.colors.greySecondary};
`;

const SearchWrapper = styled.div`
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

const List = styled.ul`
  padding: 1rem 0;
  overflow: auto;
  height: calc(100vh - 19.6rem);
`;

interface Lists {
  data: PropsType[];
}

export const ChatUsers: React.FC<Lists> = ({ data }) => {
  return (
    <ChatUsersWrapper>
      <SearchWrapper>
        <InputSearch />
      </SearchWrapper>

      <List>
        {data.map(({ ...props }, i) => (
          <ChatList key={i} {...props} />
        ))}
      </List>
    </ChatUsersWrapper>
  );
};

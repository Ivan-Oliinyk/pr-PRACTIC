import React from "react";
import { InputSearch } from "../../../../components/form/InputSearch";
import { ChatList } from "../chatList/ChatList";
import PropsType from "../PropsType";
import { ChatUsersWrapper, List, SearchWrapper } from "./ChatUsersStyled";

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

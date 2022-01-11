import React from "react";
import { ChatUsers } from "./chat/chatUsers/ChatUsers";
import { ChatContent } from "./chat/chatContent/ChatContent";
import chatUsers from "./chat/chatUsers.json";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";

const ChatContainer = styled.section`
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  max-width: 136.6rem;
  display: flex;
  border-left: 1px solid ${baseTheme.colors.greySecondary};
  border-right: 1px solid ${baseTheme.colors.greySecondary};
  border-bottom: 1px solid ${baseTheme.colors.greySecondary};
  min-height: calc(100vh - 9.6rem);
  width: 100%;
`;

export const Chat: React.FC = () => {
  return (
    <ChatContainer>
      <ChatUsers data={chatUsers} />
      <ChatContent />
    </ChatContainer>
  );
};

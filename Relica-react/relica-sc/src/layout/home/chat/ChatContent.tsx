import React from "react";
import { ChatActiveHeader } from "./ChatActiveHeader";
import { ChatDateMessage } from "./ChatDateMessage";
import { ChatMyMessage } from "./ChatMyMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatFooterInput } from "./ChatFooterInput";
import styled from "styled-components";

const ChatContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ChatWindow = styled.div`
  flex: 1 1 auto;
  padding-top: 4rem;
`;

export const ChatContent: React.FC = () => {
  return (
    <ChatContentWrapper>
      <ChatActiveHeader image="/images/chat/user3.png" />

      <ChatWindow>
        <ChatDateMessage children="Thursday, 12 Mar 2020" />
        <ChatMyMessage message="It was nice meeting you!" />
        <ChatMessage
          message="Nice to meet you too!"
          imgsrc="/images/chat/user3.png"
        />
        <ChatMyMessage message="How are you ?" />
        <ChatMessage message="Im fine " imgsrc="/images/chat/user3.png" />
      </ChatWindow>

      <ChatFooterInput />
    </ChatContentWrapper>
  );
};

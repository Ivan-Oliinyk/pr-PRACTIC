import React from "react";
import { ChatActiveHeader } from "../chatActiveHeader/ChatActiveHeader";
import { ChatDateMessage } from "../ChatDateMessage";
import { ChatMyMessage } from "../ChatMyMessage";
import { ChatMessage } from "../ChatMessage";
import { ChatFooterInput } from "../chatFooterInput/ChatFooterInput";
import { ChatContentWrapper, ChatWindow } from "./ChatContentStyled";

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

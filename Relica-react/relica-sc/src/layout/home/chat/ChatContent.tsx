import React from "react";
import { ChatActiveHeader } from "./ChatActiveHeader";
import { ChatDateMessage } from "./ChatDateMessage";
import { ChatMyMessage } from "./ChatMyMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatFooterInput } from "./ChatFooterInput";

export const ChatContent: React.FC = () => {
  return (
    <div className="chat__content">
      <ChatActiveHeader />

      <div className="chat-window">
        <ChatDateMessage text="Thursday, 12 Mar 2020" />
        <ChatMyMessage message="It was nice meeting you!" />
        <ChatMessage
          message="Nice to meet you too!"
          imgsrc="/images/chat/user3.png"
        />
        <ChatMyMessage message="How are you ?" />
        <ChatMessage message="Im fine " imgsrc="/images/chat/user3.png" />
      </div>

      <ChatFooterInput />
    </div>
  );
};

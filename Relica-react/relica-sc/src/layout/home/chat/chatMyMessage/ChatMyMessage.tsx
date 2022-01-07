import React from "react";
import { MessageWrapper, MyMessage } from "./ChatMyMessageStyled";

type Message = {
  message: string;
};

export const ChatMyMessage: React.FC<Message> = ({ message }) => {
  return (
    <MessageWrapper>
      <MyMessage>{message}</MyMessage>
    </MessageWrapper>
  );
};

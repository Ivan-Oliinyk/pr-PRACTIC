import React from "react";
import { GuestMessage, GuestMessageWrapper } from "./ChatMessageStyled";

type Props = {
  message: string;
  imgsrc: string;
};

export const ChatMessage: React.FC<Props> = ({ message, imgsrc }) => {
  return (
    <GuestMessageWrapper>
      <img src={imgsrc} alt="user" width="39" height="39" />
      <GuestMessage>{message}</GuestMessage>
    </GuestMessageWrapper>
  );
};

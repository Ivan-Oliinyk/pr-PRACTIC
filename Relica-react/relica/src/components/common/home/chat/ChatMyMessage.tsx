import React from "react";

type Message = {
  message: string;
};

export const ChatMyMessage: React.FC<Message> = ({ message }) => {
  return (
    <div className="my-message__wrapper">
      <div className="my-message">{message}</div>
    </div>
  );
};

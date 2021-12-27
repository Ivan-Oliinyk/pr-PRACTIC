import React from "react";

type Props = {
  message: string;
  imgsrc: string;
};

export const ChatMessage: React.FC<Props> = ({ message, imgsrc }) => {
  return (
    <div className="guest-message__wrapper">
      <img src={imgsrc} alt="user" width="39" height="39" />
      <div className="guest-message">{message}</div>
    </div>
  );
};

import React from "react";
import PropsType from "./PropsType";

export const ChatList: React.FC<PropsType> = ({
  src,
  alt,
  userName,
  message,
  isMessage,
  messageCount,
}) => {
  return (
    <>
      <li className="user-cart">
        <img
          className="user__avatar"
          src={src}
          alt={alt}
          width="56"
          height="56"
        />

        <div className="user__info">
          <h3 className="title">{userName}</h3>
          <p className="text">{message}</p>
        </div>

        {isMessage && <div className="message-count">{messageCount}</div>}
      </li>
    </>
  );
};

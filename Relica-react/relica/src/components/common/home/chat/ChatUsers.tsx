import React from "react";
import { InputSearch } from "../../../header/Input-search";
import { ChatList } from "./ChatList";
import PropsType from "./PropsType";

interface Lists {
  data: PropsType[];
}

export const ChatUsers: React.FC<Lists> = ({ data }) => {
  return (
    <div className="chat__users">
      <div className="search-wrapper">
        <InputSearch />
      </div>

      <ul className="chat__user-carts">
        {data.map(
          ({ src, alt, userName, message, isMessage, messageCount }, i) => (
            <ChatList
              key={i}
              src={src}
              alt={alt}
              userName={userName}
              message={message}
              isMessage={isMessage}
              messageCount={messageCount}
            />
          )
        )}
      </ul>
    </div>
  );
};

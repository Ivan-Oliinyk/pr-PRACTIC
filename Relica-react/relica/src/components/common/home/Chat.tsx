import React from "react";
import { ChatUsers } from "./chat/ChatUsers";
import { ChatContent } from "./chat/ChatContent";
import chatUsers from "./chat/chatUsers.json";

export const Chat: React.FC = () => {
  return (
    <section className="container chat__wrapper">
      <ChatUsers data={chatUsers} />
      <ChatContent />
    </section>
  );
};

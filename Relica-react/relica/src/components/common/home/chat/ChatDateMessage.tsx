import React from "react";

type Value = {
  text: string;
};

export const ChatDateMessage: React.FC<Value> = ({ text }) => {
  return (
    <>
      <div className="message-date">{text}</div>
    </>
  );
};

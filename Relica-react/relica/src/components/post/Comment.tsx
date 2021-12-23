import React from "react";

type Props = {
  userName: string;
  userComment: string;
};

export const Comment: React.FC<Props> = ({ userName, userComment }) => {
  return (
    <li className="user-post__comments-info">
      <h3 className="user-info">{userName}</h3>
      <p className="user-text">{userComment}</p>
    </li>
  );
};

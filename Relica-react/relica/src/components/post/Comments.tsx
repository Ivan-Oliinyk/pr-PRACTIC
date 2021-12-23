import React from "react";
import { Comment } from "./Comment";

type Item = { userName: string; userComment: string };
interface CommentsProps {
  items: Item[];
}

export const Comments: React.FC<CommentsProps> = ({ items }) => {
  return (
    <ul>
      {items.map(({ userName, userComment }, i) => (
        <Comment key={i} userName={userName} userComment={userComment} />
      ))}
    </ul>
  );
};

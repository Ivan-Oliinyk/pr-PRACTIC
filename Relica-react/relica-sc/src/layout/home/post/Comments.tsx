import React from "react";
import styled from "styled-components";
import { Comment } from "./Comment";

const List = styled.ul``;

type Item = { userName: string; userComment: string };
interface CommentsProps {
  items: Item[];
}

export const Comments: React.FC<CommentsProps> = ({ items }) => {
  return (
    <List>
      {items.map(({ userName, userComment }, i) => (
        <Comment key={i} userName={userName} userComment={userComment} />
      ))}
    </List>
  );
};

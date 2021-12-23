import React from "react";
import comments from "./comments.json";
import { Comments } from "./Comments";

type Props = {
  title: string;
};

export const UserPost: React.FC<Props> = ({ title }) => {
  return (
    <div className="user-post__comments">
      <p className="info">{title}</p>

      <Comments items={comments} />
    </div>
  );
};

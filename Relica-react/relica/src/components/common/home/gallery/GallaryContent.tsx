import React from "react";
import { GallaryItem } from "./GallaryItem";
import { Props } from "./GallaryItem";

interface List {
  data: Props[];
}

export const GallaryContent: React.FC<List> = ({ data }) => {
  return (
    <div className="chat-3__gallary-wrapper">
      <ul className="chat-3__gallary">
        {data.map(({ image, likes, comments }, i) => (
          <GallaryItem
            key={i}
            image={image}
            likes={likes}
            comments={comments}
          />
        ))}
      </ul>
    </div>
  );
};

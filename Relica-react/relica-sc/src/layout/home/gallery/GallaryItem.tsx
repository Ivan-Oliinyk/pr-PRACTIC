import React from "react";
import { IconWrapper, Item } from "./GallaryItemStyles";

export type Props = {
  image: string;
  likes: number | string;
  comments: number | string;
};

export const GallaryItem: React.FC<Props> = ({ image, likes, comments }) => {
  return (
    <Item>
      <img src={image} alt="image1" />
      <IconWrapper>
        <div>
          <svg width="40" height="40">
            <use href="/images/symbol-defs.svg#icon-heart"></use>
          </svg>
          {likes}
        </div>
        <div>
          <svg width="40" height="40">
            <use href="/images/symbol-defs.svg#icon-comment"></use>
          </svg>
          {comments}
        </div>
      </IconWrapper>
    </Item>
  );
};

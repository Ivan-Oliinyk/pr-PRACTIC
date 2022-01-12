import React from "react";
import { useNavigate } from "react-router-dom";
import { IconWrapper, Item } from "./GallaryItemStyles";

export type Props = {
  image: string;
  likes: number | string;
  comments: number | string;
  data?: number;
  idx?: number | string;
};

export const GallaryItem: React.FC<Props> = ({
  image,
  likes,
  comments,
  idx,
}) => {
  const navigate = useNavigate();

  return (
    <Item onClick={() => navigate(`/home/gallary-${idx}`)}>
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

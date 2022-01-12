import React from "react";
import { useNavigate } from "react-router-dom";
import { IconWrapper, Item } from "./GallaryItemStyles";

export type Props = {
  image: string;
  likes: number | string;
  comments: number | string;
  data?: number;
  id?: number | string;
  alt?: string;
};

export const GallaryItem: React.FC<Props> = ({
  image,
  likes,
  comments,
  id,
  alt,
}) => {
  const navigate = useNavigate();

  return (
    <Item onClick={() => navigate(`/home/gallary-${id}`)}>
      <img src={image} alt={alt} />
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

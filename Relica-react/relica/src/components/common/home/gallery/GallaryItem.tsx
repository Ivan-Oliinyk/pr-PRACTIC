import React from "react";

export type Props = {
  image: string;
  likes: number | string;
  comments: number | string;
};

export const GallaryItem: React.FC<Props> = ({ image, likes, comments }) => {
  return (
    <li className="img-wrapper">
      <img src={image} alt="image1" />
      <div className="icon-wrapper">
        <div className="icon-context">
          <svg className="icon" width="40" height="40">
            <use href="/images/symbol-defs.svg#icon-heart"></use>
          </svg>
          {likes}
        </div>
        <div className="icon-context">
          <svg className="icon" width="40" height="40">
            <use href="/images/symbol-defs.svg#icon-comment"></use>
          </svg>
          {comments}
        </div>
      </div>
    </li>
  );
};

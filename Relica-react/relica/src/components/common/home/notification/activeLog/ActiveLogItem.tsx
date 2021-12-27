import React from "react";

export type Props = {
  image: string;
  alt: string;
  user: string;
  reaction: string;
  timeAgo: string;
  targetImg: string;
};

export const ActiveLogItem: React.FC<Props> = ({
  image,
  alt,
  user,
  reaction,
  timeAgo,
  targetImg,
}) => {
  return (
    <div className="active-log">
      <div className="info-wrapper">
        <div className="like">
          <img src={image} alt={alt} width="26" height="26" />
        </div>
        <div className="info">
          <div className="info-wrapper">
            <h3 className="title">{user}</h3>
            <span className="desc">{reaction}</span>
          </div>
          <span className="time-ago">{timeAgo}</span>
        </div>
      </div>
      <div className="target-img">
        <img src={targetImg} width="56" height="56" alt="images" />
      </div>
    </div>
  );
};

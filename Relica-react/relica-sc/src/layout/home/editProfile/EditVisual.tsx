import React from "react";

type PropsInfo = {
  title: string;
  images: string;
  userInfo: string;
};

export const EditVisual: React.FC<PropsInfo> = ({
  title,
  images,
  userInfo,
}) => {
  return (
    <>
      <h1 className="title">{title}</h1>
      <div className="bg-image">
        <div className="img-wrapper">
          <img src={images} alt="user" width="114" height="114" />
        </div>
      </div>
      <h2 className="user-name">{userInfo}</h2>
    </>
  );
};

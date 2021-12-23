import React from "react";

export const ButtonPhoto: React.FC = () => {
  return (
    <div className="user-name__box">
      <div className="user-name__box-img">
        <img
          className="img1"
          src="/images/userName/userName.svg"
          width="69"
          height="69"
          alt="photo1"
        />
        <img
          className="img2"
          src="/images/userName/photo-camera.svg"
          width="30"
          height="24"
          alt="photo2"
        />
      </div>

      <div className="user-name__text">
        <h2 className="title">Profile photo</h2>
        <p className="text">Upload your profile photo here</p>
      </div>
    </div>
  );
};

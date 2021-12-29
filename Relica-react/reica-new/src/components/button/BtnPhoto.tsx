import React from "react";
import { TagVariants } from "../typography/Typography";
import { Typography } from "../typography/Typography";

interface Ibntphoto {
  bgimage: string;
  img: string;
  title: string;
  subtitle: string;
}

export const BtnPhoto: React.FC<Ibntphoto> = ({
  bgimage,
  img,
  title,
  subtitle,
}) => {
  return (
    <div className="btnPhoto__box">
      <div className="btnPhoto__box-img">
        <img
          className="img1"
          src={bgimage}
          width="69"
          height="69"
          alt="photo1"
        />
        <img className="img2" src={img} width="30" height="24" alt="photo2" />
      </div>

      <div className="btnPhoto__text">
        <Typography
          classname="title"
          tagname={TagVariants.h2}
          children={title}
        />
        <Typography
          classname="text"
          tagname={TagVariants.p}
          children={subtitle}
        />
      </div>
    </div>
  );
};

import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "../typography/Typography";
import { TagVariants } from "../typography/Typography";

type Value = {
  linkTo: string;
  image: string;
  classname: string;
  text: string;
  tagname: TagVariants;
  color: string;
};

export const Logo: React.FC<Value> = ({
  linkTo,
  image,
  classname,
  text,
  tagname,
  color,
}) => {
  const navigate = useNavigate();

  return (
    <div className="logo-wrapper" onClick={() => navigate(linkTo)}>
      <img className="logo" src={image} alt="Logo" />
      <Typography
        tagname={tagname}
        classname={classname}
        color={color}
        children={text}
      />
    </div>
  );
};

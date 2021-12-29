import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography } from "../typography/Typography";
import { TagVariants } from "../typography/Typography";

interface Value {
  linkTo: string;
  image: string;
  classname: string;
  text: string;
  tagname: TagVariants;
  color?: string;
}

export const Logo: React.FC<Value> = ({
  linkTo,
  image,
  classname,
  text,
  tagname,
  color = "white",
}) => {
  const navigate = useNavigate();

  return (
    <div className="logo-wrapper" onClick={() => navigate(linkTo)}>
      <img
        className={"logo " + color}
        src={image}
        alt="Logo"
        width="78"
        height="78"
      />
      <Typography
        tagname={tagname}
        classname={classname}
        color={color}
        children={text}
      />
    </div>
  );
};

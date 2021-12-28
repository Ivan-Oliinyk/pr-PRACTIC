import React from "react";
import { TagVariants } from "../typography/Typography";

export interface BtnProps {
  classname: string;
  tagname: TagVariants;
  cb?: () => void;
}

export const Button: React.FC<BtnProps> = ({
  tagname,
  classname,
  cb,
  ...rest
}) => {
  return React.createElement(tagname, {
    className: classname,
    onClick: cb,
    ...rest,
  });
};

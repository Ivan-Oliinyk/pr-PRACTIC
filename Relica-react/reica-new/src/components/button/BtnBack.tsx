import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { TagVariants } from "../typography/Typography";

type Link = { linkTo: string };

export const BtnBack: React.FC<Link> = ({ linkTo }) => {
  const navigate = useNavigate();

  return (
    <Button
      tagname={TagVariants.button}
      classname="btn__back"
      cb={() => navigate(linkTo)}
    >
      <svg className="arrow-svg" width="16" height="16">
        <use href="/images/symbol-defs.svg#icon-arrow"></use>
      </svg>
      Back
    </Button>
  );
};

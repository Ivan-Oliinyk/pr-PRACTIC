import React from "react";
import { useNavigate } from "react-router-dom";

type Link = { linkTo: string };

export const LinkArrowBack: React.FC<Link> = ({ linkTo }) => {
  const navigate = useNavigate()

  return (
    <button className="arrow__back" type="button" onClick={() => navigate(linkTo)}>
      <svg className="arrow-svg" width="16" height="16">
        <use href="./images/symbol-defs.svg#icon-arrow"></use>
      </svg>
      Back
    </button>
  );
};

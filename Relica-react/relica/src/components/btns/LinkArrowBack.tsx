import React from "react";
import { NavLink } from "react-router-dom";

type Link = { linkTo: string };

export const LinkArrowBack: React.FC<Link> = ({ linkTo }) => {
  return (
    <NavLink className="arrow__back" to={linkTo}>
      <svg className="arrow-svg" width="16" height="16">
        <use href="./images/symbol-defs.svg#icon-arrow"></use>
      </svg>
      Back
    </NavLink>
  );
};

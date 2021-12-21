import React from "react";

export const LinkArrowBack: React.FC = () => {
  return (
    <a className="arrow__back" href="./userName.html">
      <svg className="arrow-svg" width="16" height="16">
        <use href="./images/symbol-defs.svg#icon-arrow"></use>
      </svg>
      Back
    </a>
  );
};

import React from "react";

export const SocialListLinks: React.FC = () => {
  return (
    <ul className="header__social-list">
      <li className="header__social-item">
        <svg className="icon">
          <use href="./images/symbol-defs.svg#icon-search"></use>
        </svg>
      </li>
      <li className="header__social-item">
        <svg className="icon">
          <use href="./images/symbol-defs.svg#icon-bell"></use>
        </svg>
      </li>
      <li className="header__social-item">
        <svg className="icon">
          <use href="./images/symbol-defs.svg#icon-bubble-speak"></use>
        </svg>
      </li>
    </ul>
  );
};

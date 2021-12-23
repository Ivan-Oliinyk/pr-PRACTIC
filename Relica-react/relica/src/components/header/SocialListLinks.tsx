import React from "react";
import { useNavigate } from "react-router-dom";

export const SocialListLinks: React.FC = () => {
  const navigate = useNavigate();
  const listData = [
    "/images/symbol-defs.svg#icon-search",
    "/images/symbol-defs.svg#icon-bell",
    "/images/symbol-defs.svg#icon-bubble-speak",
  ];
  const navigateList = ["Gallery", "", "Chat"];

  return (
    <ul className="header__social-list">
      {listData.map((el, i) => (
        <li
          key={i}
          className="header__social-item"
          onClick={() => navigate(navigateList[i])}
        >
          <svg className="icon">
            <use href={el}></use>
          </svg>
        </li>
      ))}
    </ul>
  );
};

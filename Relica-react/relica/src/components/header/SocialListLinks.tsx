import React from "react";
import { useNavigate } from "react-router-dom";

export const SocialListLinks: React.FC = () => {
  const navigate = useNavigate();

  const listData = [
    {
      src: "/images/symbol-defs.svg#icon-search",
      path: "Gallery",
    },
    {
      src: "/images/symbol-defs.svg#icon-bell",
      path: "",
    },
    {
      src: "/images/symbol-defs.svg#icon-bubble-speak",
      path: "Chat",
    },
  ];

  return (
    <ul className="header__social-list">
      {listData.map(({ src, path }, i) => (
        <li
          key={i}
          className="header__social-item"
          onClick={() => navigate(path)}
        >
          <svg className="icon">
            <use href={src}></use>
          </svg>
        </li>
      ))}
    </ul>
  );
};

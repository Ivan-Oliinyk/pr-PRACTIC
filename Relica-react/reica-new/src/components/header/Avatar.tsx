import React from "react";
import { useNavigate } from "react-router-dom";

export const Avatar: React.FC = () => {
  const navigate = useNavigate();
  const items = [
    { text: "Profile", path: "Gallery" },
    { text: "Setting", path: "EditProfile" },
    { text: "Log out", path: "/" },
  ];

  return (
    <div className="header__avatar">
      <img
        className="header__avatar-img"
        src="/images/header/sharon-garcia-KsSmVZJkHqo-unsplash.png"
        alt="avatar"
        width="43px"
        height="43px"
      />

      <ul className="user-menu user-menu__list">
        {items.map(({ text, path }, i) => (
          <li
            key={i}
            className="user-menu__item"
            onClick={() => navigate(path)}
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

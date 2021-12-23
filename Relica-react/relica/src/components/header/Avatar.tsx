import React from "react";

export const Avatar: React.FC = () => {
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
        <li className="user-menu__item">Profile</li>
        <li className="user-menu__item">Setting</li>
        <li className="user-menu__item">Log out</li>
      </ul>
    </div>
  );
};

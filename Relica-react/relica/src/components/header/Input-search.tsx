import React from "react";

export const InputSearch: React.FC = () => {
  return (
    <div className="input-search__wrapper">
      <img
        className="input-search__img"
        src="./images/header/zoom-mini.svg"
        alt="zoom"
      />
      <input
        className="input-search"
        type="search"
        name="search"
        aria-label="Search through site content"
        placeholder="Search form"
      />
    </div>
  );
};

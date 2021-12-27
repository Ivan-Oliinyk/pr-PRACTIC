import React from "react";

export const GallatyNavigatin: React.FC = () => {
  const listContent = ["Most recent", "Most liked", "Discovered"];

  return (
    <nav className="chat-4__nav">
      <ul className="nav__list">
        {listContent.map((el, i) => (
          <li key={i} className="nav__item">
            {el}
          </li>
        ))}
      </ul>
    </nav>
  );
};

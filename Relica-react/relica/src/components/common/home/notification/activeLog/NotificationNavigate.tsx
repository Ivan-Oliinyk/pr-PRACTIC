import React from "react";

export const NotificationNavigate: React.FC = () => {
  const items = ["Activity Log", "Income"];

  return (
    <nav className="notification__nav">
      <ul className="item">
        {items.map((el, i) => (
          <li key={i} className="list">
            {el}
          </li>
        ))}
      </ul>
    </nav>
  );
};

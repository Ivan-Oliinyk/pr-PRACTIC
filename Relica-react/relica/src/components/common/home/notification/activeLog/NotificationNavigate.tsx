import React from "react";
import { useNavigate } from "react-router-dom";

export const NotificationNavigate: React.FC = () => {
  const items = [
    { title: "Activity Log", path: "" },
    { title: "Income", path: "Income" },
  ];
  const navigate = useNavigate();

  return (
    <nav className="notification__nav">
      <ul className="item">
        {items.map(({ title, path }, i) => (
          <li key={i} className="list" onClick={() => navigate(path)}>
            {title}
          </li>
        ))}
      </ul>
    </nav>
  );
};

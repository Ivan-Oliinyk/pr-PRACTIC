import React from "react";
import { useNavigate } from "react-router-dom";
import { Navigate, NavItem, NavList } from "./NotificationNavigateStyles";

export const NotificationNavigate: React.FC = () => {
  const items = [
    { title: "Activity Log", path: "" },
    { title: "Income", path: "Income" },
  ];
  const navigate = useNavigate();

  return (
    <Navigate>
      <NavList>
        {items.map(({ title, path }, i) => (
          <NavItem key={i} onClick={() => navigate(path)}>
            {title}
          </NavItem>
        ))}
      </NavList>
    </Navigate>
  );
};

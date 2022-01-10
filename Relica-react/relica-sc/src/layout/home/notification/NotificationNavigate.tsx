import React from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate, NavItem, NavList } from "./NotificationNavigateStyles";

export const NotificationNavigate: React.FC = () => {
  const items = [
    { title: "Activity Log", path: "Active-log" },
    { title: "Income", path: "Income" },
  ];
  const navigate = useNavigate();

  return (
    <Navigate>
      <NavList>
        {items.map(({ title, path }, i) => (
          <NavLink key={i} to={path}>
            <NavItem>{title}</NavItem>
          </NavLink>
          // <NavItem key={i} onClick={() => navigate(path)}>
          //     {title}
          //   </NavItem>
        ))}
      </NavList>
    </Navigate>
  );
};

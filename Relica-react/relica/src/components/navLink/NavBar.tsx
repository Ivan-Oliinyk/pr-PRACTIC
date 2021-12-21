import React from "react";
import { NavLink } from "react-router-dom";

export const NavBar: React.FunctionComponent = () => {
  return (
    <nav>
      <div className="nav-wrapper purple darken-1 px1">
        <a href="/" className="brand-logo">
          React + TS
        </a>
        <ul className="right hide-on-med-and-down">
          <li>
            <NavLink to="/">Список дел</NavLink>
          </li>
          <li>
            <NavLink to="/about">Список дел</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

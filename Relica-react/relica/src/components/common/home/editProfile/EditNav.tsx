import React from "react";

export const EditNav: React.FC = () => {
  const dataNav = [
    { title: "Edit profile" },
    { title: "Push notifications" },
    { title: "Language" },
    { title: "Security" },
    { title: "Security" },
    { title: "Contact" },
    { title: "About us" },
    { title: "Visit our Twitter page", twitter: true },
  ];

  return (
    <div className="nav-wrapper">
      <nav className="nav">
        <ul className="nav-list">
          {dataNav.map(({ title, twitter }, i) => (
            <li
              key={i}
              className={twitter ? "nav-item twitter-link" : "nav-item"}
            >
              <button type="button"> {title} </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

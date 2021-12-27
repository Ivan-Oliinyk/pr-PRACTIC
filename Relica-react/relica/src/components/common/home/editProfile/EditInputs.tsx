import React from "react";

export const EditInputs: React.FC = () => {
  const dataInput = ["Display name", "Email", "Bio"];

  return (
    <ul className="input-wrapper">
      {dataInput.map((item, i) => (
        <li key={i} className="user-name__input-wrapper input-wrapper">
          <input
            className="input-text"
            type="text"
            name="name"
            placeholder={item}
          />
          <span className="user-name__input-descr">{item}</span>
        </li>
      ))}
    </ul>
  );
};

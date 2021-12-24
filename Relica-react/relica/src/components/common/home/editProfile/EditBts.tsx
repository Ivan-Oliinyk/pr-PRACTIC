import React from "react";
import { Button } from "../../../btns/Button";

export const EditBts: React.FC = () => {
  const dataBtn = [
    { value: "Discart change", linkTo: "" },
    { value: "Save change", linkTo: "" },
  ];

  return (
    <ul className="profile__btn-list">
      {dataBtn.map(({ value, linkTo }, i) => (
        <li key={i}>
          <Button value={value} prop="btn" linkTo={linkTo} />
        </li>
      ))}
    </ul>
  );
};

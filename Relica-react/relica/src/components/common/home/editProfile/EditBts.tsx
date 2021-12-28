import React from "react";
import { Button } from "../../../btns/Button";

export const EditBts: React.FC = () => {
  return (
    <ul className="profile__btn-list">
      <li>
        <Button value="Discart change" prop="btn" linkTo="" />
      </li>
      <li>
        <Button value="Save change" prop="btn" linkTo="" />
      </li>
    </ul>
  );
};

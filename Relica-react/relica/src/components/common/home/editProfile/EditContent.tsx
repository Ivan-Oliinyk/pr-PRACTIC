import React from "react";
import { EditVisual } from "./EditVisual";
import { EditInputs } from "./EditInputs";

export const EditContent: React.FC = () => {
  return (
    <div className="edit-profile__content">
      <EditVisual
        title="Edit profile"
        images="/images/header/sharon-garcia-KsSmVZJkHqo-unsplash@2x.png"
        userInfo="Mikaela White"
      />
      <EditInputs />
    </div>
  );
};

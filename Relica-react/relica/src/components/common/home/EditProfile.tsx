import React from "react";
import { EditNav } from "./editProfile/EditNav";
import { EditContent } from "./editProfile/EditContent";

export const EditProfile: React.FC = () => {
  return (
    <div className="edit-profile">
      <EditNav />
      <EditContent />
    </div>
  );
};

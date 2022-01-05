import React from "react";
import { EditNav } from "./editProfile/editNav/EditNav";
import { EditContent } from "./editProfile/EditContent";
import styled from "styled-components";

const EditProfileWrapper = styled.div`
  padding: 0 1.5rem;
  display: flex;
`;

export const EditProfile: React.FC = () => {
  return (
    <EditProfileWrapper>
      <EditNav />
      <EditContent />
    </EditProfileWrapper>
  );
};

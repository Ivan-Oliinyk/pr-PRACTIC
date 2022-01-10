import React from "react";
import { EditVisual } from "./EditVisual";
import { EditInputs } from "./EditInputs";
import { EditBts } from "../editProfile/EditBts";
import styled from "styled-components";

const ContentWrapper = styled.div`
  min-height: calc(100vh - 9.6rem);
  width: 100%;
  padding: 6rem 0 12.4rem 30rem;
`;

export const EditContent: React.FC = () => {
  return (
    <ContentWrapper>
      <EditVisual
        title="Edit profile"
        images="/images/header/sharon-garcia-KsSmVZJkHqo-unsplash@2x.png"
        userInfo="Mikaela White"
      />
      <EditInputs />
      <EditBts />
    </ContentWrapper>
  );
};

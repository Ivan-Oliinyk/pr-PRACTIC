import React from "react";
import styled from "styled-components";

const Content = styled.div`
  background: url("/images/not-found.png");
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  background-color: "red";
  width: 50vh;
  height: 50vh;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, 50%);
`;

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <Content />
    </>
  );
};

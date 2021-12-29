import React, { FC } from "react";
import styled from "styled-components";

const ContainerBg = styled.div`
  padding: 12.88% 1.46% 3.66% 7.32%;
  background-image: url("/images/bg2x.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 56%;
  height: 100vh;

  @media (max-width: 992px) {
    width: 100vw;
    height: 50vh;
  }
`;

export const LoginBg: FC = () => {
  return (
    <>
      <ContainerBg />
    </>
  );
};

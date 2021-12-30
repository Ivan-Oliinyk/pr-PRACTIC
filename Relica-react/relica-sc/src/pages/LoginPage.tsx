import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import LoginBg from "../layout/LoginBg";

const LoginPageContainer = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
`;

const LoginPage: React.FC = () => {
  return (
    <LoginPageContainer>
      <LoginBg />
      <Outlet />
    </LoginPageContainer>
  );
};

export default LoginPage;

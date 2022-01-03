import React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import LoginBg from "../layout/Login/LoginBg";
import { baseTheme } from "../styles/theme";

const LoginPageContainer = styled.section`
  width: 100vw;
  height: 100vh;
  display: flex;

  @media (max-width: ${baseTheme.media.laptop}) {
    flex-direction: column;
  }
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

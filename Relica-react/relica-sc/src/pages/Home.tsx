import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import styled from "styled-components";
import { baseTheme } from "../styles/theme";

const HomeContent = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding: 9.6rem 2rem 0;
  max-width: 136.6rem;
  background-color: ${baseTheme.colors.white};
`;

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <HomeContent>
        <Outlet />
      </HomeContent>
    </>
  );
};

export default Home;

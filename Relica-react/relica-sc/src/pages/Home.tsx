import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import styled from "styled-components";
import { baseTheme } from "../styles/theme";

const HomeContent = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding: 9.6rem 9.6rem 2rem;
  max-width: 136.6rem;
  background-color: ${baseTheme.colors.white};
`;

const Home = () => {
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

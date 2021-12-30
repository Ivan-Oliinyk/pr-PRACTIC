import React, { FC } from "react";
import styled from "styled-components";

const WelcomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 44%;
  padding: 9.5rem 1.5rem 3rem;
  color: ${({ theme }) => theme.colors.blueV4};
`;

const Welcome: FC = () => {
  return <WelcomeContainer>sddsdd</WelcomeContainer>;
};

export default Welcome;

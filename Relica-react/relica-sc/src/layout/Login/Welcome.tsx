import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import Card from "../../components/card/Card";
import CardHeader from "../../components/card/CardHeader";
import CardContent from "../../components/card/CardContent";
import Title from "./Title";
import Subtitle from "./Subtitle";
import BtnBack from "../../components/buttons/BtnBack";
import Button from "../../components/buttons/Button";
interface IWelcomeContainer {
  padding?: string;
  color?: string;
}

const WelcomeContainer = styled.div<IWelcomeContainer>`
  width: 44%;
  padding: ${({ padding }) => padding || "9.5rem 2rem 3rem"};
  color: ${({ color }) => color || baseTheme.colors.black};

  @media (max-width: ${baseTheme.media.laptop}) {
    width: 100%;
    height: 50vh;
  }
`;

const Welcome: React.FC = () => {
  return (
    <WelcomeContainer>
      <Card width="40rem" margin="0 auto" direction="column">
        <CardHeader>
          <BtnBack hidden></BtnBack>
        </CardHeader>
        <CardContent direction="column">
          <Title>Welcome</Title>
          <Subtitle>How can we help you today?</Subtitle>
          <Button
            border="1px solid #939393"
            borderRadius="3rem"
            minHeight="5.6rem"
            justify="center"
            align="center"
            weight={baseTheme.weight.bolt}
          >
            Login with wallet
          </Button>
          <Button
            border="1px solid #939393"
            borderRadius="3rem"
            minHeight="5.6rem"
            justify="center"
            align="center"
            weight={baseTheme.weight.bolt}
          >
            Create an account
          </Button>
        </CardContent>
      </Card>
    </WelcomeContainer>
  );
};

export default Welcome;

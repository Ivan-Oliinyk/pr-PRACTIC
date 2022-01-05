import React from "react";
import styled, { css } from "styled-components";
import { baseTheme } from "../../styles/theme";
import Card from "../../components/card/Card";
import CardHeader from "../../components/card/CardHeader";
import CardContent from "../../components/card/CardContent";
import Title from "./Title";
import Subtitle from "./Subtitle";
import BtnBack from "../../components/buttons/BtnBack";
import Button from "../../components/buttons/Button";
import Typography from "../../components/typography/Typography";
import { FontSize } from "../../components/typography/Typography";
export interface IWelcomeContainer {
  padding?: string;
  color?: string;
}

export const StyledContainer = css<IWelcomeContainer>`
  width: 44%;
  padding: ${({ padding }) => padding || "9.5rem 2rem 3rem"};
  color: ${({ color }) => color || baseTheme.colors.black};

  @media (max-width: ${baseTheme.media.laptop}) {
    padding: 2rem;
    width: 100%;
    height: 50vh;
  }
`;

export const LayoutContainer = styled.div<IWelcomeContainer>`
  ${StyledContainer}
`;

const Welcome: React.FC = () => {
  return (
    <LayoutContainer>
      <Card width="70%" maxWidth="40rem" margin="0 auto" direction="column">
        <CardHeader>
          <BtnBack hidden></BtnBack>
        </CardHeader>
        <CardContent direction="column">
          <Typography as="h2" fontSize={FontSize.tl} weight={700}>
            Welcome
          </Typography>

          <Subtitle>How can we help you today?</Subtitle>
          <Button
            border="1px solid #939393"
            borderRadius="3rem"
            minHeight="5.6rem"
            justify="center"
            align="center"
            weight={baseTheme.weight.bolt}
            linkTo="Login-with-wallet"
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
            linkTo="Select-wallet"
          >
            Create an account
          </Button>
        </CardContent>
      </Card>
    </LayoutContainer>
  );
};

export default Welcome;

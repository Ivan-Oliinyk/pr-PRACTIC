import React from "react";
import styled from "styled-components";
import { baseTheme } from "../../styles/theme";
import Card from "../../components/card/Card";
import CardHeader from "../../components/card/CardHeader";
import CardContent from "../../components/card/CardContent";
import Title from "./Title";
import BtnBack from "../../components/buttons/BtnBack";
import Button from "../../components/buttons/Button";
import Form from "../../components/form/Form";
import { InputRadio } from "../../components/form/InputRadio";
import { LayoutContainer } from "./Welcome";

const InputWrapper = styled.div`
  div:not(:first-of-type) {
    margin-top: 2rem;
  }
`;

const SelectWaller: React.FC = () => {
  return (
    <LayoutContainer>
      <Card width="70%" maxWidth="40rem" margin="0 auto" direction="column">
        <CardHeader>
          <BtnBack linkTo="/"></BtnBack>
        </CardHeader>
        <CardContent direction="column">
          <Title>Select waller</Title>
          <Form>
            <InputWrapper>
              <InputRadio
                checkboxname="check-wallet"
                checkboxId="radio-check1"
                sourse="./images/selectWallet/handCash.png"
                imgAlt="hand-cash"
                imgWidth="60"
                imgHeigth="60"
                text="Handcash"
                value="Handcash"
              />
              <InputRadio
                checkboxname="check-wallet"
                checkboxId="radio-check2"
                sourse="./images/selectWallet/moneyButton.png"
                imgAlt="Moneybutton"
                imgWidth="60"
                imgHeigth="60"
                text="Moneybutton"
                value="Moneybutton"
              />
            </InputWrapper>

            <Button
              border="1px solid #d6d6d6"
              borderRadius="3rem"
              minHeight="5.6rem"
              justify="center"
              align="center"
              weight={baseTheme.weight.bolt}
              // color={baseTheme.colors.white}
              bgColor={baseTheme.colors.greySecondary}
              linkTo="/User-name"
            >
              Continue
            </Button>
          </Form>
        </CardContent>
      </Card>
    </LayoutContainer>
  );
};

export default SelectWaller;

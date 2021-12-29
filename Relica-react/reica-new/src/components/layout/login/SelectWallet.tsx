import React from "react";
import { Card } from "../../card/Card";
import { CardHeader } from "../../card/CardHeader";
import { CardContent } from "../../card/CardContent";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";
import { Button } from "../../button/Button";
import { BtnBack } from "../../button/BtnBack";
import { Form } from "../../form/Form";
import { InputRadio } from "../../form/InputRadio";
import { useNavigate } from "react-router-dom";

export const SelectWallet: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card classname="card">
      <CardHeader classname="card-header">
        <BtnBack linkTo="/" text="Back" />
      </CardHeader>
      <CardContent classname="card-content">
        <Typography
          classname="h2 big"
          tagname={TagVariants.h2}
          children="Select wallet"
        />
        <Form>
          <InputRadio
            checkboxname="check-wallet"
            checkboxId="radio-check1"
            sourse="./images/selectWallet/handCash.png"
            imgAlt="hand-cash"
            imgWidth="44"
            imgHeigth="44"
            text="Handcash"
            value="Handcash"
          />
          <InputRadio
            checkboxname="check-wallet"
            checkboxId="radio-check2"
            sourse="./images/selectWallet/moneyButton.png"
            imgAlt="Moneybutton"
            imgWidth="44"
            imgHeigth="44"
            text="Moneybutton"
            value="Moneybutton"
          />
          <Button
            tagname={TagVariants.button}
            classname="btn disabled"
            cb={() => navigate("/User-name")}
            children="Continue"
          />
        </Form>
      </CardContent>
    </Card>
  );
};

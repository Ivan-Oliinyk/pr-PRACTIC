import React from "react";
import { LinkArrowBack } from "../../btns/LinkArrowBack";
import { Title } from "../../Title/Title";
import { RadioBtn } from "../../btns/RadioBtn";
import { Btn } from "../../btns/Btn";

export const SelectWallet: React.FC = () => {
  return (
    <>
      <div className="select-wallet">
        <LinkArrowBack linkTo="/" />
        <Title value="Select wallet" />

        <RadioBtn
          checkboxname="check-wallet"
          checkboxId="radio-check1"
          sourse="./images/selectWallet/handCash.png"
          imgAlt="hand-cash"
          imgWidth="44"
          imgHeigth="44"
          text="Handcash"
        />

        <RadioBtn
          checkboxname="check-wallet"
          checkboxId="radio-check2"
          sourse="./images/selectWallet/moneyButton.png"
          imgAlt="Moneybutton"
          imgWidth="44"
          imgHeigth="44"
          text="Moneybutton"
        />

        <Btn
          value="Continue"
          classname="btn select-wallet__link"
          linkTo="/UserName"
        />
      </div>
    </>
  );
};

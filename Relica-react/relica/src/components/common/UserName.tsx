import React from "react";
import { MainBg } from "../main-bg/main-bg";
import { LinkArrowBack } from "../btns/LinkArrowBack";
import { Title } from "../Title/Title";
import { ButtonPhoto } from "../btns/ButtonPhoto";
import { InputText } from "../inputText/InputText";
import { Btn } from "../btns/Btn";

export const UserName: React.FC = () => {
  return (
    <>
      {/* <MainBg /> */}
      <div className="select-wallet user-name">
        <LinkArrowBack linkTo="/SelectWallet" />
        <Title value="User name" />
        <ButtonPhoto />
        <InputText value="User name" />
        <Btn
          value="Continue"
          classname="btn select-wallet__link"
          linkTo="/LoginWithWallet"
        />
      </div>
    </>
  );
};

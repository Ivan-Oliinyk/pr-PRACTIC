import React from "react";
import { MainBg } from "../main-bg/main-bg";
import { Title } from "../Title/Title";
import { LinkArrowBack } from "../btns/LinkArrowBack";
import { InputText } from "../inputText/InputText";
import { Btn } from "../btns/Btn";
import { CheckboxForgot } from "../checkBox&Forgot/CheckboxForgot";

export const LoginWithWallet: React.FC = () => {
  return (
    <>
      {/* <MainBg /> */}
      <div className="select-wallet user-name">
        <LinkArrowBack linkTo="/" />
        <Title value="Log in with wallet" />
        <InputText value="Email" />
        <InputText value="Password" />
        <CheckboxForgot />
        <Btn
          value="Continue"
          classname="btn select-wallet__link"
          linkTo="/HomePage"
        />
      </div>
    </>
  );
};

import React from "react";
import { Title } from "../Title/Title";
import { LinkArrowBack } from "../linkArrowBack/LinkArrowBack";
import { InputText } from "../inputText/InputText";
import { Btn } from "../btn/Btn";
import { CheckboxForgot } from "../checkBox&Forgot/CheckboxForgot";

export const LoginWithWallet: React.FC = () => {
  return (
    <div className="select-wallet user-name">
      <LinkArrowBack />
      <Title value="Log in with wallet" />
      <InputText value="Email" />
      <InputText value="Password" />
      <CheckboxForgot />
      <Btn value="Continue" classname="btn select-wallet__link" />
    </div>
  );
};

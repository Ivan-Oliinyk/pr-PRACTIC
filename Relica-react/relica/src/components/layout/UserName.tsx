import React from "react";
import { LinkArrowBack } from "../linkArrowBack/LinkArrowBack";
import { Title } from "../Title/Title";
import { ButtonPhoto } from "../btns/ButtonPhoto";
import { InputText } from "../inputText/InputText";
import { Btn } from "../btns/Btn";

export const UserName: React.FC = () => {
  return (
    <div className="select-wallet user-name">
      <LinkArrowBack />
      <Title value="User name" />
      <ButtonPhoto />
      <InputText value="User name" />
      <Btn value="Continue" classname="btn select-wallet__link" />
    </div>
  );
};

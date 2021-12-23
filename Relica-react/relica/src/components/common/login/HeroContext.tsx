import React from "react";
import { Title } from "../../Title/Title";
import { Button } from "../../btns/Button";

export const HeroContext: React.FC = () => {
  return (
    <>
      <div className="hero__context">
        <Title value="Welcome" substring="How can we help you today?" />
        <ul className="btn__list">
          <Button
            value="Login with wallet"
            prop="btn btn__link"
            linkTo="/LoginWithWallet"
          />
          <Button
            value="Creete an account"
            prop="btn btn__link"
            linkTo="/SelectWallet"
          />
        </ul>
      </div>
    </>
  );
};

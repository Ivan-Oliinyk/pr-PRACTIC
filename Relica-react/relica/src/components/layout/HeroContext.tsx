import React from "react";
import { Button } from "../btns/Button";

export const HeroContext: React.FC = () => {
  return (
    <div className="hero__context">
      <h2 className="title">Welcome</h2>
      <p className="question">How can we help you today?</p>

      <ul className="btn__list">
        <Button
          value="Login with wallet"
          prop="btn btn__link"
          link="/LoginWithWallet"
        />
        <Button
          value="Creete an account"
          prop="btn btn__link"
          link="/UserName"
        />
      </ul>
    </div>
  );
};

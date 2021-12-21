import React from "react";
import { Button } from "../btn/Button";

export const HeroContext: React.FC = () => {
  return (
    <div className="hero__context">
      <h2 className="title">Welcome</h2>
      <p className="question">How can we help you today?</p>

      <ul className="btn__list">
        <Button value="Login with wallet" />
        <Button value="Creete an account" />
      </ul>
    </div>
  );
};

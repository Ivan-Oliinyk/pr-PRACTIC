import React from "react";
import { useNavigate } from "react-router-dom";
import { BtnBack } from "../../button/BtnBack";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";
import { Button } from "../../button/Button";
import { Card } from "../../card/Card";
import { CardHeader } from "../../card/CardHeader";
import { CardContent } from "../../card/CardContent";

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-wrapper">
      <Card classname="card">
        <CardHeader classname="card-header">
          <BtnBack text="Back" />
        </CardHeader>
        <CardContent classname="card-content">
          <Typography
            classname="h2 big"
            tagname={TagVariants.h2}
            children="Welcome"
          />
          <Typography
            classname="p medium mt-1"
            tagname={TagVariants.p}
            children="How can we help you today?"
          />
          <Button
            tagname={TagVariants.button}
            classname="btn"
            cb={() => navigate("/Login-with-wallet")}
            children="Login with wallet"
          />
          <Button
            tagname={TagVariants.button}
            classname="btn"
            cb={() => navigate("/Select-Wallet")}
            children="Create an account"
          />
        </CardContent>
      </Card>
    </div>
  );
};

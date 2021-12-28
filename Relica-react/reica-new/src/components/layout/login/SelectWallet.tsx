import React from "react";
import { Card } from "../../card/Card";
import { CardHeader } from "../../card/CardHeader";
import { CardContent } from "../../card/CardContent";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";
import { Button } from "../../button/Button";
import { BtnBack } from "../../button/BtnBack";

export const SelectWallet: React.FC = () => {
  return (
    <Card classname="card">
      <CardHeader classname="card-header">
        <BtnBack linkTo="/" />
      </CardHeader>
      <CardContent classname="card-content">
        <Typography
          classname="h2 big"
          tagname={TagVariants.h2}
          children="Select wallet"
        />
        <Button
          tagname={TagVariants.button}
          classname="btn"
          children="Login with wallet"
        />
        <Button
          tagname={TagVariants.button}
          classname="btn"
          children="Create an account"
        />
      </CardContent>
    </Card>
  );
};

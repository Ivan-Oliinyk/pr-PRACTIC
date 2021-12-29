import React from "react";
import { Card } from "../../card/Card";
import { CardHeader } from "../../card/CardHeader";
import { CardContent } from "../../card/CardContent";
import { Button } from "../../button/Button";
import { BtnBack } from "../../button/BtnBack";
import { Typography } from "../../typography/Typography";
import { TagVariants } from "../../typography/Typography";
import { Form } from "../../form/Form";
import { useNavigate } from "react-router-dom";
import { BtnPhoto } from "../../button/BtnPhoto";
import { InputText } from "../../form/InputText";

export const UserName: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card classname="card">
      <CardHeader classname="card-header">
        <BtnBack linkTo="/Select-Wallet" text="Back" />
      </CardHeader>
      <CardContent classname="card-content">
        <Typography
          classname="h2 big"
          tagname={TagVariants.h2}
          children="Username"
        />
        <Form>
          <BtnPhoto
            bgimage="/images/userName/userName.svg"
            img="/images/userName/photo-camera.svg"
            title="Profile photo"
            subtitle="Upload your profile photo here"
          />
          <InputText value="User name" />
          <Button
            tagname={TagVariants.button}
            classname="btn"
            cb={() => navigate("/Login-with-wallet")}
            children="Create user"
          />
        </Form>
      </CardContent>
    </Card>
  );
};

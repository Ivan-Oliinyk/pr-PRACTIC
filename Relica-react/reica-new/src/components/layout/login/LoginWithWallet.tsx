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
import { InputText } from "../../form/InputText";
import { CheckboxForgot } from "../../checkBox&Forgot/CheckboxForgot";
import { Checkbox } from "../../checkBox&Forgot/Checkbox";
import { Forgot } from "../../checkBox&Forgot/Forgot";

export const LoginWithWallet: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card classname="card">
      <CardHeader classname="card-header">
        <BtnBack linkTo="/User-name" text="Back" />
      </CardHeader>
      <CardContent classname="card-content">
        <Typography
          classname="h2 big"
          tagname={TagVariants.h2}
          children="Login with wallet"
        />
        <Form>
          <InputText value="Email" />
          <InputText value="Password" />
          <CheckboxForgot>
            <Checkbox value="Remember me" />
            <Forgot value="Forgot password ?" />
          </CheckboxForgot>
          <Button
            tagname={TagVariants.button}
            classname="btn"
            cb={() => navigate("/Home")}
            children="Log in"
          />
        </Form>
      </CardContent>
    </Card>
  );
};

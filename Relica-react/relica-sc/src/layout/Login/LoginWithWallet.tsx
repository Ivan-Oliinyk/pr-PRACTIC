import React from "react";
import { baseTheme } from "../../styles/theme";
import Card from "../../components/card/Card";
import CardHeader from "../../components/card/CardHeader";
import CardContent from "../../components/card/CardContent";
import Title from "./Title";
import BtnBack from "../../components/buttons/BtnBack";
import Button from "../../components/buttons/Button";
import Form from "../../components/form/Form";
import { LayoutContainer } from "./Welcome";
import InputText from "../../components/form/InputText";
import { CheckboxForgot } from "../../components/checkBox&Forgot/CheckboxForgot";
import { ForgotLink } from "../../components/checkBox&Forgot/ForgotLink";
import { Checkbox } from "../../components/checkBox&Forgot/Checkbox";

const LoginWithWallet: React.FC = () => {
  return (
    <LayoutContainer>
      <Card width="70%" maxWidth="40rem" margin="0 auto" direction="column">
        <CardHeader>
          <BtnBack linkTo="/User-name"></BtnBack>
        </CardHeader>
        <CardContent direction="column">
          <Title>Login with wallet</Title>
          <Form>
            <InputText value="Email" name="email" />
            <InputText value="Password" name="Password" />
            <CheckboxForgot>
              <Checkbox text="Remember me" />
              <ForgotLink text="Forgot password ?" />
            </CheckboxForgot>
            <Button
              border="1px solid #939393"
              borderRadius="3rem"
              minHeight="5.6rem"
              justify="center"
              align="center"
              weight={baseTheme.weight.bolt}
              linkTo="/home"
            >
              Log in
            </Button>
          </Form>
        </CardContent>
      </Card>
    </LayoutContainer>
  );
};

export default LoginWithWallet;

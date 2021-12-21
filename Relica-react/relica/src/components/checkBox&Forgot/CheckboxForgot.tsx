import React from "react";

import { Checkbox } from "./Checkbox";
import { Forgot } from "./Forgot";

export const CheckboxForgot: React.FC = () => {
  return (
    <div className="input-wrapper input-wrapper__logIn">
      <Checkbox value="Remember me" />
      <Forgot value="Forgot password ?" />
    </div>
  );
};

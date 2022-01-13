import React from "react";

export interface TypeProfileContext {
  data: { [key: string]: string };
  onChange: (data: TypeProfileContext["data"]) => void;
}

export const defaultProfile: TypeProfileContext["data"] = {
  name: "aaaaaaaa",
  email: "33333333",
};

class ProfileContext implements TypeProfileContext {
  data = { ...defaultProfile };

  onChange = (data: TypeProfileContext["data"]) => {
    this.data = { ...data };
  };
}

export const defaultContext = new ProfileContext();

export default React.createContext<TypeProfileContext>(defaultContext);

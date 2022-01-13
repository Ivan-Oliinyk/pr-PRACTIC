import React, { useState } from "react";

export interface TypeProfileContext {
  data: { [key: string]: string };
  onChange: (data: TypeProfileContext["data"]) => void;
}

export const defaultProfile: TypeProfileContext["data"] = {
  name: "Sara",
  email: "Sara@gmail.com",
};

// const [Data, setData] = useState({ name: "aa", email: "33" });

class ProfileContext implements TypeProfileContext {
  data = { ...defaultProfile };

  onChange = (data: TypeProfileContext["data"]) => {
    this.data = { ...data };

    console.log("666");
    console.log("data=> ", this.data);
    console.log("defaultProfile => ", defaultProfile);
  };
}

export const defaultContext = new ProfileContext();

export default React.createContext<TypeProfileContext>(defaultContext);

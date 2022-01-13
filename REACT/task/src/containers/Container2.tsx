import React, { useState } from "react";
import Component1 from "../components/Component1";
import Container1 from "./Container1";

type Container1Props = {
  data: { [key: string]: string };
  setData: (data: { [key: string]: string }) => void;
};

export default ({ data, setData }: Container1Props) => {
  const handleOnChange = (key: string, value: string) => {
    setData({
      ...data,
      [key]: value,
    });
    console.log("handleOnChange2", data);
  };

  console.log("Component2", data);

  return (
    <div>
      <Component1 data={data} onChange={handleOnChange} />
      <hr />
    </div>
  );
};

import React, { useContext, useState } from "react";
import Component1 from "../components/Component1";
import ProfileContext from "../contexts/ProfileContext";

type Container1Props = {
  // data: {[key: string]: string},
  setData: (data: { [key: string]: string }) => void;
};

export default ({ setData }: Container1Props) => {
  const { data, onChange } = useContext(ProfileContext);

  const handleOnChange = (key: string, value: string) => {
    onChange({
      ...data,
      [key]: value,
    });
    setData(data);
  };

  return <Component1 data={data} onChange={handleOnChange} />;
};

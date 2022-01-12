import React from "react";
import Container2 from "../container2/Container2";

const data = { name: "name", email: "email", password: "password" };
const onChange = (key, value) => {
  console.log(key, value);
  console.log(data);
  data[key] = value;
};

const Container1 = () => {
  return (
    <div>
      <h1>Contaier1</h1>
      <Container2 data={data} onchange={onChange}></Container2>
    </div>
  );
};

export default Container1;

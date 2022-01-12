import React from "react";
import Container3 from "../container3/Container3";

const Container2 = ({ data, onchange }) => {
  const keys = Object.keys(data);

  return (
    <>
      <h2>Container 2</h2>
      {keys.map((key, i) => (
        <Container3
          key={i}
          value={data[key]}
          onchange={(event) => onchange(key, event.target.value)}
        ></Container3>
      ))}
    </>
  );
};

export default Container2;

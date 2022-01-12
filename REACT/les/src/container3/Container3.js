import React from "react";

const Container3 = ({ value, onchange }) => {
  return (
    <div>
      <p>container 3</p>
      <label>
        <h2>{value}</h2>
        <input type="text" onChange={onchange}></input>
      </label>
    </div>
  );
};

export default Container3;

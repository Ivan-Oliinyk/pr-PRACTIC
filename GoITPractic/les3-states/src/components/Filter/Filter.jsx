import React, { Component } from "react";
import "./Filter.scss";

const Filter = ({ value, onChange }) => {
  return (
    <div className="input-filter">
      <label>
        Filter by name:
        <input type="text" value={value} onChange={onChange}></input>
      </label>
    </div>
  );
};

export default Filter;

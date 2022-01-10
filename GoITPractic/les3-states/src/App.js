import React from "react";
import ColorPicker from "./components/Colorpicker/ColorPicker";
import Counter from "./components/Counter/Counter";
import Dropdown from "./components/Dropdown/Dropdown";

const colorPickerOptions = [
  { label: "red", color: "red" },
  { label: "green", color: "green" },
  { label: "orange", color: "orange" },
  { label: "purple", color: "purple" },
  { label: "teal", color: "teal" },
  { label: "black", color: "black" },
  { label: "toxic", color: "toxic" },
  { label: "blue", color: "blue" },
];

const App = () => (
  <>
    <Counter />
    <Dropdown />
    <ColorPicker options={colorPickerOptions} />
  </>
);

export default App;

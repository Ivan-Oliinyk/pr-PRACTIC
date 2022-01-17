import "./App.css";
import { Component } from "react/cjs/react.production.min";
import Form from "./components/form/Form";
import ColorPicker from "./components/Colorpicker/ColorPicker";

const colorPickerOptions = [
  { label: "red", color: "red" },
  { label: "green", color: "green" },
  { label: "orange", color: "orange" },
  { label: "purple", color: "purple" },
  { label: "teal", color: "teal" },
  { label: "black", color: "black" },
  { label: "yellow", color: "yellow" },
  { label: "blue", color: "blue" },
];

const todos = [
  { id: "id-1", text: "Todo 1", complited: false },
  { id: "id-2", text: "Todo 2", complited: true },
  { id: "id-3", text: "Todo 3", complited: false },
  { id: "id-4", text: "Todo 4", complited: false },
  { id: "id-5", text: "Todo 5", complited: false },
];
class App extends Component {
  state = {
    inputValue: "1",
    formData: {},
  };

  getFormData = (data) => {
    this.setState({ formData: { ...this.formData, ...data } });
  };

  handleInputChange = (event) => {
    console.log(event.target.value);
    this.setState({ inputValue: event.target.value });
  };

  render() {
    return (
      <>
        <div
          style={{
            border: "2px solid black",
            borderRadius: "15px",
            width: "500px",
            textAlign: "center",
            padding: "20px",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <h1>Input element</h1>
          <input
            style={{ padding: "10px", borderRadius: "10px", fontSize: "16px" }}
            type="text"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />

          <Form data={this.getFormData}></Form>
        </div>
        <ColorPicker options={colorPickerOptions} />
      </>
    );
  }
}

export default App;

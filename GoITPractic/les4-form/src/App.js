import "./App.css";
import { Component } from "react/cjs/react.production.min";
import Form from "./components/form/Form";

class App extends Component {
  state = {
    inputValue: "1",
  };

  handleInputChange = (event) => {
    console.log(event.target.value);
    this.setState({ inputValue: event.target.value });
  };

  render() {
    return (
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

        <Form></Form>
      </div>
    );
  }
}

export default App;

import styled, { createGlobalStyle } from "styled-components";
import Component1 from "./components/Component1";
import Component2 from "./components/Component2";

const AppRoot = createGlobalStyle`
  * {
    font-family: 'Roboto', sans-serif;
  }

  html {
    font-size: 1.0px;
  }

  a {
    display: contents;
    * {
      outline: 1rem solid #00F;
    }
  }

  button {
    background: red;
    padding: 10px;
    margin: 5px auto;
    border-radius: 5px;
    display: block;
    color: white;
  }

  .field-wrapper {
    padding: 10px;
    background-color: green;
    margin-right: 10px;

    input {
      padding: 5px;
      background-color: green;
      border: 1px solid white;
      color: white;
      font-size: 16px;
      margin: 5px 5px 5px 0;
      border-radius: 5px;
    }
  }
`;

const AppWraper = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;

  display: flex;
  flex-direction: row;
  justify-content: center;

  .block {
    width: 100rem;
    height: 100rem;
    background: red;
  }

  input {
    padding: 10px;
    border-radius: 5px;
    border: 2px solid green;
    font-size: 16px;
    margin: 3px;
  }

  input + div {
    width: 200px;
    background-color: red;
    color: white;
    margin: 3px;
  }
`;

function App() {
  return (
    <>
      <AppRoot />
      <AppWraper>
        <Component1 />
        <Component2 />
      </AppWraper>
    </>
  );
}

export default App;

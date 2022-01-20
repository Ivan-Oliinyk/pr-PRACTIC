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
    background: blue;
  }
`;

const AppWraper = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;

  display: flex;
  flex-direction: column;

  .block {
    width: 100rem;
    height: 100rem;
    background: blue;
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;

  div {
    margin: 10px;
  }

  input {
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    border-color: blue !important;
  }
`;

function App() {
  return (
    <>
      <AppRoot />
      <AppWraper>
        <Wrapper>
          <Component1 />
          <Component2 />
        </Wrapper>
      </AppWraper>
    </>
  );
}

export default App;

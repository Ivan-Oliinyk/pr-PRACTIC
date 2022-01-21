import styled, { createGlobalStyle } from 'styled-components'
import Component1 from './components/Component1';
import Component2 from './components/Component2';



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
  }
`

const AppWraper = styled.div`
  width: 100%;
  height: 100vh; 
  background: #FFF;

  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .block {
    width: 100rem;
    height: 100rem;
    background: red;
  }
`






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


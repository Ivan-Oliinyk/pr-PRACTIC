import React from "react";
import GlobalStyles from "./styles/global";
import { ThemeProvider } from "styled-components";
import { baseTheme } from "./styles/theme";
import { LoginBg } from "./components/loginBg/LoginBg";

function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <GlobalStyles />
      <LoginBg />
    </ThemeProvider>
  );
}

export default App;

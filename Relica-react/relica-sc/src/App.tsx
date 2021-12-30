import React from "react";
import GlobalStyles from "./styles/global";
import { ThemeProvider } from "styled-components";
import { baseTheme } from "./styles/theme";
import Routing from "./routing/Routing";

function App() {
  return (
    <ThemeProvider theme={baseTheme}>
      <GlobalStyles />
      <Routing />
    </ThemeProvider>
  );
}

export default App;

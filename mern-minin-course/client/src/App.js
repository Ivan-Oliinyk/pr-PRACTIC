import "materialize-css";
import { userRoutes } from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const routes = userRoutes(false);
  return (
    <BrowserRouter>
      <div className="container">
        {/* <h1>Hellow</h1> */}
        {routes}
      </div>
    </BrowserRouter>
  );
}

export default App;

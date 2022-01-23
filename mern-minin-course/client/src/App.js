import "materialize-css";
import { userRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/auth.hooks";
import { AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar";

function App() {
  const { token, login, logout, userId } = useAuth();
  const isAutenticated = !!token;
  const routes = userRoutes(isAutenticated);
  return (
    <AuthContext.Provider
      value={{ token, login, logout, userId, isAutenticated }}
    >
      <BrowserRouter>
        {isAutenticated && <Navbar />}
        <div className="container">{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;

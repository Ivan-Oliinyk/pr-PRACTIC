import React from "react";
import { Routes, Route } from "react-router-dom";
// import { LoginPage } from "./pages/Login-page";

import { Login } from "./components/layout/Login";
import { HomePage } from "./pages/Home-page";

import { HeroContext } from "./components/common/HeroContext";
import { SelectWallet } from "./components/common/SelectWallet";
import { LoginWithWallet } from "./components/common/LoginWithWallet";
import { UserName } from "./components/common/UserName";
import { NotFoundPage } from "./pages/NotfoundPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />}>
          <Route index element={<HeroContext />} />
          <Route path="/SelectWallet" element={<SelectWallet />} />
          <Route path="/UserName" element={<UserName />} />
          <Route path="/LoginWithWallet" element={<LoginWithWallet />} />
        </Route>
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

// function App() {
//   return (
//     <Routes>
//       <Route path="*" element={<LoginPage />}></Route>
//       <Route path="/HomePage" element={<HomePage />}></Route>
//     </Routes>
//   );
// }

export default App;

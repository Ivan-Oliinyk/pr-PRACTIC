import React from "react";

import { Routes, Route, Link, Router } from "react-router-dom";

import { MainBg } from "../components/main-bg/main-bg";
import { HeroContext } from "../components/layout/HeroContext";
import { SelectWallet } from "../components/layout/SelectWallet";
import { LoginWithWallet } from "../components/layout/LoginWithWallet";
import { UserName } from "../components/layout/UserName";

// export const LoginPage: React.FC = () => {
//   return (
//     <section className="hero">
//       <MainBg />
//       <HeroContext />
//       {/* <SelectWallet /> */}
//       {/* <UserName /> */}
//       {/* <LoginWithWallet /> */}
//     </section>
//   );
// };

export const LoginPage: React.FC = () => {
  return (
    <>
      <section className="hero">
        <MainBg />
        <Router>
          <header>
            <Link to="/">Home</Link>
            <Link to="/SelectWallet">SelectWallet</Link>
            <Link to="/UserName">UserName</Link>
            <Link to="/LoginWithWallet">LoginWithWallet</Link>
          </header>
          <Routes>
            <Route path="/" element={<HeroContext />}></Route>
            <Route path="/SelectWallet" element={<SelectWallet />}></Route>
            <Route path="/UserName" element={<UserName />}></Route>
            <Route
              path="/LoginWithWallet"
              element={<LoginWithWallet />}
            ></Route>
          </Routes>
        </Router>
      </section>
    </>
  );
};

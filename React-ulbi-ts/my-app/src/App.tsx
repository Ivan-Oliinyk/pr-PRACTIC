import React, { useState, useEffect } from "react";
import { NavBar } from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToDoPages } from "./pages/ToDoPages";
import { AboutPage } from "./pages/AboutPages";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route element={<ToDoPages />} path="/"></Route>
          <Route element={<AboutPage />} path="/about"></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
